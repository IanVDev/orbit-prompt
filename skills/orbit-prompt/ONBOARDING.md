# Orbit Engine Prompt — Onboarding

Welcome to Orbit Engine — your AI efficiency advisor with a built-in prompt improver.

## What it does

Orbit Engine serves two purposes:

### 1. **Diagnoses waste** (automatic, silent when healthy)

Detects 8 patterns of inefficiency in your work:
- Overly long responses
- Correction chains
- Repeated edits
- Exploratory work without direction
- Weak prompts (vague, no constraints)
- Large inline content
- Work built but never tested
- Accumulated context in long sessions

### 2. **Improves prompts** (on demand with `/orbit-prompt`)

Takes a vague prompt → returns a clear, constrained, actionable version.

## How to use

### Automatic diagnosis

You don't do anything. The system watches for waste patterns.

When it detects a pattern, it outputs a diagnosis with specific actions.

When the session is healthy, it stays silent.

### Manual prompt improvement

When you have a vague prompt, you improve it BEFORE sending:

```
/orbit-prompt "Your vague prompt here"
```

Orbit analyzes what's missing and returns an improved version.

**Example:**

You write:
```
"Refactor the auth module"
```

You run:
```
/orbit-prompt "Refactor the auth module"
```

Orbit returns:
```
IMPROVED PROMPT:
"Extract password validation from auth.ts into validators/password.ts.
Keep existing function signatures. Don't touch OAuth or routes.
Success = all tests pass."
```

You send the **improved version** to Claude instead.

Result: Claude builds exactly what you asked. No corrections needed.

---

## The benefit

### Before using /orbit-prompt:

1. Send vague prompt
2. Get output
3. "No, I meant just this part"
4. Get another output
5. "Actually, don't touch the routes"
6. Get a third output
7. Finally got what you wanted (3 corrections)

### After using /orbit-prompt:

1. Use `/orbit-prompt` to improve
2. Send improved prompt
3. Get exactly what you asked
4. Done

---

## Integration into your workflow

### Best practices

1. **Before complex tasks** — use `/orbit-prompt` to clarify
2. **When you feel vague** — use `/orbit-prompt` to articulate
3. **When sharing work** — use `/orbit-prompt` for requirements
4. **In team settings** — improves communication

### Don't use /orbit-prompt for

- Simple questions
- Trivial fixes (one-liners)
- Casual chat

---

## The 8 waste patterns (reference)

**Automatic detection:**

1. **Unsolicited long responses** — You got more than you asked
2. **Correction chains** — Multiple corrections needed
3. **Repeated edits** — Same file edited 3+ times
4. **Exploratory searching** — Many files read without plan
5. **Weak prompts** — Complex task, no constraints
6. **Large inline content** — Code pasted not referenced
7. **Validation theater** — Built but never executed
8. **Context accumulation** — Long session, old context carried

When detected, Orbit provides a diagnosis with actions.

---

## Example workflow

### Task 1: Small, clear task (no /orbit-prompt needed)

You know exactly what you want:
```
"Fix the TypeError on line 42 of utils.ts — name expects string, null assigned"
```

Send to Claude directly. Orbit stays silent. Done in one pass.

### Task 2: Complex, vague task (/orbit-prompt helps)

You have an idea but it's vague:
```
"Build a dashboard"
```

You run:
```
/orbit-prompt "Build a dashboard"
```

Orbit improves it:
```
IMPROVED:
"Build React component at src/Dashboard.tsx with:
- User signups (last 30 days, line graph)
- Revenue (number card)
- Sessions (number card)
Data from GET /api/metrics/*. Load in <1s. Success = matches mockup + <1s load."
```

You send the improved version. Claude builds it perfectly. No corrections.

---

## Tips

✓ **Use /orbit-prompt** when you feel uncertain about scope
✓ **Use /orbit-prompt** before delegating work
✓ **Use /orbit-prompt** for anything larger than one file
✓ **Use /orbit-prompt** when past corrections suggest gaps

✗ **Skip /orbit-prompt** for simple fixes
✗ **Skip /orbit-prompt** for quick questions
✗ **Skip /orbit-prompt** for casual conversation

---

## Key insight

**Better prompt = fewer corrections = faster completion**

A 2-minute investment in `/orbit-prompt` saves 30 minutes of rework.

---

## Next steps

1. Read `QUICK-START.md` (3 minutes)
2. Look at `EXAMPLES.md` (understand the patterns)
3. Try `/orbit-prompt` on your next task
4. Notice how few corrections you need

Silence is success. Better prompts reduce noise.
