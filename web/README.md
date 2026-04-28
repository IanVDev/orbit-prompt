# Orbit Prompt — website

Public marketing and documentation site for the
[Orbit Prompt](https://github.com/IanVDev/orbit-prompt) Claude Code plugin.

## Stack

- Next.js 15 (App Router) + React 19
- TypeScript (strict)
- Tailwind CSS
- Vitest for anti-regression tests
- Plain Node scripts for content / link checks (no extra deps)

## Pages

| Path         | Purpose                                                  |
| ------------ | -------------------------------------------------------- |
| `/`          | Hero, output sample, install commands, examples teaser   |
| `/prompt`    | How `/orbit-prompt` works and the five output blocks     |
| `/install`   | The supported install path with troubleshooting          |
| `/examples`  | Five before/after walkthroughs                           |
| `/videos`    | Short walkthroughs (with text fallbacks)                 |
| `/faq`       | Plain answers, no marketing                              |
| `/changelog` | Recent releases (full log on GitHub)                     |
| `/engine`    | Short note on what we are building next (noindex)        |

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Verify before shipping

```bash
pnpm verify       # typecheck → lint → tests → content → links → build
```

The same pipeline runs on every PR (`.github/workflows/web.yml`).

## Single source of truth

All public copy that the README or plugin manifest also asserts lives in
[`src/lib/site.ts`](./src/lib/site.ts). Tests in `tests/` assert that the
install commands, GitHub slug, and canonical description match
`README.md` and `.claude-plugin/{plugin,marketplace}.json`. If you change
one, change them all — CI fails fast otherwise.

## Threat model

See [`SECURITY.md`](./SECURITY.md).
