# Changelog

All notable changes to this project will be documented in this file.

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
