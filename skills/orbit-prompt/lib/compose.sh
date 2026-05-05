#!/usr/bin/env bash
# orbit-prompt — deterministic prompt composition
# Final Prompt = Persona + Context + Task + Constraints + Output Contract
#
# Read-only. No network. No state. Fail-closed on invalid input.
# Layer files live under ../personas, ../context-packs, ../contracts.

set -euo pipefail

SKILL_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
PERSONA_DIR="$SKILL_ROOT/personas"
CONTEXT_DIR="$SKILL_ROOT/context-packs"
CONTRACT_DIR="$SKILL_ROOT/contracts"

usage() {
  cat <<'EOF'
Usage:
  compose.sh --persona=<name> --context=<name> --contract=<name>
             (--task=<text> | --task-file=<path>)

Composes a layered prompt from on-disk artifacts. Read-only; fail-closed.
EOF
  exit 2
}

die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

list_available() {
  # one dir → "[a,b,c]" sorted, comma-separated, no spaces
  local items
  items=$(find "$1" -maxdepth 1 -type f -name '*.md' -exec basename {} .md \; 2>/dev/null \
          | LC_ALL=C sort | paste -sd, -)
  printf '[%s]' "$items"
}

validate_token() {
  # Allowlist: lowercase kebab. Blocks slashes, dots, spaces, traversal.
  local value="$1" label="$2"
  [[ -n "$value" ]] || die "$label not provided"
  if [[ ! "$value" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
    die "$label \"$value\" invalid (only a-z, 0-9, '-')"
  fi
}

safe_resolve() {
  local dir="$1" name="$2" label="$3"
  local path="$dir/$name.md"
  if [[ ! -f "$path" ]]; then
    die "$label \"$name\" not found. Available: $(list_available "$dir")"
  fi
  # Defense in depth: realpath must stay under dir.
  local real_dir real_path
  real_dir=$(cd "$dir" && pwd -P)
  real_path=$(cd "$(dirname "$path")" && pwd -P)/$(basename "$path")
  case "$real_path" in
    "$real_dir"/*) ;;
    *) die "$label \"$name\" resolved outside $dir" ;;
  esac
  printf '%s\n' "$real_path"
}

# Strip YAML frontmatter (between first two --- lines) and any single blank line that follows.
body_only() {
  awk '
    BEGIN { in_fm=0; past_fm=0; ate_blank=0 }
    NR==1 && $0=="---" { in_fm=1; next }
    in_fm==1 && $0=="---" { in_fm=0; past_fm=1; ate_blank=0; next }
    in_fm==1 { next }
    past_fm==1 && ate_blank==0 && $0=="" { ate_blank=1; next }
    { past_fm=1; ate_blank=1; print }
  ' "$1"
}

persona=""; context=""; contract=""; task=""; task_file=""
for arg in "$@"; do
  case "$arg" in
    --persona=*)   persona="${arg#*=}" ;;
    --context=*)   context="${arg#*=}" ;;
    --contract=*)  contract="${arg#*=}" ;;
    --task=*)      task="${arg#*=}" ;;
    --task-file=*) task_file="${arg#*=}" ;;
    -h|--help)     usage ;;
    *)             die "unknown flag: $arg" ;;
  esac
done

validate_token "$persona"  "persona"
validate_token "$context"  "context"
validate_token "$contract" "contract"

PERSONA_FILE=$(safe_resolve "$PERSONA_DIR"   "$persona"  "persona")
CONTEXT_FILE=$(safe_resolve "$CONTEXT_DIR"   "$context"  "context")
CONTRACT_FILE=$(safe_resolve "$CONTRACT_DIR" "$contract" "contract")

if [[ -n "$task_file" ]]; then
  [[ -f "$task_file" ]] || die "task-file not found: $task_file"
  task=$(cat "$task_file")
fi
[[ -n "$task" ]] || die "task empty (use --task or --task-file)"

# Compose — fixed order, fixed headers, fixed separator.
{
  printf '# PERSONA\n'
  body_only "$PERSONA_FILE"
  printf '\n---\n# CONTEXT\n'
  body_only "$CONTEXT_FILE"
  printf '\n---\n# TASK\n%s\n' "$task"
  printf '\n---\n# CONSTRAINTS\n'
  printf -- '- Deterministic: same input produces the same structure.\n'
  printf -- '- No external calls, no state across runs.\n'
  printf -- '- Fail-closed: explicit ambiguity beats silent assumption.\n'
  printf -- '- Direction over execution: emit guidance, do not act.\n'
  printf '\n---\n# OUTPUT CONTRACT\n'
  body_only "$CONTRACT_FILE"
}
