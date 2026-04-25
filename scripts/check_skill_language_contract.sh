#!/usr/bin/env bash
# scripts/check_skill_language_contract.sh — valida que o contrato de idioma
# está presente e correto no SKILL.md público.
#
# Contrato (fail-closed, qualquer violação → exit 1):
#   1. skills/orbit-prompt/SKILL.md existe
#   2. Contém a regra de idioma padrão em inglês
#   3. Contém a regra de override explícito por solicitação do usuário
#
# Uso: bash scripts/check_skill_language_contract.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILL_MD="${REPO_ROOT}/skills/orbit-prompt/SKILL.md"

fail() { echo "[FAIL] $*" >&2; exit 1; }
pass() { echo "[PASS] $*"; }

echo ""
echo "── skill language contract ──"
echo ""

[[ -f "${SKILL_MD}" ]] \
  || fail "skills/orbit-prompt/SKILL.md not found"
pass "SKILL.md found"

grep -qi "Default output language: English" "${SKILL_MD}" \
  || fail "Missing: 'Default output language: English' in SKILL.md"
pass "default English output rule present"

grep -qi "unless.*explicitly" "${SKILL_MD}" || \
grep -qi "Only.*if the user explicitly" "${SKILL_MD}" \
  || fail "Missing: explicit language override rule in SKILL.md"
pass "language override rule present"

echo ""
echo "🟢 skill language contract OK"
