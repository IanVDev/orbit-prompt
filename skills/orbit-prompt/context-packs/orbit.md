---
name: orbit
version: 1.0.0
description: orbit-prompt project context — Claude Code skill, English-by-default, deterministic, fail-closed.
---

Project: orbit-prompt — a Claude Code skill that analyzes prompts and surfaces inefficiencies. Distributed as a plugin under `.claude-plugin/` and as a skill under `skills/orbit-prompt/`.

Non-negotiables: English-by-default language contract; deterministic composition; no network calls inside the skill; fail-closed validation; the skill provides direction, not execution. Governance scripts under `scripts/` enforce layout, language, and public communication contracts.

Do not transform orbit-prompt into an execution engine. If a proposed change introduces runtime side effects beyond text composition, it belongs in a separate skill.
