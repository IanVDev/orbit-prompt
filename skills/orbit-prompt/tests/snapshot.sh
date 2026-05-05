#!/usr/bin/env bash
# Snapshot regression tests for orbit-prompt layered composition.
#
# Cases:
#   T1 happy-path WITH    --context-file → diff vs composed.with-context.expected.md
#   T2 happy-path WITHOUT --context-file → diff vs composed.no-context.expected.md
#   T3 --context-file points to missing file        → ERROR + exit 1
#   T4 --context-file points to a directory          → ERROR + exit 1
#   T5 --context-file points to an empty file        → ERROR + exit 1
#   T6 --context-file exceeds 64 KiB                 → ERROR + exit 1
#   T7 --context-file path-traversal outside workspace → ERROR + exit 1
#   T8 --context-file is symlink to outside workspace  → ERROR + exit 1
#   T9 invalid persona (legacy fail-closed)          → ERROR + exit 1
#
# Exit 0 only when all 9 pass. Final line: "OK: 9/9" or "FAIL: <p>/<t>".

set -uo pipefail

SKILL_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
COMPOSE="$SKILL_ROOT/lib/compose.sh"
FIXTURES="$SKILL_ROOT/tests/fixtures"

pass=0; fail=0
# tmpdir lives INSIDE the workspace so the oversized-file test (T6) hits the
# size check, not the workspace check. T7/T8 still target paths outside the
# workspace explicitly.
TMP_BASE="$SKILL_ROOT/tests/.tmp"
mkdir -p "$TMP_BASE"
TMPDIR_RUN=$(mktemp -d "$TMP_BASE/run.XXXXXX")
trap 'rm -rf "$TMPDIR_RUN"' EXIT

assert_pass() { echo "PASS $1"; pass=$((pass+1)); }
assert_fail() { echo "FAIL $1 — $2"; fail=$((fail+1)); }

# ---- Test 1: happy-path WITH context ------------------------------------
exp="$FIXTURES/composed.with-context.expected.md"
out="$TMPDIR_RUN/with.out"
err="$TMPDIR_RUN/with.err"
if bash "$COMPOSE" \
     --persona=security-architect \
     --contract=threat-model \
     --context-file="$FIXTURES/sample-context.md" \
     --task-file="$FIXTURES/task.txt" > "$out" 2>"$err"; then
  if diff -u "$exp" "$out" >/dev/null; then
    assert_pass "T1 happy-path with context"
  else
    assert_fail "T1 happy-path with context" "diff:"
    diff -u "$exp" "$out" || true
  fi
else
  assert_fail "T1 happy-path with context" "compose.sh exited non-zero — stderr: $(cat "$err")"
fi

# ---- Test 2: happy-path WITHOUT context ---------------------------------
exp="$FIXTURES/composed.no-context.expected.md"
out="$TMPDIR_RUN/no-ctx.out"
err="$TMPDIR_RUN/no-ctx.err"
if bash "$COMPOSE" \
     --persona=security-architect \
     --contract=threat-model \
     --task-file="$FIXTURES/task.txt" > "$out" 2>"$err"; then
  if diff -u "$exp" "$out" >/dev/null; then
    assert_pass "T2 happy-path no context"
  else
    assert_fail "T2 happy-path no context" "diff:"
    diff -u "$exp" "$out" || true
  fi
else
  assert_fail "T2 happy-path no context" "compose.sh exited non-zero — stderr: $(cat "$err")"
fi

# Helper: run compose expecting failure; assert error prefix on stderr.
expect_error() {
  local label="$1"; local prefix="$2"; shift 2
  local err="$TMPDIR_RUN/${label// /-}.err"
  if bash "$COMPOSE" "$@" >/dev/null 2>"$err"; then
    assert_fail "$label" "compose.sh accepted the bad input"
  elif grep -q "^ERROR: $prefix" "$err"; then
    assert_pass "$label"
  else
    assert_fail "$label" "wrong error: $(head -1 "$err")"
  fi
}

# ---- Test 3: missing context-file ---------------------------------------
expect_error "T3 missing context-file" \
  "context-file not found:" \
  --persona=security-architect --contract=threat-model \
  --context-file="$FIXTURES/does-not-exist.md" --task=x

# ---- Test 4: directory as context-file ----------------------------------
expect_error "T4 directory as context-file" \
  "context-file is not a regular file:" \
  --persona=security-architect --contract=threat-model \
  --context-file="$FIXTURES" --task=x

# ---- Test 5: empty context-file -----------------------------------------
expect_error "T5 empty context-file" \
  "context-file is empty:" \
  --persona=security-architect --contract=threat-model \
  --context-file="$FIXTURES/empty-context.md" --task=x

# ---- Test 6: oversized context-file -------------------------------------
big="$TMPDIR_RUN/big.md"
dd if=/dev/zero bs=1024 count=65 of="$big" status=none
expect_error "T6 oversized context-file" \
  "context-file exceeds 64 KiB:" \
  --persona=security-architect --contract=threat-model \
  --context-file="$big" --task=x

# ---- Test 7: path traversal outside workspace ---------------------------
expect_error "T7 path traversal outside workspace" \
  "context-file resolves outside workspace:" \
  --persona=security-architect --contract=threat-model \
  --context-file="/etc/hosts" --task=x

# ---- Test 8: symlink to outside workspace -------------------------------
sym="$TMPDIR_RUN/evil-symlink.md"
ln -s /etc/hosts "$sym"
expect_error "T8 symlink outside workspace" \
  "context-file resolves outside workspace:" \
  --persona=security-architect --contract=threat-model \
  --context-file="$sym" --task=x

# ---- Test 9: invalid persona (legacy regression) ------------------------
expect_error "T9 invalid persona" \
  'persona "hacker-doesnotexist" not found' \
  --persona=hacker-doesnotexist --contract=threat-model --task=x

# ---- Test 10: token allowlist rejects uppercase -------------------------
expect_error "T10 uppercase persona token" \
  'persona "Security-Architect" invalid' \
  --persona=Security-Architect --contract=threat-model --task=x

# ---- Test 11: --task and --task-file are mutually exclusive -------------
expect_error "T11 both task flags" \
  'use either --task or --task-file, not both' \
  --persona=security-architect --contract=threat-model \
  --task=inline --task-file="$FIXTURES/task.txt"

# ---- Summary ------------------------------------------------------------
total=$((pass+fail))
if [[ $fail -eq 0 ]]; then
  echo "OK: $pass/$total"
  exit 0
else
  echo "FAIL: $pass/$total"
  exit 1
fi
