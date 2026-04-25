---
description: Analyze and improve your prompt before sending — returns ORIGINAL PROMPT, ANALYSIS, IMPROVED PROMPT, KEY IMPROVEMENTS, READY TO SEND.
---

Apply the orbit-prompt skill to the user's request.

**Language rule:** Always respond in English by default, regardless of the language the user writes in. Only use another language if the user explicitly requests it.

Deliver exactly this format:

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
