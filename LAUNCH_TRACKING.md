# Launch tracking

Manual ledger of public-facing posts about orbit-prompt and the follow-up
actions they triggered.

No telemetry, no analytics, no PII. Every entry is added by hand and lives
under version control so the history is auditable and reversible.

## Scope

This file records:

- where orbit-prompt was talked about publicly,
- what feedback came back,
- what was done about it,
- what verifiable change (test, code, doc) the action produced.

This file does **not** record:

- user emails, handles, screen names, or any PII,
- private DMs or quoted private messages,
- counters, click metrics, or any kind of signal collected automatically.

## Format

Each row captures one public post or one batch of related feedback.

| Date (YYYY-MM-DD) | Channel | Link | Feedback received | Action taken | Test added / updated |
|-------------------|---------|------|-------------------|--------------|----------------------|

`Test added / updated` should reference a script under `scripts/`, a file
path, or a commit hash — anything verifiable in the repo. If an action did
not produce a verifiable artifact, write `none` and note why.

## Entries

| Date (YYYY-MM-DD) | Channel | Link | Feedback received | Action taken | Test added / updated |
|-------------------|---------|------|-------------------|--------------|----------------------|
| 2026-04-26 | internal launch prep | branch `claude/orbit-prompt-public-launch-JT5ss` | Public copy mixed "skill" and "plugin" framing in headlines and lacked an explicit feedback path | Reframed README plugin-first, added canonical short description, added feedback issue template, added this ledger | `scripts/check_public_communication.sh` |

## Guidelines

- Quote feedback in your own words; do not paste private messages.
- Every "Action taken" of substance must produce a verifiable artifact and
  be listed in the rightmost column. If you cannot point at one, the
  action is not done.
- Add one row per public post or per batch of related feedback.
- Append rows in date order; do not edit historical rows. If something is
  wrong, add a follow-up row that supersedes it.
