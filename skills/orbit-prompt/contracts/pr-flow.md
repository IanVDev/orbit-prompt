---
name: pr-flow
version: 1.0.0
description: Output contract — produce a PR plan that satisfies branch hygiene, CI gating, and the 2-PR ceiling.
---

Output must contain, in order, exactly these sections:

1. **Title** — `<type>(<scope>): <imperative summary>` under 70 chars (`type` in {feat, fix, docs, refactor, chore, test}).
2. **Summary** — 1–3 bullets, "what changed and why" (not "what files").
3. **Scope Check** — confirm the change is one concern; if multiple, propose how to split.
4. **Branch Hygiene** — base branch, target branch, current open-PR count vs ceiling (max 2 open).
5. **CI Gate** — list checks that must be green before merge.
6. **Test Plan** — bulleted checklist a reviewer can run.
7. **Rollback Plan** — one sentence: how to revert if the deploy goes wrong.

If any section cannot be filled, write `BLOCKED — <reason>` and stop. Do not open PRs with unknown CI status or unknown rollback.
