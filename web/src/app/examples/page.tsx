import type { Metadata } from 'next';
import Link from 'next/link';
import { BeforeAfter } from '@/components/before-after';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Examples',
  description: `Real before/after prompts that show how ${SITE.name} reshapes vague tasks into scoped, verifiable instructions.`,
};

const examples = [
  {
    title: 'Turn an idea into a task',
    description:
      'A throwaway sentence becomes a scoped change request that Claude Code can execute without follow-ups.',
    before: 'Clean up the README, it has too many commands and is confusing.',
    after: `Rewrite README.md so a developer who never used the project can install
and run it in under 5 minutes. Keep the existing tone. Remove duplicate
install paths. Move advanced configuration to docs/advanced.md.
Done = Markdown lints clean and the install section has at most 3 commands.`,
    notes: [
      'Anchors "done" to a checkable signal (markdown lint).',
      'Limits scope to a single file plus an optional move target.',
      'Preserves prior context (tone, file conventions).',
    ],
  },
  {
    title: 'Debugging without thrash',
    description:
      'Stops the "edit auth.ts five times" loop by asking for a hypothesis before any code changes.',
    before: 'The slash command appears twice in autocomplete, fix it.',
    after: `In Claude Code, /orbit-prompt is showing up twice in autocomplete.
Investigate the cause without modifying any files yet. Confirm whether
the duplicate comes from (a) a project-local skill in skills/, (b) a
duplicate command wrapper in commands/, or (c) two installed plugins.
Output: a 3-line root cause and the smallest reversible fix.`,
    notes: [
      'Forces a read-only investigation pass first.',
      'Lists the most likely causes — narrows the search space.',
      'Asks for the smallest reversible fix, not a refactor.',
    ],
  },
  {
    title: 'Pull-request review',
    description:
      'Replaces "looks good?" with a checklist Claude Code can actually run against the diff.',
    before: 'Check if this PR is safe to merge.',
    after: `Review PR #42 against main. For every changed file, report:
1. behavioral change in 1 sentence
2. obvious regressions (renamed exports, removed branches)
3. security concerns (new external calls, new env reads, auth changes)
4. test coverage delta (added/removed/skipped tests)
Do not approve or request changes — output the report only.`,
    notes: [
      'Defines the exact shape of the report.',
      'Forbids decisions (approve / reject) — the human still decides.',
      'Catches the categories that cause real production incidents.',
    ],
  },
  {
    title: 'Refactor with a contract',
    description:
      'A blank-check refactor becomes a surgical move that preserves the public surface.',
    before: 'Refactor the auth module so it\'s cleaner.',
    after: `Extract password validation from src/auth/auth.ts into
src/validators/password.ts. Keep the existing exported function names
and signatures. Do not modify routes or the OAuth flow.
Done = all existing tests pass, no public exports added or removed,
no new dependencies.`,
    notes: [
      'Preserves the public contract (signatures, exports).',
      'Names the files involved.',
      'Forbids dependency churn — the silent killer of refactors.',
    ],
  },
  {
    title: 'Feature planning',
    description:
      'Turns "build dark mode" into a planning artifact you can review before any code is written.',
    before: 'Add dark mode to the app.',
    after: `Plan dark mode for the web app. Output a numbered list of:
1. files that must be touched (with reason)
2. shared tokens / variables to extract
3. components that already block theming and why
4. test surface (visual, snapshot, a11y)
Do not write code in this turn. Stop after the plan.`,
    notes: [
      'Demands a plan first, not code.',
      'Surfaces hidden coupling (components that block theming).',
      'Reserves the next turn for the implementation.',
    ],
  },
];

export default function ExamplesPage() {
  return (
    <>
      <section className="container-page pt-16 pb-12">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="heading-eyebrow">Examples</p>
          <h1 className="heading-1">Five rough ideas, five structured prompts.</h1>
          <p className="lead">
            Each one is a prompt that would normally start a correction loop, rewritten as a single
            request Claude Code can execute end-to-end.
          </p>
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="mx-auto grid max-w-5xl gap-6">
          {examples.map((ex) => (
            <BeforeAfter
              key={ex.title}
              title={ex.title}
              description={ex.description}
              before={ex.before}
              after={ex.after}
              notes={ex.notes}
            />
          ))}
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="mx-auto max-w-3xl rounded-xl border border-border bg-bg-raised p-8 text-center">
          <h2 className="text-xl font-semibold text-fg">Want one for your repo?</h2>
          <p className="mt-2 text-sm text-fg-muted">
            Run <code className="kbd">{SITE.command} your idea here</code> inside Claude Code. The
            plugin works on whatever you type — the output blocks are always the same.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/install" className="btn-primary">
              Install
            </Link>
            <Link href="/prompt" className="btn-ghost">
              See the output format
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
