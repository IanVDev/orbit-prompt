#!/usr/bin/env bash
# scripts/check_claude_plugin_layout.sh — valida layout de Claude Code Plugin.
#
# Contrato (fail-closed, qualquer violação → exit 1):
#   1. .claude-plugin/plugin.json existe
#   2. .claude-plugin/marketplace.json existe e source é objeto github válido
#   3. skills/orbit-prompt/SKILL.md existe (superfície pública /orbit-prompt)
#   4. commands/orbit-prompt.md NÃO existe — presença cria /orbit-prompt:orbit-prompt,
#      duplicando a skill e confundindo o autocomplete
#   5. README.md não apresenta curl como caminho recomendado
#   6. README.md menciona /plugin install como caminho recomendado
#   7. README.md menciona /orbit-prompt como comando público
#
# Sem dependências externas além de python3 (para validação JSON).
# Uso: bash scripts/check_claude_plugin_layout.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

PLUGIN_JSON=".claude-plugin/plugin.json"
MARKETPLACE_JSON=".claude-plugin/marketplace.json"
SKILL_MD="skills/orbit-prompt/SKILL.md"
CMD_MD="commands/orbit-prompt.md"
README="README.md"

fail() { echo "[FAIL] $*" >&2; exit 1; }
pass() { echo "[PASS] $*"; }

echo ""
echo "── claude code plugin layout ──"
echo ""

# ── 1. plugin.json ──────────────────────────────────────────────────────
[[ -f "${PLUGIN_JSON}" ]] \
  || fail "${PLUGIN_JSON} missing"
pass "${PLUGIN_JSON} present"

# ── 2. marketplace.json — present and valid source schema ───────────────
[[ -f "${MARKETPLACE_JSON}" ]] \
  || fail "${MARKETPLACE_JSON} missing"
pass "${MARKETPLACE_JSON} present"

# source must be a github-type object, not the literal "." that caused
# "plugins.0.source: Invalid input" at /plugin marketplace add time.
python3 -c "
import json, sys
d = json.load(open('${MARKETPLACE_JSON}'))
src = d['plugins'][0]['source']
if not isinstance(src, dict) or src.get('source') != 'github' or 'repo' not in src:
    sys.exit(1)
" 2>/dev/null \
  || fail "${MARKETPLACE_JSON} plugins[0].source must be {\"source\":\"github\",\"repo\":\"owner/repo\"}"
pass "${MARKETPLACE_JSON} source schema valid (github object)"

# ── 3. skill ────────────────────────────────────────────────────────────
[[ -f "${SKILL_MD}" ]] \
  || fail "${SKILL_MD} missing"
pass "${SKILL_MD} present"

# ── 4. no duplicate command wrapper ─────────────────────────────────────
# commands/orbit-prompt.md would expose /orbit-prompt:orbit-prompt alongside
# the skill's /orbit-prompt, creating two near-identical autocomplete entries.
# The skill alone is the public surface; the command wrapper must not exist.
[[ ! -f "${CMD_MD}" ]] \
  || fail "${CMD_MD} exists — it creates /orbit-prompt:orbit-prompt, duplicating the skill's /orbit-prompt. Remove it."
pass "no duplicate command wrapper in plugin root"

# ── 5. README does not present curl as the recommended path ─────────────
[[ -f "${README}" ]] \
  || fail "${README} missing"

manual_line=$(grep -n -i "Manual fallback" "${README}" | head -1 | cut -d: -f1 || true)
curl_line=$(grep -n "curl" "${README}" | head -1 | cut -d: -f1 || true)

if [[ -n "${curl_line}" ]]; then
  if [[ -z "${manual_line}" ]]; then
    fail "README contains 'curl' but no 'Manual fallback' section"
  fi
  if (( curl_line < manual_line )); then
    fail "README shows 'curl' (line ${curl_line}) before 'Manual fallback' section (line ${manual_line})"
  fi
fi
pass "README curl placement OK (curl confined to Manual fallback)"

# ── 6. README announces /plugin install as the recommended path ─────────
grep -q "/plugin install" "${README}" \
  || fail "README does not announce '/plugin install' as the recommended install path"
pass "README announces /plugin install"

# ── 7. README exposes /orbit-prompt as the public command ───────────────
grep -q "/orbit-prompt" "${README}" \
  || fail "README does not mention '/orbit-prompt' as the public command"
pass "README mentions /orbit-prompt"

echo ""
echo "🟢 claude code plugin layout OK"
