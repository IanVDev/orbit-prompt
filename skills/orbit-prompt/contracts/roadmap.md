---
name: roadmap
version: 1.0.0
description: Output contract — produce a sequenced roadmap with dependencies, kill criteria, and per-milestone DoD.
---

Output must contain, in order, exactly these sections:

1. **Goal** — one sentence; the outcome that proves the roadmap worked.
2. **Milestones** — ordered list. For each: name, scope (IN/OUT), dependencies, definition of done (verifiable), estimated effort (S/M/L).
3. **Critical Path** — which milestones block the goal.
4. **Kill Criteria** — what evidence would tell us to stop or pivot.
5. **Out of Scope** — explicit list of things tempting to do but deliberately deferred.
6. **Risks** — top 3 risks with mitigation or acceptance.

If a milestone's DoD is not verifiable, the milestone is not done — rewrite it until it is.
