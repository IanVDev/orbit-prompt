# Orbit Prompt — Examples with /orbit-prompt Command

Real scenarios showing both diagnosis and prompt improvement.

---

## Scenario 1: Using /orbit-prompt Before a Task

**User has a vague idea, improves it first**

User thinks: "I should improve my prompt before sending"

```
/orbit-prompt "Refactor the authentication system"
```

**Orbit output:**

```
[Orbit Prompt — Prompt Refinement]

ORIGINAL PROMPT:
"Refactor the authentication system"

ANALYSIS:
- Missing: which files? (auth.ts, login.tsx, both?)
- Missing: scope — are we changing password flow, OAuth, both?
- Missing: what stays the same? (function signatures, API contracts?)
- Risk: high speculation — "refactor" without constraints means full rewrite

IMPROVED PROMPT:
"Refactor only the password validation logic in src/auth/password-validator.ts.
Extract validation rules into a separate validators.ts file. Keep the existing
function signatures (validatePassword, validateStrength).
Don't touch the OAuth flow. Success = all existing tests pass, validation
logic is 100% covered by tests."

KEY IMPROVEMENTS:
- Specific file targets (password-validator.ts → validators.ts)
- Clear scope boundary (password only, not OAuth)
- Preserved contracts (function signatures stay the same)
- Acceptance criteria (tests pass, code coverage)

READY TO SEND: YES
Reason: Constraints are clear, rework risk is low, success is testable.
```

---

## Scenario 2: Diagnosis + /orbit-prompt Workflow

**User's prompt triggers waste detection, then improves it**

User sends to Claude:
```
"Build a dashboard"
```

Orbit detects "weak prompt" pattern and diagnoses:

```
[Orbit Prompt]

DIAGNOSIS:
- Large task with no file targets, data sources, or scope limits
- High speculation risk — "dashboard" could mean 50 different things

ACTIONS:
1. Use /orbit-prompt to refine — add file location, metrics, data sources
2. Define acceptance criteria — what does "done" mean?

DO NOT DO NOW:
- Start building without constraints — will require multiple rewrites
```

User then runs:

```
/orbit-prompt "Build a dashboard"
```

Orbit improves:

```
[Orbit Prompt — Prompt Refinement]

ORIGINAL PROMPT:
"Build a dashboard"

ANALYSIS:
- Missing: which metrics? (users, revenue, performance?)
- Missing: where? (React component, standalone page, embed?)
- Missing: data sources? (API endpoints, database queries?)
- Missing: success criteria? (load time, number of charts?)
- Risk: CRITICAL — every assumption will be wrong

IMPROVED PROMPT:
"Build a dashboard React component at src/components/Dashboard.tsx that displays:
1. User signups (last 30 days, line graph) from GET /api/metrics/signups
2. Current revenue (number) from GET /api/metrics/revenue
3. Active sessions (number) from GET /api/metrics/active-sessions
Data must load in <1 second. Component must render without errors.
Success = component matches design in docs/dashboard-mockup.png AND loads in <1s."

KEY IMPROVEMENTS:
- Specific location (src/components/Dashboard.tsx)
- Concrete metrics (3 specific charts)
- Data sources defined (API endpoints)
- Performance requirement (<1s)
- Observable success (matches mockup AND performance target)

READY TO SEND: YES
Reason: File location, data sources, and success criteria are all defined.
No room for interpretation.
```

User sends the **improved prompt** to Claude instead of the original.

Result: Claude builds exactly what was requested, no corrections needed.

---

## Scenario 3: Detecting and Fixing Ambiguity

**User's prompt is clear to them but vague to Claude**

User tries: `"Make the API faster"`

Without `/orbit-prompt`, Claude might:
- Add caching (maybe not what you want)
- Optimize database queries (maybe not needed)
- Add load balancing (too expensive)
- Get corrected 3 times

With `/orbit-prompt`:

```
/orbit-prompt "Make the API faster"
```

Orbit improves:

```
[Orbit Prompt — Prompt Refinement]

ORIGINAL PROMPT:
"Make the API faster"

ANALYSIS:
- Missing: which endpoint? (all? specific one?)
- Missing: target performance? (100ms? 1s?)
- Missing: what's slow now? (database? network? serialization?)
- Ambiguity: "faster" compared to what baseline?

IMPROVED PROMPT:
"Optimize GET /api/users/{id} endpoint to respond in <100ms (currently ~500ms).
The slowness is in database queries (confirmed by profiling).
Use query caching only — don't add external caches or change the response format.
Test with existing integration tests. Success = endpoint consistently <100ms on prod."

KEY IMPROVEMENTS:
- Specific endpoint (/api/users/{id})
- Measurable target (100ms from 500ms)
- Root cause identified (database queries)
- Solution boundary (caching only, no external services)
- Test suite is baseline (existing integration tests)

READY TO SEND: YES
Reason: Target performance, scope, and success metric are crystal clear.
```

---

## Scenario 4: Scope Management with /orbit-prompt

**Complex task, easy to overshoot**

User's original vague prompt:
```
"Update the payment flow"
```

Running `/orbit-prompt`:

```
/orbit-prompt "Update the payment flow"
```

Orbit returns:

```
[Orbit Prompt — Prompt Refinement]

ORIGINAL PROMPT:
"Update the payment flow"

ANALYSIS:
- "Payment flow" = 20+ files across multiple modules
- Missing: which part? (validation? processing? refunds? webhooks?)
- Missing: what stays the same?
- Missing: backward compatibility? (do old transactions still work?)
- Risk: CRITICAL — without scope, you'll update everything and break something

IMPROVED PROMPT:
"Update ONLY the payment validation step in src/payments/validate.ts.
Add a new rule: reject payments under $0.50 (Stripe minimum + fees).
Keep the existing function signature: validate(amount, currency) → {valid, reason}.
All existing tests must pass. Existing payments must still validate correctly.
Don't touch webhooks, refund logic, or database schema."

KEY IMPROVEMENTS:
- Specific file (validate.ts only)
- Specific change (add minimum amount rule)
- Preserved contract (function signature unchanged)
- Backward compatibility (existing tests = baseline)
- Clear boundaries (don't touch these 3 things)

READY TO SEND: YES
Reason: Scope is narrow, contract is preserved, success is testable.
```

---

## Scenario 5: Healthy Session (No Diagnosis)

**Good prompt from the start**

User sends:
```
"Fix the type error on line 42 of utils.ts where 'name' is expected to be 
a string but null is assigned. Change only that line, don't refactor the file."
```

Orbit output: **Silence**

Why? The prompt is already:
- Specific (line 42)
- Scoped (one line)
- Clear (what the error is)
- Bounded (don't refactor)
- Observable (you'll see the type error is gone)

No waste detected. Session is healthy.

---

## Scenario 6: When /orbit-prompt says "NOT READY"

**User has a legitimate prompt but it's missing something critical**

```
/orbit-prompt "Implement webhook handler for Stripe payments"
```

Orbit response:

```
[Orbit Prompt — Prompt Refinement]

ORIGINAL PROMPT:
"Implement webhook handler for Stripe payments"

ANALYSIS:
- Missing: which events? (charge.succeeded, charge.failed, both?)
- Missing: how to verify? (Stripe signature, API call confirmation?)
- Missing: error handling? (retry logic, dead letter queue?)
- Missing: persistence? (log to database? send alerts?)

IMPROVED PROMPT:
"Implement a webhook endpoint at POST /webhooks/stripe that handles
two events:
1. charge.succeeded → update order status to 'paid' in database
2. charge.failed → send alert to slack #payments channel
Verify Stripe signature using stripe.webhooks.constructEvent().
If verification fails, return 403. If processing fails, log to database
and return 202 (will retry). Success = Stripe test webhook triggers handler,
database updates, and Slack notification arrives."

KEY IMPROVEMENTS:
- Specific events (charge.succeeded, charge.failed)
- Security (Stripe signature verification)
- Error handling (403 on verification fail, 202 for retry)
- Persistence (log to database)
- Observable success (test webhook → database update → Slack alert)

READY TO SEND: YES
Reason: All critical aspects covered. Safe to implement.
```

---

## The Pattern

**Weak prompts → Corrections → Rework**

**Strong prompts (via /orbit-prompt) → No corrections → One pass**

Use `/orbit-prompt` to move from left to right.
