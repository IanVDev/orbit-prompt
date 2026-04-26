# Quick Start — Orbit Prompt with /orbit-prompt Command

## 2-minute overview

Orbit Prompt does two things:

### 1. **Diagnoses inefficiency** (automatic)
Detects waste patterns in your work and suggests improvements.

### 2. **Improves prompts** (on demand)
Use `/orbit-prompt [your prompt]` to get a better version before sending.

---

## The 8 Waste Patterns (detection)

1. **Unsolicited long responses** — You got way more than you asked for
2. **Correction chains** — You had to correct the output multiple times
3. **Repeated edits** — Same file was edited 3+ times
4. **Exploratory searching** — Many files read without a plan
5. **Weak prompts** — Complex task with no constraints
6. **Large inline content** — Code pasted instead of referenced
7. **Validation theater** — Things built but never tested
8. **Context accumulation** — Very long session with old context

---

## Using /orbit-prompt Command

### Simple example

**Your prompt (vague):**
```
"Fix the login bug"
```

**Use `/orbit-prompt`:**
```
/orbit-prompt "Fix the login bug"
```

**Orbit returns (improved):**
```
ORIGINAL: "Fix the login bug"

ANALYSIS:
- Which bug? No description provided
- Which file? auth.ts, login.tsx, both?
- Acceptance criteria? What does "fixed" mean?

IMPROVED:
"Fix the login bug where users cannot log in with Google OAuth 
(reported in issue #234). The bug is in src/auth/oauth-handler.ts. 
Fix only that file — don't touch routes or database. 
Success = Google login works and existing tests pass."
```

---

## The /orbit-prompt Workflow

1. **You write** a prompt
2. **You call** `/orbit-prompt [your prompt]`
3. **Orbit analyzes** what's missing
4. **Orbit returns** an improved version
5. **You send** the improved version to Claude

---

## When to use /orbit-prompt

✓ Before sending a **large/complex request**
✓ When you feel the task is **vague but can't say why**
✓ When you've had **corrections in the past**
✓ Before **delegating work** to someone
✓ When explaining **requirements to stakeholders**

---

## Example Improvements

### Before
```
"Implement caching"
```

### After
```
"Add Redis caching to the user lookup endpoint (src/api/endpoints/users.ts:getUserById).
Cache keys: user:{id}. TTL: 1 hour. Store only the response body, not headers.
Keep existing error handling. Don't change the endpoint signature.
Success = endpoint response time improves 50% for cached hits, all tests pass."
```

---

## Key Rules

**For DIAGNOSIS:**
- Silence = healthy session (don't worry)
- Only detects **observable patterns** (not guesses)
- No scoring, no percentages, no made-up metrics

**For /orbit-prompt:**
- Always adds missing constraints
- Never removes your intent
- Marks if prompt is **still too vague**
- Makes success **testable and observable**

---

## Next Steps

1. **Learn the 8 patterns** (5 min) — recognize waste in your own work
2. **Use /orbit-prompt once** — experience the difference
3. **Apply in your workflow** — improve prompts before sending to Claude
4. **Track improvements** — fewer corrections needed = working

---

## Quick Reference

| Use | Command |
|-----|---------|
| Get diagnosis | Automatic (or `/analyze-cost`) |
| Improve your prompt | `/orbit-prompt [your text here]` |
| See examples | `EXAMPLES.md` |

Silence is success. Feedback means room to improve.
