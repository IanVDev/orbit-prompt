#!/usr/bin/env bash
# scripts/check_skill_public_layout.sh — valida layout público para SkillsMP.
#
# Contrato (fail-closed, qualquer violação → exit 1):
#   1. skills/orbit-prompt/SKILL.md existe
#   2. orbit-prompt.skill (ZIP) existe na raiz
#   3. orbit-prompt.skill contém SKILL.md internamente
#   4. Nenhum .DS_Store ou __MACOSX/ no ZIP
#   5. Frontmatter version: do SKILL.md público == frontmatter version: do SKILL.md empacotado
#
# Sem dependências externas (bash, grep, awk, sed, unzip).
# Uso: bash scripts/check_skill_public_layout.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "${REPO_ROOT}"

PUBLIC_SKILL="skills/orbit-prompt/SKILL.md"
SKILL_ZIP="orbit-prompt.skill"

fail() { echo "[FAIL] $*" >&2; exit 1; }
pass() { echo "[PASS] $*"; }

# Extrai a linha "version: X.Y.Z" do frontmatter YAML (entre os dois --- do topo).
# Aceita version: 1.2.3, version: "1.2.3", version: '1.2.3'.
parse_frontmatter_version() {
  local file="$1"
  awk '
    /^---[[:space:]]*$/ { fm++; if (fm == 2) exit; next }
    fm == 1 && /^version:[[:space:]]/ {
      v = $0
      sub(/^version:[[:space:]]+/, "", v)
      gsub(/[[:space:]"'"'"']+/, "", v)
      print v
      exit
    }
  ' "$file"
}

# ── 1. Pasta pública com SKILL.md ───────────────────────────────────────
[[ -f "${PUBLIC_SKILL}" ]] \
  || fail "${PUBLIC_SKILL} não existe"
pass "public SKILL.md presente"

# ── 2. Artefato empacotado na raiz ──────────────────────────────────────
[[ -f "${SKILL_ZIP}" ]] \
  || fail "${SKILL_ZIP} não existe na raiz"
pass "packaged ${SKILL_ZIP} presente"

# ── 3. ZIP contém SKILL.md ──────────────────────────────────────────────
# unzip -Z1 lista só nomes, um por linha — match exato evita ambiguidade.
ZIP_ENTRIES=$(unzip -Z1 "${SKILL_ZIP}")
echo "${ZIP_ENTRIES}" | grep -Fxq "SKILL.md" \
  || fail "${SKILL_ZIP} não contém SKILL.md"
pass "${SKILL_ZIP} contém SKILL.md"

# ── 4. Sem metadados macOS no ZIP ───────────────────────────────────────
if echo "${ZIP_ENTRIES}" | grep -qE '(\.DS_Store|__MACOSX)'; then
  echo "[FAIL] ${SKILL_ZIP} contém metadados macOS (.DS_Store ou __MACOSX)" >&2
  echo "${ZIP_ENTRIES}" | grep -E '(\.DS_Store|__MACOSX)' >&2
  exit 1
fi
pass "ZIP limpo (sem .DS_Store / __MACOSX)"

# ── 5. Paridade de versão público ↔ empacotado ──────────────────────────
PUB_VER=$(parse_frontmatter_version "${PUBLIC_SKILL}")
[[ -n "${PUB_VER}" ]] \
  || fail "version: ausente no frontmatter de ${PUBLIC_SKILL}"
[[ "${PUB_VER}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] \
  || fail "version do ${PUBLIC_SKILL} não é semver X.Y.Z: '${PUB_VER}'"

TMP="$(mktemp -d)"
trap 'rm -rf "${TMP}"' EXIT
unzip -p "${SKILL_ZIP}" SKILL.md > "${TMP}/PACKAGED.md" 2>/dev/null \
  || fail "falha ao extrair SKILL.md de ${SKILL_ZIP}"

PKG_VER=$(parse_frontmatter_version "${TMP}/PACKAGED.md")
[[ -n "${PKG_VER}" ]] \
  || fail "version: ausente no SKILL.md empacotado"

if [[ "${PUB_VER}" != "${PKG_VER}" ]]; then
  fail "version diverge — público=${PUB_VER}  empacotado=${PKG_VER}"
fi
pass "version parity ${PUB_VER} (public == packaged)"

echo ""
echo "🟢 skill public layout OK (v${PUB_VER})"
