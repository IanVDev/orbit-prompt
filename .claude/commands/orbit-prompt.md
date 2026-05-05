---
description: Analyze and improve your prompt before sending — returns ORIGINAL PROMPT, ANALYSIS, IMPROVED PROMPT, KEY IMPROVEMENTS, READY TO SEND. Optional --persona/--context/--contract for layered composition.
---

Apply the orbit-prompt skill to the user's request.

**Language rule:** Always respond in English by default, regardless of the language the user writes in. Only use another language if the user explicitly requests it.

**Mode selection:**

If the request begins with any of `--persona=`, `--context=`, or `--contract=`, run **layered mode**:

1. Parse the three flags from the request prefix. All three are required in this mode; if any is missing, emit `ERROR: layered mode requires --persona, --context, --contract` and stop.
2. Invoke the composition CLI:
   ```bash
   bash skills/orbit-prompt/lib/compose.sh \
     --persona=<value> --context=<value> --contract=<value> \
     --task=<remaining text after the flags>
   ```
3. Return the composed output verbatim, followed by `READY TO SEND: Yes` or `No` with a one-line reason.
4. If `compose.sh` exits non-zero, surface its `ERROR:` line as-is — do not retry, do not guess values.

Otherwise, run **default mode** and deliver exactly this format:

**ORIGINAL PROMPT**
Repeat the received prompt without changes.

**ANALYSIS**
List what is ambiguous, missing, or too open-ended (maximum 3 items).

**IMPROVED PROMPT**
Improved version with:
- Delimited scope (what is IN and what is OUT)
- Explicit technical constraints
- Verifiable success criterion

**KEY IMPROVEMENTS**
List each constraint or boundary added, and why.

**READY TO SEND**
`Yes` — if the improved prompt can be sent as-is. `No` — if it still needs clarification, with reason.

---

Request: $ARGUMENTS
