https://github.com/user-attachments/assets/747913ce-ed00-4622-82fb-29b8e8dd4028


# Orbit Prompt

A Claude Code plugin that turns rough ideas into structured prompts.

**Most AI correction turns are caused by vague prompts, not by the model.**

`orbit-prompt` catches weak prompts before they cost you turns. Two surfaces: a `/orbit-prompt` command you call explicitly, and automatic session diagnostics that stay silent when the session is healthy.

---

### Example: turning a vague request into an actionable prompt

**Before:**

```bash
/orbit-prompt "Fix the login flow"
```

**After:**

```text
[Orbit Prompt: Prompt Analysis]

ORIGINAL:
"Fix the login flow"

GAPS:
- No platform or file target.
- No failure mode described.
- No expected behavior.
- No regression boundary.
- No validation plan.

RISK:
High speculation. A model may rewrite unrelated authentication code, change session behavior, or modify parts of the login flow that are not related to the actual issue.

SUGGESTED PROMPT:

Investigate and fix the login redirect issue in the web app.

Context:
Users can submit valid credentials, but after login they are sometimes redirected back to the login page instead of reaching the dashboard.

Scope:
- Focus only on the web login flow.
- Start by inspecting the auth route, session handling, and dashboard redirect guard.
- Do not refactor the full authentication module.
- Do not change password validation, OAuth behavior, or API contracts unless a failing test proves they are involved.
- Prefer the smallest safe change that fixes the redirect behavior.

Expected work:
1. Reproduce or identify the redirect failure path.
2. Find the smallest safe code change.
3. Add or update one regression test that proves a valid logged-in user reaches the dashboard.
4. Keep existing tests passing.

Acceptance criteria:
- Valid login redirects to the dashboard.
- Invalid login keeps the current error behavior.
- Existing session behavior remains unchanged.
- At least one regression test covers the redirect behavior.
- No unrelated authentication files are modified.
- All existing tests pass.

Recommended first step:
Search for the login submit handler, session persistence logic, and dashboard redirect guard before editing code.
```

This turns a vague request into a scoped engineering task with a clear target, explicit risk, safe boundaries, acceptance criteria, and a regression test.

You copy what you want. Or ignore it. The plugin sends nothing.

---

## What it is

A Claude Code plugin that turns rough ideas into structured prompts. It exposes two surfaces:

1. **`/orbit-prompt`** (primary) — You request an analysis of a prompt before sending it. The plugin identifies gaps and suggests a structured version. You decide whether to use it.
2. **Session diagnostics** (automatic, silent by default) — It observes the session and only surfaces a diagnosis when it detects one of the 8 inefficiency patterns. When the session is healthy, it stays silent.

The plugin **does not modify anything.** It reads, analyzes, and displays. You act.

---

## Main Command: `/orbit-prompt`

Use when you want to review a prompt before sending it.

**Syntax:**

```
/orbit-prompt "your prompt here"
```

**What happens:**

The plugin reads the prompt, identifies what is missing (scope, acceptance criteria, boundaries) and displays a suggested version. You read it and decide whether to use it, adapt it, or discard it.

**Example:**

```
/orbit-prompt "Refactor auth module"
```

**Output:**

```
[Orbit Prompt — Prompt Analysis]

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

You copy what you want. Or ignore it. The plugin sends nothing.

---

## Session Diagnostics

The plugin watches the session and surfaces a diagnosis only when it detects one of the 8 patterns. If the session is healthy, it stays silent. You do not trigger anything — automatic detection is the default.

**Advanced triggers (optional):** if you want to force a diagnosis on demand instead of waiting for automatic detection, these natural-language phrases work:

```
analyze cost
/analyze-cost
how efficient is this?
is this optimal?
```

These are optional. The recommended flow is `/orbit-prompt` for prompt improvement and automatic detection for diagnosis.

**Output:**

```
[Orbit Prompt]

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
[Orbit Prompt]

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

## Skill or plugin?

`orbit-prompt` is distributed as a **Claude Code plugin**. Internally, it includes the `orbit-prompt` skill used by Claude Code.

These are two different things:

| Term | What it means |
|---|---|
| Plugin | The installable package (`orbit-prompt`) |
| Skill | The functional resource bundled inside the plugin |
| `/orbit-prompt` | The slash command you type in Claude Code |

You install the plugin once. Claude Code wires the bundled skill behind the `/orbit-prompt` slash command. After that, you never interact with the plugin directly again.

---

## Install

### Claude Code plugin (recommended)

> **Do not paste these commands in your terminal (zsh, bash, PowerShell).**
> They are Claude Code slash commands. Open Claude Code first, then type them in the chat input.

Installs the skill, the `/orbit-prompt` slash command, and the autocomplete entry in one sequence. You do not need to clone this repository, download any file, or copy anything manually.

**Step 1 — Add the marketplace**

```
/plugin marketplace add IanVDev/orbit-prompt
```

Registers this repository as a plugin source inside Claude Code.

**Step 2 — Install the plugin**

```
/plugin install orbit-prompt@orbit-prompt
```

Downloads and installs the `orbit-prompt` plugin from the source added above.

**Step 3 — Reload plugins**

```
/reload-plugins
```

Applies the installation. After this, the slash command is active in the current session.

**Step 4 — Confirm it worked**

Type `/` in Claude Code. `/orbit-prompt` should appear in the autocomplete list.

If it does not appear, run `/reload-plugins` once more and type `/` again.

### Common errors

**Running `/plugin` in the terminal**

If you paste a command in your terminal instead of Claude Code, you will see:

```
zsh: no such file or directory: /plugin
```

`/plugin` is not a shell command. It is a Claude Code internal command. Open Claude Code and type the command there.

| Command | Where to run |
|---|---|
| `/plugin marketplace add ...` | Inside Claude Code |
| `/plugin install ...` | Inside Claude Code |
| `/reload-plugins` | Inside Claude Code |

**Marketplace schema error**

If the marketplace loads but the plugin is not found:

```
Failed to parse marketplace file: plugins.0.source: Invalid input
Plugin "orbit-prompt" not found in any marketplace
```

This means the `marketplace.json` in the repository has an invalid `source` field. This was a known issue fixed in v0.3.1. Update your marketplace with:

```
/plugin marketplace update IanVDev/orbit-prompt
```

Then run Step 2 again.

### As a system prompt (any LLM)

```bash
unzip orbit-prompt.skill
# Use the contents of SKILL.md as your system prompt
```

---

## Quick start

After installing, use:

```
/orbit-prompt your request here
```

Describe what you want in plain language. The plugin structures it into a prompt that is scoped, constrained, and verifiable.

**Example:**

```
/orbit-prompt review this project for bugs, security risks, and improvement points
```

The plugin returns:

- **ORIGINAL PROMPT** — what you wrote, unchanged
- **ANALYSIS** — what is ambiguous or missing (max 3 items)
- **IMPROVED PROMPT** — a structured version with scope and success criteria
- **KEY IMPROVEMENTS** — what was added and why
- **READY TO SEND** — `Yes` or `No`, with reason if no

---

## Manual fallback

Use this only if the plugin path is unavailable (offline mirror, restricted environment, custom packaging). The plugin install above is the supported route.

1. Download [`orbit-prompt.skill`](https://github.com/IanVDev/orbit-prompt/releases) and install via Claude Code → Settings → Skills.
2. Add the slash command bridge to your project so `/orbit-prompt` appears in autocomplete:

```bash
mkdir -p .claude/commands
curl -fsSLo .claude/commands/orbit-prompt.md \
  https://raw.githubusercontent.com/IanVDev/orbit-prompt/main/.claude/commands/orbit-prompt.md
```

Then restart the Claude Code session. The bridge file is a thin router — the skill contract lives in `orbit-prompt.skill`.

---

## Security and privacy

The plugin reads the session history and displays analysis. It does not execute code, call external APIs, write files, or send data anywhere. Nothing leaves your local session.

---

## Feedback and issues

Found a bug, a confusing message, or want to suggest an improvement?

- Open an issue: <https://github.com/IanVDev/orbit-prompt/issues>
- Use the **User feedback** template when available — it asks for environment, command, observed behavior, expected behavior, and redacted logs.

Please redact secrets, tokens, and proprietary content before submitting.

---

## Note for contributors

If you have this repository open in Claude Code **and** the plugin installed, you will see two `/orbit-prompt` entries in the autocomplete:

- one from the installed plugin
- one from the local project (`skills/orbit-prompt/SKILL.md` in this repo, shown as `(project)`)

This is expected behavior in a development environment. Claude Code auto-discovers skills in `skills/*/SKILL.md` within the open project, in addition to installed plugins.

To validate the end-user experience, test in a folder outside this repository. In that context, only one `/orbit-prompt` entry should appear.

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
Repo:  v0.3.0
Skill: v1.2.1
```

---

## Version

```
Version: 0.3.0
Skill:   v1.2.1
Status:  Production-ready
License: Copyright © 2026 Aurya. All rights reserved.
```

Developed by Aurya.
