#!/usr/bin/env bash
# scripts/check_public_communication.sh — anti-regression for public copy.
#
# Goal: protect the strategic decision that public-facing copy positions
# orbit-prompt as a Claude Code plugin, while keeping the technical
# skill/plugin distinction in a dedicated section.
#
# Contract (fail-closed, any violation → exit 1):
#   1. README title is not skill-led
#   2. README contains the canonical short description
#   3. README mentions "Claude Code plugin"
#   4. README confines "orbit-prompt skill" to the technical section
#      ("## Skill or plugin?") — never before it
#   5. README has no confusing headline phrasings ("plugin that ships a
#      skill", "ships the orbit-prompt skill", etc.)
#   6. README contains the install command (/plugin install)
#   7. README has a troubleshooting / common-errors section
#   8. README has a Security section
#   9. README links to the issues page
#  10. .claude-plugin/plugin.json description leads with the plugin framing
#  11. .claude-plugin/marketplace.json description leads with the plugin framing
#
# Uses bash + grep + python3 (already required by check_claude_plugin_layout.sh).
# Usage: bash scripts/check_public_communication.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

README="README.md"
PLUGIN_JSON=".claude-plugin/plugin.json"
MARKETPLACE_JSON=".claude-plugin/marketplace.json"
TECH_SECTION_HEADER="## Skill or plugin?"
CANONICAL_DESC="A Claude Code plugin that turns rough ideas into structured prompts"

fail() { echo "[FAIL] $*" >&2; exit 1; }
pass() { echo "[PASS] $*"; }

echo ""
echo "── public communication ──"
echo ""

[[ -f "${README}" ]]         || fail "${README} missing"
[[ -f "${PLUGIN_JSON}" ]]    || fail "${PLUGIN_JSON} missing"
[[ -f "${MARKETPLACE_JSON}" ]] || fail "${MARKETPLACE_JSON} missing"

# ── 1. README title is not skill-led ───────────────────────────────────
title="$(grep -m1 -E '^# ' "${README}" || true)"
[[ -n "${title}" ]] || fail "README has no top-level title"
if echo "${title}" | grep -Eqi '^# .*\bSkill\b'; then
  fail "README title is skill-led: '${title}'"
fi
pass "README title is not skill-led"

# ── 2. canonical short description present ─────────────────────────────
grep -Fq "${CANONICAL_DESC}" "${README}" \
  || fail "README missing canonical short description: '${CANONICAL_DESC}'"
pass "README contains canonical short description"

# ── 3. "Claude Code plugin" present ────────────────────────────────────
grep -Fq "Claude Code plugin" "${README}" \
  || fail "README does not mention 'Claude Code plugin'"
pass "README mentions 'Claude Code plugin'"

# ── 4. "orbit-prompt skill" confined to technical section ──────────────
# Accepts either bare "orbit-prompt skill" or markdown "`orbit-prompt` skill".
skill_phrase_line=$(grep -nE '`?orbit-prompt`? skill' "${README}" | head -1 | cut -d: -f1 || true)
tech_section_line=$(grep -n -F "${TECH_SECTION_HEADER}" "${README}" | head -1 | cut -d: -f1 || true)
[[ -n "${tech_section_line}" ]] \
  || fail "README missing technical section '${TECH_SECTION_HEADER}'"
[[ -n "${skill_phrase_line}" ]] \
  || fail "README missing technical mention 'orbit-prompt skill'"
if (( skill_phrase_line < tech_section_line )); then
  fail "README mentions 'orbit-prompt skill' (line ${skill_phrase_line}) before technical section (line ${tech_section_line})"
fi
pass "README confines 'orbit-prompt skill' to the technical section"

# ── 5. forbidden headline phrasings ────────────────────────────────────
for forbidden in \
  "plugin that ships a skill" \
  "plugin that ships the orbit-prompt skill" \
  "ships the orbit-prompt skill" \
  "ships a skill"; do
  if grep -Fqi "${forbidden}" "${README}"; then
    fail "README contains forbidden headline phrasing: '${forbidden}'"
  fi
done
pass "README has no forbidden headline phrasing"

# ── 6. install command ─────────────────────────────────────────────────
grep -Fq "/plugin install" "${README}" \
  || fail "README does not include '/plugin install' command"
pass "README contains install command"

# ── 7. troubleshooting / common errors ─────────────────────────────────
grep -Eq '^#{1,3} +(Troubleshooting|Common errors)' "${README}" \
  || fail "README missing troubleshooting / common-errors section"
pass "README has troubleshooting section"

# ── 8. security section ────────────────────────────────────────────────
grep -Eq '^#{1,3} +Security' "${README}" \
  || fail "README missing Security section"
pass "README has Security section"

# ── 9. issues / feedback link ──────────────────────────────────────────
grep -Eq 'github\.com/IanVDev/orbit-prompt/issues' "${README}" \
  || fail "README missing issues / feedback link"
pass "README links to issues"

# ── 10. plugin.json description leads with plugin framing ──────────────
desc=$(python3 -c "import json,sys; print(json.load(open('${PLUGIN_JSON}'))['description'])")
case "${desc}" in
  "A Claude Code plugin"*) pass "${PLUGIN_JSON} description plugin-first" ;;
  *) fail "${PLUGIN_JSON} description must start with 'A Claude Code plugin' — got: '${desc}'" ;;
esac

# ── 11. marketplace.json description leads with plugin framing ─────────
mdesc=$(python3 -c "import json,sys; print(json.load(open('${MARKETPLACE_JSON}'))['plugins'][0]['description'])")
case "${mdesc}" in
  "A Claude Code plugin"*) pass "${MARKETPLACE_JSON} description plugin-first" ;;
  *) fail "${MARKETPLACE_JSON} plugins[0].description must start with 'A Claude Code plugin' — got: '${mdesc}'" ;;
esac

echo ""
echo "🟢 public communication OK"
