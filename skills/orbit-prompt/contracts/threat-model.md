---
name: threat-model
version: 1.0.0
description: Output contract — produce a STRIDE-shaped threat model with abuse cases, mitigations, and residual risk.
---

Output must contain, in order, exactly these sections:

1. **Trust Boundaries** — list each boundary the change crosses (data, process, network, user-vs-system).
2. **STRIDE Table** — one row per category (S/T/R/I/D/E). Each row: threat, likelihood (low/med/high), impact (low/med/high), mitigation, residual risk.
3. **Abuse Cases** — at least three concrete misuse scenarios that the happy path does not cover.
4. **Edge Cases** — at least three boundary inputs (empty, oversized, malformed, adversarial).
5. **Fail-Closed Checks** — what the system does when validation fails. No silent fallbacks.
6. **Residual Risk** — what remains unmitigated and why it is acceptable.

If any section cannot be filled, write `UNKNOWN — <reason>` rather than omitting it. An incomplete threat model is a finding, not an excuse.
