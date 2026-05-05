#!/usr/bin/env bash
# orbit-prompt — deterministic auto-router for the security posture.
#
# Reads task text, scans it against the fixed list in
# ../lib/sensitive-triggers.txt, and prints a single key=value line on stdout:
#
#   match found:  decision=auto persona=security-architect contract=threat-model trigger=<term>
#   no match:     decision=legacy
#
# Read-only. No network. No state. Exit 0 on success; exit 1 + ERROR: on
# input errors. The caller (the slash command) decides how to use the
# decision; this script never invokes compose.sh itself.

set -euo pipefail

SKILL_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
TRIGGERS_FILE="$SKILL_ROOT/lib/sensitive-triggers.txt"

usage() {
  cat <<'EOF'
Usage:
  route.sh (--task=<text> | --task-file=<path>)

Reads task text and decides between auto-routing and legacy mode.
Output: one line on stdout.
EOF
  exit 2
}

die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

# Escape an ERE term so metacharacters in trigger words do not become regex.
ere_escape() {
  printf '%s' "$1" | sed -E 's/[][\\^$.|?*+(){}]/\\&/g'
}

# Convert any whitespace inside a term to [[:space:]]+ so multi-word triggers
# (e.g. "bug bounty") match flexible spacing in the task text.
flex_spaces() {
  printf '%s' "$1" | sed -E 's/[[:space:]]+/[[:space:]]+/g'
}

task=""; task_file=""
for arg in "$@"; do
  case "$arg" in
    --task=*)      task="${arg#*=}" ;;
    --task-file=*) task_file="${arg#*=}" ;;
    -h|--help)     usage ;;
    *)             die "unknown flag: $arg" ;;
  esac
done

if [[ -n "$task" && -n "$task_file" ]]; then
  die "use either --task or --task-file, not both"
fi
if [[ -n "$task_file" ]]; then
  [[ -f "$task_file" ]] || die "task-file not found: $task_file"
  task=$(cat "$task_file")
fi
[[ -n "$task" ]] || die "task empty (use --task or --task-file)"

[[ -f "$TRIGGERS_FILE" ]] || die "triggers file missing: $TRIGGERS_FILE"

# Build the alternation. Sort terms by length descending so that ERE
# leftmost-longest semantics prefer specific matches (authentication) over
# their prefixes (auth) when both could apply at the same position.
sorted_terms=$(
  awk '
    /^[[:space:]]*#/ { next }
    /^[[:space:]]*$/ { next }
    {
      sub(/^[[:space:]]+/, "")
      sub(/[[:space:]]+$/, "")
      print
    }
  ' "$TRIGGERS_FILE" | awk '{ print length, $0 }' | LC_ALL=C sort -k1,1nr -k2 | cut -d' ' -f2-
)

[[ -n "$sorted_terms" ]] || die "triggers file has no terms"

alts=""
while IFS= read -r term || [[ -n "$term" ]]; do
  [[ -z "$term" ]] && continue
  esc=$(ere_escape "$term")
  esc=$(flex_spaces "$esc")
  alts="${alts:+$alts|}$esc"
done <<<"$sorted_terms"

# Lowercase ASCII only. Portuguese accented uppercase letters (Ã, Ç, …) are
# left as-is; users typically type tasks in natural casing where accented
# letters are already lowercase. Add accented uppercase variants to the
# triggers file if the corner case ever bites.
lower_task=$(printf '%s' "$task" | LC_ALL=C tr '[:upper:]' '[:lower:]')

# Normalise whitespace and pad ends so a non-alnum delimiter is guaranteed
# on both sides — this is the portable equivalent of \b on BSD/macOS grep,
# which lacks reliable ERE word-boundary support.
normalised=$(printf '%s' "$lower_task" | LC_ALL=C tr -s '[:space:]' ' ')
padded=" ${normalised} "

# Capture the first whole-word hit. The surrounding [^[:alnum:]_] ensures
# trigger=auth never matches inside "author" or "authentication".
captured=$(printf '%s' "$padded" | LC_ALL=C grep -Eo "[^[:alnum:]_](${alts})[^[:alnum:]_]" | head -n1 || true)

match=""
if [[ -n "$captured" ]]; then
  # Drop the one-char delimiters captured on each side.
  inner_len=$(( ${#captured} - 2 ))
  match=${captured:1:$inner_len}
  # Collapse internal whitespace runs back to a single space (multi-word
  # triggers normalise as " bug   bounty " → "bug bounty").
  match=$(printf '%s' "$match" | LC_ALL=C tr -s '[:space:]' ' ')
fi

if [[ -n "$match" ]]; then
  printf 'decision=auto persona=security-architect contract=threat-model trigger=%s\n' "$match"
else
  printf 'decision=legacy\n'
fi
