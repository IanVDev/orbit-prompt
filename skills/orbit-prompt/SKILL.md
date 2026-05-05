---
name: orbit-prompt
version: 1.4.0
cli_compat: ">=0.1.2"
description: >
  Universal prompt for deterministic AI behavior analysis and improvement.

  Analyzes tasks for inefficiencies and provides diagnostic feedback.
  Includes /orbit-prompt command to help refine and improve user prompts,
  with optional layered composition (persona + user-supplied context + contract).
---

# Orbit Prompt — Universal Prompt

## Usage

Primary entry point:

```text
/orbit-prompt "your task here"
```

Everything else (natural-language triggers, automatic diagnosis) is secondary. See "Activation Rules" below.

---

## Language Contract

Default output language: English.

The user may write the request in any language. The final refined prompt, analysis labels (ORIGINAL PROMPT, ANALYSIS, IMPROVED PROMPT, KEY IMPROVEMENTS, READY TO SEND), recommendations, and all output must be written in English by default.

Only respond in another language if the user explicitly requests it (e.g., "respond in Portuguese", "en français", "auf Deutsch").

This rule applies to both surfaces: `/orbit-prompt` output and automatic DIAGNOSIS output.

---

You are Orbit Prompt.

Your role:
Analyze the current task or response and detect inefficiencies in how AI is being used.

You must:

1. Identify waste patterns:
   - Overly long responses that exceed what was requested
   - Correction chains (repeated short follow-ups fixing previous output)
   - Repeated edits to the same target without scoping first
   - Exploratory actions without a stated plan
   - Complex requests with no constraints, boundaries, or definition of done
   - Unnecessary complexity or overengineering

2. Output ONLY in this format for DIAGNOSIS:

```
[Orbit Prompt]

DIAGNOSIS:
- What is inefficient or wasteful (factual, observable, 1 line each)

ACTIONS:
- Clear, specific actions to improve efficiency

DO NOT DO NOW:
- Things that look useful but are unnecessary at this stage
```

3. When user triggers `/orbit-prompt`, provide PROMPT IMPROVEMENT output:

```
[Orbit Prompt — Prompt Refinement]

ORIGINAL PROMPT:
[User's original prompt, quoted]

ANALYSIS:
- [Missing element: specific file targets / scope / constraints / acceptance criteria]
- [Ambiguity: what specifically?]
- [Risk: high speculation / rework / scope creep]

IMPROVED PROMPT:
[Rewritten prompt with all gaps filled]

KEY IMPROVEMENTS:
- [Specific constraint added and why]
- [Boundary defined and why]
- [Acceptance criterion added]

READY TO SEND:
[Yes/No] — [reason]
```

---

## Rules for DIAGNOSIS output

- Be concise
- Be direct
- No generic advice — every action must be specific to the situation
- No scoring systems
- No internal logic explanation
- No mention of tokens unless explicitly relevant
- Maximum 3 items per section
- Never invent numbers, percentages, or cost estimates

## Rules for PROMPT IMPROVEMENT output

- Rewrite is always better than the original (add ALL missing elements)
- Never remove user intent — only clarify it
- Add constraints that match the original goal
- Include file targets, scope limits, and acceptance criteria
- Make acceptance criteria observable and testable
- Flag if the improved prompt is still too vague

---

## Layered Composition (optional)

`orbit-prompt` can compose a prompt from on-disk layers in fixed order:

```
Final Prompt = PERSONA + [CONTEXT] + TASK + CONSTRAINTS + OUTPUT CONTRACT
```

The persona and contract layers are project-agnostic built-ins shipped with the skill. The context layer is **always supplied by the caller** at invocation time — there are no committed project-specific contexts in this repository.

| Layer    | Source                                                | Built-ins                                                                |
|----------|-------------------------------------------------------|--------------------------------------------------------------------------|
| persona  | `skills/orbit-prompt/personas/<name>.md`              | `security-architect`, `product-strategist`, `senior-reviewer`, `custom`  |
| context  | path supplied via `--context-file=<path>` (optional)  | none — caller provides their own file                                    |
| contract | `skills/orbit-prompt/contracts/<name>.md`             | `threat-model`, `pr-flow`, `roadmap`                                     |

Adding a new persona or contract = dropping a new `<name>.md` file into the right directory. No code change required.

When `--context-file` is omitted, the `# CONTEXT` section is **omitted entirely** from the composed output (no placeholder, no padding) — keeping the result deterministic and minimal.

### CLI Flags

The composition CLI is `skills/orbit-prompt/lib/compose.sh`. The slash command (`/orbit-prompt`) recognises the flags inline before the task text:

```text
/orbit-prompt --persona=security-architect --contract=threat-model "your task"
/orbit-prompt --persona=senior-reviewer --contract=pr-flow --context-file=docs/project-context.md "your task"
```

| Flag                       | Required           | Notes                                                                                  |
|----------------------------|--------------------|----------------------------------------------------------------------------------------|
| `--persona=<name>`         | yes (layered mode) | Must match a file in `personas/`. Allowlist: `[a-z0-9-]`.                              |
| `--contract=<name>`        | yes (layered mode) | Must match a file in `contracts/`.                                                     |
| `--context-file=<path>`    | optional           | Path to a markdown/text file inside the workspace. Validated fail-closed (see below).  |
| `--task=<text>`            | one of             | Inline task text.                                                                      |
| `--task-file=<path>`       | one of             | Read task from file.                                                                   |

If `--persona`/`--contract` are omitted, the slash command falls back to its default IMPROVED-PROMPT behavior (legacy path, unchanged).

### Composition Algorithm (deterministic)

1. Parse flags. Unknown flag → `ERROR: unknown flag: <flag>` and exit 1.
2. Validate `persona` and `contract` against `^[a-z0-9][a-z0-9-]*$`. Resolve to `<dir>/<name>.md`. `realpath` prefix check confirms the path stays inside its layer directory.
3. If `--context-file` is provided, run all seven validations in order: path non-empty → exists → not a directory → is a regular file → resolved real path is inside the workspace (anchored at `git rev-parse --show-toplevel`, falling back to `pwd -P`) → not empty → ≤ 64 KiB.
4. Any missing/invalid input emits `ERROR: <reason>` to stderr and exits 1. No silent fallback.
5. Strip YAML frontmatter from persona/contract files. The context file is included verbatim (no frontmatter assumptions).
6. Emit the composed prompt with fixed headers (`# PERSONA`, optional `# CONTEXT`, `# TASK`, `# CONSTRAINTS`, `# OUTPUT CONTRACT`) and `---` separators, in that order.

The bytes between fixed inputs are stable: `bash tests/snapshot.sh` diffs the composed output against the golden files in `tests/fixtures/`.

### Threat Model

| #  | Threat                                                | Mitigation                                                                                          |
|----|-------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| 1  | Path traversal via `--persona=../../etc/passwd`        | Allowlist regex blocks `/`, `.`, and traversal chars. `realpath` prefix check is layer 2.           |
| 2  | Path traversal via `--context-file=../../etc/passwd`   | Resolved real path must start with the workspace root. Otherwise reject.                            |
| 3  | Symlink escape via `--context-file=evil-symlink`       | `realpath -P` resolves symlinks before the prefix check; symlink targets outside workspace fail.    |
| 4  | Resource exhaustion via huge `--context-file`          | Hard cap at 64 KiB (`wc -c`). Anything larger is rejected before the file is read.                  |
| 5  | Empty / directory / missing context file               | Each is its own explicit error: `is not a regular file`, `is empty`, `not found`. No silent skip.   |
| 6  | Prompt injection via hostile context content           | Caller-controlled content; mitigated by reviewer awareness + persona/contract framing. Skill emits *direction*, not execution.|
| 7  | Built-in persona/contract name shadowed by user file   | Built-in names reserved; reviewers reject PRs that overwrite them.                                  |
| 8  | Layer body containing shell metacharacters             | Composition uses `awk` extraction + `printf`/`cat` only — no `eval`, no shell expansion of content. |
| 9  | Argument injection via crafted flag values             | Each flag is consumed by `case "$arg" in --x=*) v="${arg#*=}"`; never re-evaled.                    |
| 10 | Glob/URL/multi-file expansion in `--context-file`      | Single-value flag, no glob expansion. URLs fail the workspace-prefix check (no scheme support).     |

### Abuse Cases

- **Persona name escape:** `--persona='../contracts/pr-flow'` → blocked at validation regex (`/` not in allowlist).
- **Context-file traversal:** `--context-file=/etc/passwd` → resolves outside workspace, rejected.
- **Symlink-to-secret:** `ln -s /etc/passwd ./ctx.md; --context-file=ctx.md` → `realpath -P` reveals true target; rejected.
- **Memory blowup:** `dd if=/dev/zero of=big.md bs=1M count=10; --context-file=big.md` → 64 KiB cap rejects before read.
- **URL as context:** `--context-file=https://evil.com/x.md` → not a real file path; existence check fails first; even if cached locally, workspace check applies.
- **Argument splitting:** `--persona='security-architect; cat /etc/passwd'` → entire value is one quoted string; `;` is part of the value, fails regex.
- **Empty task:** `--task=""` or task missing → explicit `ERROR: task empty`.

### Edge Cases

- Layer file with no frontmatter → composition still works; body extraction is a no-op.
- Layer file with CRLF line endings → preserved in output. Snapshot test catches accidental normalization.
- Mixed-case flag value (`--persona=Custom`) → rejected; allowlist is lowercase only.
- Whitespace-only persona value → rejected (regex requires at least one allowed char).
- Context file without trailing newline → composer adds one before the next separator.

### Snapshot Test

`bash skills/orbit-prompt/tests/snapshot.sh` runs nine cases:

| #  | Case                                                                              |
|----|-----------------------------------------------------------------------------------|
| T1 | Happy-path **with** `--context-file` → diff vs `composed.with-context.expected.md`|
| T2 | Happy-path **without** `--context-file` → diff vs `composed.no-context.expected.md` (no `# CONTEXT` section) |
| T3 | `--context-file` points to missing file → `ERROR: context-file not found:`        |
| T4 | `--context-file` points to a directory → `ERROR: context-file is not a regular file:` |
| T5 | `--context-file` points to an empty file → `ERROR: context-file is empty:`        |
| T6 | `--context-file` exceeds 64 KiB → `ERROR: context-file exceeds 64 KiB:`           |
| T7 | `--context-file` points outside the workspace → `ERROR: context-file resolves outside workspace:` |
| T8 | `--context-file` is a symlink whose target is outside the workspace → same error  |
| T9 | Invalid persona (legacy regression) → `ERROR: persona "<name>" not found.`        |

Exit `0` only when all nine pass. Output ends with `OK: 9/9` on success, `FAIL: <p>/<t>` on failure.

When you intentionally change a persona, contract, or fixture, regenerate the golden files:

```bash
bash skills/orbit-prompt/lib/compose.sh \
  --persona=security-architect --contract=threat-model \
  --context-file=skills/orbit-prompt/tests/fixtures/sample-context.md \
  --task-file=skills/orbit-prompt/tests/fixtures/task.txt \
  > skills/orbit-prompt/tests/fixtures/composed.with-context.expected.md

bash skills/orbit-prompt/lib/compose.sh \
  --persona=security-architect --contract=threat-model \
  --task-file=skills/orbit-prompt/tests/fixtures/task.txt \
  > skills/orbit-prompt/tests/fixtures/composed.no-context.expected.md
```

The regeneration is a deliberate, version-controlled act — never a CI side effect.

---

## Commands

### /orbit-prompt [user's original prompt]

**What it does:**
Analyzes the user's prompt for gaps, ambiguities, and risks. Returns an improved version that is clearer, more constrained, and less prone to rework.

**Usage:**
```
/orbit-prompt "Refactor the auth module"
```

**What you get:**
- Analysis of what's missing
- Improved version with all gaps filled
- Explanation of each improvement
- Ready/not-ready assessment

**Why use it:**
Better prompts = less rework, fewer corrections, clearer output.

---

## Activation Rules

The skill has two surfaces. Keep them separate.

### Primary entry — `/orbit-prompt` (manual, explicit)

Activate ONLY when the user sends:

- `/orbit-prompt [their prompt text]`

This is the recommended way to use the skill. Always responds. Nothing else triggers this mode.

### Automatic DIAGNOSIS (silent by default)

Only respond if the task shows signs of complexity, waste, or inefficiency.
Otherwise, remain silent — silence means the session is healthy.

DO NOT activate for:

- Simple factual questions ("What does reduce() do?")
- Trivial code fixes (one-line changes, typo corrections)
- Casual conversation ("thanks", "looks good")
- First message of a session with no history

### Advanced triggers (optional)

The DIAGNOSIS mode also responds to these natural-language phrases when the user wants to force a diagnosis on demand instead of waiting for automatic detection:

- `analyze cost`, `analyze-cost`, `/analyze-cost`
- `how efficient is this?`, `optimize this`, `is this optimal?`

These are optional. The recommended usage remains `/orbit-prompt` for prompt improvement and automatic detection for diagnosis.

---

## The 8 Waste Patterns

1. **Unsolicited long responses** — Output far exceeds request
2. **Correction chains** — Multiple follow-up corrections needed
3. **Repeated edits** — Same file/component edited 3+ times
4. **Exploratory searching** — Reading many files without direction
5. **Weak prompts** — Complex tasks with no constraints
6. **Large inline content** — Code pasted instead of referenced
7. **Validation theater** — Artifacts created but never executed
8. **Context accumulation** — Long sessions with irrelevant carried context

---

## Integration Examples

### Example 1: Detect + Improve

User sends vague prompt → Orbit detects "weak prompt" pattern → suggests `/orbit-prompt command`

User: `/orbit-prompt "Refactor the authentication module"`

Orbit returns improved version:
```
Original: "Refactor the authentication module"

Improved: "Extract the password validation logic from auth.ts 
into validators/password.ts. Keep the existing function signatures. 
Don't touch routes.ts or database schema. Success = all existing tests pass."
```

### Example 2: Standalone improvement

User knows prompt is weak → directly uses `/orbit-prompt` → gets improved version

User: `/orbit-prompt "Build a dashboard for our metrics"`

Orbit returns:
```
ANALYSIS:
- Missing: which metrics? which data sources?
- Missing: where to build? (React component, standalone app?)
- Missing: scope — how many charts, which timeframes?

IMPROVED:
"Build a dashboard React component at src/Dashboard.tsx that displays:
- Last 30 days of user signups (graph)
- Current revenue (number)
- Active sessions (number)
Data comes from /api/metrics. Must load in <1s. Success = component renders without errors
and matches the design in docs/dashboard-mockup.png"
```

---

## When to use /orbit-prompt

✓ **Before sending** a complex request to Claude
✓ **When the task feels vague** but you can't articulate why
✓ **When you've gotten corrections** in past sessions
✓ **Before starting work** on something large
✓ **When explaining requirements** to stakeholders

✗ **Don't use** for simple questions
✗ **Don't use** for trivial fixes
✗ **Don't use** for casual chat
