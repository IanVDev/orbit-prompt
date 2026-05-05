#!/usr/bin/env bash
# orbit-prompt — deterministic prompt composition
# Final Prompt = Persona + [Context] + Task + Constraints + Output Contract
#
# Read-only. No network. No state. Fail-closed on invalid input.
# Persona/contract live under ../personas, ../contracts. Context is supplied by
# the caller via --context-file (path to a markdown/text file in the workspace).
# When --context-file is absent, the # CONTEXT section is omitted entirely.

set -euo pipefail

SKILL_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
PERSONA_DIR="$SKILL_ROOT/personas"
CONTRACT_DIR="$SKILL_ROOT/contracts"

# Workspace anchor for path-traversal / symlink checks. Repo root if available;
# otherwise current physical directory.
WORKSPACE="$(git -C "$SKILL_ROOT" rev-parse --show-toplevel 2>/dev/null || pwd -P)"

# 64 KiB cap on user-provided context files.
CONTEXT_MAX_BYTES=65536

usage() {
  cat <<'EOF'
Usage:
  compose.sh --persona=<name> --contract=<name>
             [--context-file=<path>]
             (--task=<text> | --task-file=<path>)

Composes a layered prompt from on-disk artifacts. Read-only; fail-closed.
EOF
  exit 2
}

die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

list_available() {
  local items
  items=$(find "$1" -maxdepth 1 -type f -name '*.md' -exec basename {} .md \; 2>/dev/null \
          | LC_ALL=C sort | paste -sd, -)
  printf '[%s]' "$items"
}

validate_token() {
  local value="$1" label="$2"
  [[ -n "$value" ]] || die "$label not provided"
  if [[ ! "$value" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
    die "$label \"$value\" invalid (only a-z, 0-9, '-')"
  fi
}

safe_resolve_token() {
  local dir="$1" name="$2" label="$3"
  local path="$dir/$name.md"
  if [[ ! -f "$path" ]]; then
    die "$label \"$name\" not found. Available: $(list_available "$dir")"
  fi
  # Reject symlinks outright — built-in layers must be plain regular files.
  [[ ! -L "$path" ]] || die "$label \"$name\" must not be a symlink"
  # Resolve the FILE itself (not just its dirname) to catch symlink targets.
  local real_dir real_path
  real_dir=$(cd "$dir" && pwd -P)
  real_path=$(realpath_p "$path")
  [[ -n "$real_path" ]] || die "$label \"$name\" failed to resolve"
  case "$real_path" in
    "$real_dir"/*) ;;
    *) die "$label \"$name\" resolved outside $dir" ;;
  esac
  printf '%s\n' "$real_path"
}

# Portable physical realpath. Avoids GNU-only flags.
realpath_p() {
  local target="$1"
  if command -v realpath >/dev/null 2>&1; then
    realpath -P "$target" 2>/dev/null && return 0
  fi
  python3 -c 'import os, sys; print(os.path.realpath(sys.argv[1]))' "$target" 2>/dev/null
}

validate_context_file() {
  # Order matters: traversal/symlink check runs BEFORE reading size/content.
  local path="$1"
  [[ -n "$path" ]] || die "context-file path empty"
  [[ -e "$path" ]] || die "context-file not found: $path"
  [[ ! -d "$path" ]] || die "context-file is not a regular file: $path"
  [[ -f "$path" ]] || die "context-file is not a regular file: $path"

  local real
  real=$(realpath_p "$path")
  [[ -n "$real" ]] || die "context-file resolves outside workspace: $path"
  case "$real" in
    "$WORKSPACE"/*|"$WORKSPACE") ;;
    *) die "context-file resolves outside workspace: $path" ;;
  esac

  [[ -s "$path" ]] || die "context-file is empty: $path"

  local size
  size=$(wc -c < "$path" | tr -d ' ')
  if [[ "$size" -gt "$CONTEXT_MAX_BYTES" ]]; then
    die "context-file exceeds 64 KiB: $path ($size bytes)"
  fi

  printf '%s\n' "$real"
}

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

persona=""; contract=""; context_file=""; task=""; task_file=""
for arg in "$@"; do
  case "$arg" in
    --persona=*)      persona="${arg#*=}" ;;
    --contract=*)     contract="${arg#*=}" ;;
    --context-file=*) context_file="${arg#*=}" ;;
    --task=*)         task="${arg#*=}" ;;
    --task-file=*)    task_file="${arg#*=}" ;;
    -h|--help)        usage ;;
    *)                die "unknown flag: $arg" ;;
  esac
done

validate_token "$persona"  "persona"
validate_token "$contract" "contract"

PERSONA_FILE=$(safe_resolve_token "$PERSONA_DIR"  "$persona"  "persona")
CONTRACT_FILE=$(safe_resolve_token "$CONTRACT_DIR" "$contract" "contract")

CONTEXT_REAL=""
if [[ -n "$context_file" ]]; then
  CONTEXT_REAL=$(validate_context_file "$context_file")
fi

if [[ -n "$task" && -n "$task_file" ]]; then
  die "use either --task or --task-file, not both"
fi
if [[ -n "$task_file" ]]; then
  [[ -f "$task_file" ]] || die "task-file not found: $task_file"
  task=$(cat "$task_file")
fi
[[ -n "$task" ]] || die "task empty (use --task or --task-file)"

# Compose — fixed order, fixed headers. CONTEXT section is omitted when no
# --context-file was supplied (keeps output deterministic and minimal).
{
  printf '# PERSONA\n'
  body_only "$PERSONA_FILE"
  if [[ -n "$CONTEXT_REAL" ]]; then
    printf '\n---\n# CONTEXT\n'
    cat "$CONTEXT_REAL"
    # Ensure trailing newline before the next separator even if file lacks one.
    [[ "$(tail -c1 "$CONTEXT_REAL" | od -An -c | tr -d ' ')" == "\\n" ]] || printf '\n'
  fi
  printf '\n---\n# TASK\n%s\n' "$task"
  printf '\n---\n# CONSTRAINTS\n'
  printf -- '- Deterministic: same input produces the same structure.\n'
  printf -- '- No external calls, no state across runs.\n'
  printf -- '- Fail-closed: explicit ambiguity beats silent assumption.\n'
  printf -- '- Direction over execution: emit guidance, do not act.\n'
  printf '\n---\n# OUTPUT CONTRACT\n'
  body_only "$CONTRACT_FILE"
}
