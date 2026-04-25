# Changelog

All notable changes to this project will be documented in this file.

---

## [0.2.2] — 2026-04-25

### Added

- **`.claude/commands/orbit-prompt.md`** — slash command bridge for Claude Code autocomplete. Installing the skill alone may not surface `/orbit-prompt` in the `/` autocomplete. This bridge file, placed at `.claude/commands/orbit-prompt.md` in the user's project, registers the command explicitly. It is a thin router — skill definition stays in `orbit-prompt.skill`.
- **README: "Claude Code: Enable Autocomplete" section** — documents the bridge setup with a one-line `curl` install and clarifies when it is needed.

### Unchanged

- `orbit-prompt.skill` artifact — byte-for-byte identical to v0.2.1. No behavioral change to the skill.
- Embedded skill version remains `1.1.2`.

---

## [0.2.1] — 2026-04-23

### Added

- **Exposed `SKILL.md` under `skills/orbit-prompt/`** for marketplace indexing (e.g. SkillsMP). The directory mirrors the contents of `orbit-prompt.skill` so that tools which index the open `SKILL.md` format directly can discover and read the skill without unpacking the archive.
- `scripts/check_skill_public_layout.sh` — fail-closed local check asserting that the public folder and the packaged artifact stay in sync (both present, no macOS metadata, identical frontmatter version).

### Unchanged

- `orbit-prompt.skill` artifact — byte-for-byte identical to v0.2.0. The skill contract was not touched.
- Embedded skill version remains `1.1.2`.

---

## [0.2.0] — 2026-04-23

### Changed

- **Embedded skill** bumped from `1.1.0` to `v1.1.2` (prior `1.1.1` reference was a phantom version — never materialized in the skill artifact).
- **Usage model simplified.** `/orbit-prompt` is now the primary recommended entry point. Natural-language triggers (`analyze cost`, `is this optimal?`, etc.) are documented as *advanced triggers (optional)*.
- **Session diagnostics behavior corrected in docs.** The skill is silent by default and only surfaces a diagnosis when one of the 8 patterns is detected — aligned with actual activation rules in `SKILL.md`.
- **Versioning layers documented.** README now explains the distinction between repo version (`v0.x.y`) and skill version (`1.x.y`).

### Infrastructure

- Validation source of truth moved to `orbit-engine` (gate `G16_skill_version` enforces SSOT ↔ README marker ↔ tag consistency).
- This repo now mirrors released artifacts only — no internal logic.

---

## [0.1.0] — 2026-04-23

### Initial Release

First public release of the orbit-prompt skill.

**Included:**
- `orbit-prompt.skill` — installable skill for Claude Code
- `/orbit-prompt` command for explicit prompt analysis
- Session diagnostics with 8 observable patterns
- Full documentation inside the `.skill` file (SKILL.md, QUICK-START.md, ONBOARDING.md, EXAMPLES.md)

**Design principles:**
- Explicit activation only — no silent behavior
- Observable patterns — nothing inferred or estimated
- Fail-closed — if unsure, the skill stays silent
- No side effects — reads session history, outputs diagnosis, nothing else
