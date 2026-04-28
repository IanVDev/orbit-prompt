import type { Metadata } from 'next';
import Link from 'next/link';
import { OutputTrace } from '@/components/output-trace';
import { CommandBlock } from '@/components/command-block';
import { OUTPUT_BLOCKS, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'How it works',
  description: `${SITE.name} reads your prompt, surfaces gaps, and suggests a structured version. It never sends anything for you.`,
};

const traceOne = [
  { label: 'ORIGINAL PROMPT' as const, body: '"Make the dashboard faster"' },
  {
    label: 'ANALYSIS' as const,
    body: `- No metric (LCP? TTI? perceived load?)
- No scope (which dashboard, which view, which user tier?)
- No baseline (how slow is "slow"?)`,
  },
  {
    label: 'IMPROVED PROMPT' as const,
    body: `"In src/views/admin/Dashboard.tsx, reduce time-to-interactive
on the /admin route for the Pro plan. Current TTI is 4.2s on
mid-range hardware. Goal: under 2.0s. Do not change the data
model or shared components. Done = TTI under 2.0s with the
existing Lighthouse CI run, no regressions in /admin/users."`,
  },
  {
    label: 'KEY IMPROVEMENTS' as const,
    body: `- Names the file and route
- Pins a measurable goal (TTI < 2.0s)
- Forbids touching shared surfaces
- Anchors "done" to existing CI`,
  },
  { label: 'READY TO SEND' as const, body: 'Yes' },
];

export default function PromptPage() {
  return (
    <>
      <section className="container-page pt-16 pb-12">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="heading-eyebrow">How it works</p>
          <h1 className="heading-1">A structured second look at your prompt.</h1>
          <p className="lead">
            You type what you want. The plugin reads it, names the gaps, and gives you a tighter
            version next to the original. You decide whether to use it, edit it, or ignore it.
          </p>
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="heading-2">The output, every time</h2>
          <p className="lead">
            Every <code className="kbd">{SITE.command}</code> response uses the same five blocks.
            The shape is fixed so your eye knows where to land.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {OUTPUT_BLOCKS.map((label, i) => (
              <li key={label} className="surface px-4 py-3 text-sm">
                <span className="text-xs font-mono text-fg-subtle">0{i + 1}</span>
                <span className="ml-3 font-mono text-accent">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="mx-auto max-w-3xl space-y-4">
          <h2 className="heading-2">Try it</h2>
          <p className="lead">
            Pass your idea after the command. Plain language is fine — that&rsquo;s the point.
          </p>
          <CommandBlock
            command={`${SITE.command} make the dashboard faster`}
            caption="claude code chat"
          />
          <OutputTrace title="What you get back" trace={traceOne} />
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="mx-auto max-w-3xl space-y-4">
          <h2 className="heading-2">It never sends anything</h2>
          <p className="lead">
            The improved prompt is just text. Read it, copy what you want, throw the rest away. The
            plugin doesn&rsquo;t auto-execute, doesn&rsquo;t call your model, doesn&rsquo;t write
            files. Nothing leaves your local session.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/examples" className="btn-primary">
              See real examples
            </Link>
            <Link href="/install" className="btn-ghost">
              Install in Claude Code
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
