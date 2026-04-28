import Link from 'next/link';
import { CommandBlock } from '@/components/command-block';
import { FeatureCard } from '@/components/feature-card';
import { OutputTrace } from '@/components/output-trace';
import { INSTALL_COMMANDS, SITE } from '@/lib/site';

const heroSampleTrace = [
  {
    label: 'ORIGINAL PROMPT' as const,
    body: '"Refactor auth module"',
  },
  {
    label: 'ANALYSIS' as const,
    body: `- No file target (which file?)
- No scope boundary (password? OAuth? both?)
- No acceptance criteria (what does done look like?)`,
  },
  {
    label: 'IMPROVED PROMPT' as const,
    body: `"Extract password validation from src/auth/auth.ts into
src/validators/password.ts. Keep existing function signatures.
Do not touch OAuth flow or routes.
Done = all existing tests pass."`,
  },
  {
    label: 'KEY IMPROVEMENTS' as const,
    body: `- Targets a specific file
- Scoped to password only
- Preserves the function contract
- Adds a verifiable success criterion`,
  },
  {
    label: 'READY TO SEND' as const,
    body: 'Yes',
  },
];

export default function HomePage() {
  return (
    <>
      <section className="container-page pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <p className="heading-eyebrow">Claude Code plugin · v1.x</p>
          <h1 className="heading-1">{SITE.tagline}</h1>
          <p className="lead">
            {SITE.longDescription}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/install" className="btn-primary">
              Install Orbit Prompt
            </Link>
            <Link href="/videos" className="btn-ghost">
              Watch a 2-minute demo
            </Link>
          </div>
          <p className="text-xs text-fg-subtle">
            Free · open source · runs locally inside Claude Code
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <OutputTrace title="What you see after running /orbit-prompt" trace={heroSampleTrace} />
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <p className="heading-eyebrow">What it does</p>
          <h2 className="heading-2">Stops weak prompts before they cost you turns.</h2>
          <p className="lead">
            Most correction loops in Claude Code start with a vague prompt — not with the model.
            Orbit Prompt reads what you typed, names the gaps, and gives you a scoped version you
            can review before sending.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <FeatureCard
            title="Surfaces gaps"
            description="Identifies missing scope, file targets, boundaries, and acceptance criteria — the things that produce rework when omitted."
          />
          <FeatureCard
            title="Suggests, never sends"
            description="Outputs a structured prompt next to the original. You copy what you want, ignore what you don't. Nothing leaves your session."
          />
          <FeatureCard
            title="Quiet by default"
            description="Session diagnostics stay silent unless one of 8 inefficiency patterns is detected. No nagging, no theater."
          />
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <p className="heading-eyebrow">Install in three commands</p>
          <h2 className="heading-2">Inside Claude Code, not your terminal.</h2>
          <p className="lead">
            <Link href="/install" className="text-accent hover:underline">
              See the full install guide
            </Link>{' '}
            with screenshots and troubleshooting.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl space-y-3">
          <CommandBlock command={INSTALL_COMMANDS.marketplace} caption="Step 1 — add marketplace" />
          <CommandBlock command={INSTALL_COMMANDS.install} caption="Step 2 — install plugin" />
          <CommandBlock command={INSTALL_COMMANDS.reload} caption="Step 3 — reload" />
        </div>
        <div className="mt-8 flex justify-center">
          <Link href="/install" className="btn-ghost">
            Read full install guide
          </Link>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <p className="heading-eyebrow">Real examples</p>
          <h2 className="heading-2">Five before/after walkthroughs.</h2>
          <p className="lead">
            Refactors, debugging, PR review, README cleanup, feature planning — the same tasks you
            already use Claude Code for.
          </p>
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/examples" className="btn-primary">
            Browse examples
          </Link>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl rounded-xl border border-border bg-bg-raised p-8 text-center">
          <p className="heading-eyebrow">Coming next</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-fg">
            A CLI for building Claude Code plugins.
          </h2>
          <p className="mt-3 text-sm text-fg-muted">
            We are working on a developer toolchain that builds, tests, and ships plugins like Orbit
            Prompt. No promises, no waitlist hype — just one page when it&rsquo;s ready.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/engine" className="btn-ghost">
              Read the short note
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
