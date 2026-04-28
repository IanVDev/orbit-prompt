# Threat model — Orbit Prompt website

This document captures the assets, abuse cases, fail-closed rules, and
operational signals that protect the public website. It is intentionally
short — anything that does not protect a real user moves out.

## Assets

1. User trust in the install command set.
2. Integrity of the marketplace slug (`IanVDev/orbit-prompt`).
3. README ↔ site copy parity (canonical description, install commands).
4. Inbound traffic from social posts and search.
5. Build artifacts produced by Next.js.

## Realistic abuse

1. A drift introduces a typo in the install command, sending users to a
   non-existent marketplace entry.
2. A future contributor swaps "plugin" for "skill" in the install copy,
   reviving the autocomplete confusion users hit before v0.3.0.
3. A pasted YouTube embed loads tracking cookies without consent.
4. A markdown / TSX edit accidentally checks in a secret (`.env`, API key).
5. A removed page leaves a dead link in the header or footer.
6. An external dependency injects analytics or scripts via supply-chain.

## Fail-closed rules (CI must enforce)

1. The three install commands in `src/lib/site.ts` must match the README
   verbatim. Asserted in `tests/install.test.ts` and
   `scripts/check_public_content.mjs`.
2. The `/install` page must contain "Claude Code plugin" and must not use
   forbidden install phrasings such as "install the orbit-prompt skill".
3. Every internal `href` referenced in `src/` must map to an existing
   `page.tsx`. Asserted in `scripts/check_links.mjs`.
4. No file under `web/` may contain secret patterns (AWS keys, OpenAI
   tokens, GitHub tokens, private keys). Asserted in
   `scripts/check_public_content.mjs`.
5. The home page must link to `/install` and `/videos`.
6. Build (`pnpm build`) must succeed with the typed config — runtime
   failures block deploys.

## Operational signals

1. Footer surfaces the deployed commit (planned: `NEXT_PUBLIC_COMMIT_SHA`).
2. CI jobs visible on every PR: typecheck, lint, content, tests, links,
   build.
3. Releases are announced on the GitHub repo first; the changelog page
   pulls highlights from there.

## Privacy posture

1. No analytics by default. If added later, it must be cookieless and
   PII-free.
2. Video embeds use `youtube-nocookie.com`. Direct `youtube.com/embed`
   URLs are rejected by `check_links.mjs`.
3. CSP set in `next.config.mjs` denies framing, third-party scripts, and
   cross-origin form posts.

## Out of scope (today)

1. Authenticated areas — the site is fully public.
2. User content / forms — there is none.
3. Pricing or billing — the plugin is free.
