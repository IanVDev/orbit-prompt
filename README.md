# Orbit Prompt Skill

**Most AI correction turns are caused by vague prompts, not by the model.**

`orbit-prompt` catches weak prompts before they cost you turns. Two surfaces: a `/orbit-prompt` command you call explicitly, and automatic session diagnostics that stay silent when the session is healthy.

---

**Before:**
```
/orbit-prompt "Refactor auth module"
```

**After:**
```
[Orbit Engine — Prompt Analysis]

ORIGINAL: "Refactor auth module"

GAPS:
- No file target (which file?)
- No scope boundary (password? OAuth? both?)
- No acceptance criteria (what does done look like?)
- Risk: high speculation — will require corrections

SUGGESTED:
"Extract password validation from src/auth/auth.ts into
src/validators/password.ts. Keep existing function signatures.
Do not touch OAuth flow or routes. Done = all existing tests pass."
```

You copy what you want. Or ignore it. The skill sends nothing.

---

## What it is

A skill for Claude Code with two surfaces:

1. **`/orbit-prompt`** (primary) — You request an analysis of a prompt before sending it. The skill identifies gaps and suggests a structured version. You decide whether to use it.
2. **Session diagnostics** (automatic, silent by default) — The skill observes the session and only surfaces a diagnosis when it detects one of the 8 inefficiency patterns. When the session is healthy, it stays silent.

The skill **does not modify anything.** It reads, analyzes, and displays. You act.

---

## Main Command: `/orbit-prompt`

Use when you want to review a prompt before sending it.

**Syntax:**

```
/orbit-prompt "your prompt here"
```

**What happens:**

The skill reads the prompt, identifies what is missing (scope, acceptance criteria, boundaries) and displays a suggested version. You read it and decide whether to use it, adapt it, or discard it.

**Example:**

```
/orbit-prompt "Refactor auth module"
```

**Output:**

```
[Orbit Engine — Prompt Analysis]

ORIGINAL:
"Refactor auth module"

GAPS:
- No file target (which file?)
- No scope boundary (password? OAuth? both?)
- No acceptance criteria (what does done look like?)
- Risk: high speculation — will require corrections

SUGGESTED:
"Extract password validation from src/auth/auth.ts into
src/validators/password.ts. Keep existing function signatures.
Do not touch OAuth flow or routes. Done = all existing tests pass."

CHANGES MADE:
- Added specific file (auth.ts → validators/password.ts)
- Scoped to password only (not OAuth)
- Preserved contract (function signatures unchanged)
- Added verifiable success criterion
```

You copy what you want. Or ignore it. The skill sends nothing.

---

## Session Diagnostics

The skill watches the session and surfaces a diagnosis only when it detects one of the 8 patterns. If the session is healthy, it stays silent. You do not trigger anything — automatic detection is the default.

**Advanced triggers (optional):** if you want to force a diagnosis on demand instead of waiting for automatic detection, these natural-language phrases work:

```
analyze cost
/analyze-cost
how efficient is this?
is this optimal?
Before answering, apply orbit-engine
```

These are optional. The recommended flow is `/orbit-prompt` for prompt improvement and automatic detection for diagnosis.

**Output:**

```
[Orbit Engine]

DIAGNOSIS:
- Correction chain: 3 follow-ups correcting the same output
- auth.ts edited 4 times (rework pattern)

ACTIONS:
1. Restart with a scoped prompt
2. Use /compact to reduce accumulated context

DO NOT DO NOW:
- Continue correcting incrementally

Risk: medium
```

You read it. You decide.

---

## Full Example

**Situation:** Session with multiple corrections after a vague prompt.

```
Turn 1: "Refactor auth module"
        → Claude rewrote 3 files

Turn 2: "No, just the middleware"
        → Claude edited auth.ts

Turn 3: "Don't touch routes"
        → Claude edited routes.ts

Turn 4: "Keep the original signature"
        → Claude edited again
```

**Diagnosis:**

```
[Orbit Engine]

DIAGNOSIS:
- 3 follow-up corrections after initial output
- auth.ts edited 3 times in one session

ACTIONS:
1. Use /orbit-prompt before the next request to define scope
2. Use /compact before continuing

DO NOT DO NOW:
- Add another correction — resolves symptom, not cause

Risk: medium
```

---

## The 8 Detected Patterns

| Pattern | Description |
|---------|-------------|
| Unsolicited long responses | Output far exceeds what was requested |
| Correction chains | 3+ short follow-ups each correcting previous output |
| Repeated edits | Same file or function edited 3+ times |
| Exploratory searching | 5+ files read in one turn without a stated goal |
| Weak prompt | Complex task with no scope, boundary, or success criteria |
| Large inline content | Code block >100 lines pasted instead of referenced |
| Validation theater | Artifacts created but never executed or tested |
| Context accumulation | Long resumed session with irrelevant carried context |

Each pattern describes what was observed. Nothing is estimated or inferred.

---

## Install

**Claude Code:**

1. Download [`orbit-prompt.skill`](https://github.com/IanVDev/orbit-prompt/releases)
2. Claude Code → Settings → Skills → Install

**As a system prompt (any LLM):**

```bash
unzip orbit-prompt.skill
# Use the contents of SKILL.md as your system prompt
```

---

## Claude Code: Enable Autocomplete

Installing the skill makes the behavior available, but `/orbit-prompt` may not appear in the `/` autocomplete. To make it discoverable, add the slash command bridge to your project:

```bash
mkdir -p .claude/commands
curl -fsSLo .claude/commands/orbit-prompt.md \
  https://raw.githubusercontent.com/IanVDev/orbit-prompt/main/.claude/commands/orbit-prompt.md
```

Then restart the Claude Code session. The command will appear as `/orbit-prompt` in autocomplete.

The bridge file (`.claude/commands/orbit-prompt.md`) is a thin router — it does not contain the skill definition. The skill contract lives in `orbit-prompt.skill`.

> If you are working from a clone of this repo, the bridge is already at `.claude/commands/orbit-prompt.md`. Copy it to your project's `.claude/commands/` directory.

---

## SkillsMP / `SKILL.md` source

For marketplaces and tools that index the open `SKILL.md` format directly, the authoritative skill definition is exposed at:

```
skills/orbit-prompt/SKILL.md
```

Both surfaces ship identical content — `orbit-prompt.skill` (the packaged, installable artifact) and `skills/orbit-prompt/` (the extracted, indexable folder). A local check (`scripts/check_skill_public_layout.sh`) asserts they are in sync.

| Use case | Source |
|---|---|
| Install in Claude Code | `orbit-prompt.skill` (root) |
| Marketplace indexing | `skills/orbit-prompt/SKILL.md` |
| Use as system prompt (any LLM) | either — same content |

---

## Inside the `.skill`

```
orbit-prompt.skill
├── SKILL.md        — Full definition, patterns, and activation rules
├── QUICK-START.md  — Getting started (3 min)
├── ONBOARDING.md   — Complete usage guide
└── EXAMPLES.md     — 6 real-world scenarios with diagnostics
```

---

## Versioning

This repository uses two version layers:

- **Repository version** (`v0.x.y`) — distribution and packaging of this repo
- **Skill version** (`1.x.y` in `SKILL.md` frontmatter) — internal behavior and contract

They evolve independently. The repo version tracks distribution changes (README, packaging, metadata). The skill version tracks behavioral contract changes (triggers, output formats, patterns).

**Current:**

```
Repo:  v0.2.3
Skill: v1.2.0
```

Internal validation and the source of truth for the skill contract live in `orbit-engine` (gate `G16_skill_version`). This repo mirrors released artifacts only.

---

## Version

```
Version: 0.2.3
Skill:   v1.2.0
Status:  Production-ready
License: Copyright © 2026 Aurya. All rights reserved.
```

Developed by Aurya as part of Orbit Engine.
