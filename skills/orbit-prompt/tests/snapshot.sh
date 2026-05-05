#!/usr/bin/env bash
# Snapshot regression tests for orbit-prompt layered composition.
# Two cases: (1) happy-path golden diff, (2) fail-closed on invalid persona.
# Exit 0 only when both pass.

set -uo pipefail

SKILL_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
COMPOSE="$SKILL_ROOT/lib/compose.sh"
FIXTURES="$SKILL_ROOT/tests/fixtures"

pass=0; fail=0

# --- Test 1: happy-path snapshot ---
expected="$FIXTURES/composed.expected.md"
actual_tmp=$(mktemp)
trap 'rm -f "$actual_tmp"' EXIT

if bash "$COMPOSE" \
     --persona=security-architect \
     --context=orbit \
     --contract=threat-model \
     --task-file="$FIXTURES/task.txt" > "$actual_tmp" 2>/dev/null; then
  if diff -u "$expected" "$actual_tmp" >/dev/null; then
    echo "PASS happy-path snapshot"
    pass=$((pass+1))
  else
    echo "FAIL happy-path snapshot — diff:"
    diff -u "$expected" "$actual_tmp" || true
    fail=$((fail+1))
  fi
else
  echo "FAIL happy-path snapshot — compose.sh exited non-zero"
  fail=$((fail+1))
fi

# --- Test 2: fail-closed on invalid persona ---
err_tmp=$(mktemp)
trap 'rm -f "$actual_tmp" "$err_tmp"' EXIT

if bash "$COMPOSE" \
     --persona=hacker-doesnotexist \
     --context=orbit \
     --contract=threat-model \
     --task="x" > /dev/null 2> "$err_tmp"; then
  echo "FAIL fail-closed snapshot — compose.sh accepted invalid persona"
  fail=$((fail+1))
else
  if grep -q '^ERROR: persona "hacker-doesnotexist" not found' "$err_tmp"; then
    echo "PASS fail-closed snapshot"
    pass=$((pass+1))
  else
    echo "FAIL fail-closed snapshot — wrong error message:"
    cat "$err_tmp"
    fail=$((fail+1))
  fi
fi

total=$((pass+fail))
if [[ $fail -eq 0 ]]; then
  echo "OK: $pass/$total"
  exit 0
else
  echo "FAIL: $pass/$total"
  exit 1
fi
