import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'FAQ',
  description: `Frequently asked questions about ${SITE.name} — what it does, what it costs, and what it does not do.`,
};

const faqs = [
  {
    q: 'What is Orbit Prompt, in one sentence?',
    a: `${SITE.canonicalDescription} You type a rough idea, the plugin returns a scoped, verifiable version next to the original. You decide whether to use it.`,
  },
  {
    q: 'Does it send anything off my machine?',
    a: 'No. The plugin reads the current Claude Code session, formats analysis text, and displays it. It does not call external APIs, write files, or execute code. Nothing leaves your local session.',
  },
  {
    q: 'Is this a Claude Code plugin or something else?',
    a: `It's a Claude Code plugin. You install it through Claude Code's plugin marketplace; the slash command ${SITE.command} becomes available immediately after a reload.`,
  },
  {
    q: 'How much does it cost?',
    a: 'Free. Open source. No telemetry, no account, no subscription. The repo is public on GitHub.',
  },
  {
    q: 'Will it auto-correct my prompts?',
    a: `No. Orbit Prompt suggests — it never sends. The improved prompt sits next to the original; you copy what you want or ignore it. The plugin doesn't queue, doesn't auto-apply, doesn't touch your files.`,
  },
  {
    q: 'What if my prompt is already good?',
    a: 'The plugin says so. The READY TO SEND block returns "Yes" and the analysis is short. No fake suggestions, no padding.',
  },
  {
    q: 'Does it work with prompts in other languages?',
    a: 'Yes. The output blocks are language-agnostic; the plugin mirrors the language you wrote the original prompt in.',
  },
  {
    q: 'Can I use it outside Claude Code?',
    a: 'The supported surface is Claude Code. The skill definition is also available as a system prompt for other LLMs — see the manual fallback in the install guide.',
  },
  {
    q: 'How do I report a bug?',
    a: `Open an issue on GitHub with the command you ran and the output you saw. Redact secrets and proprietary content first.`,
  },
];

export default function FaqPage() {
  return (
    <>
      <section className="container-page pt-16 pb-10">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="heading-eyebrow">FAQ</p>
          <h1 className="heading-1">Plain answers, no marketing.</h1>
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="surface group p-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left text-base font-medium text-fg">
                <span>{item.q}</span>
                <span
                  aria-hidden
                  className="text-fg-subtle transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-fg-muted">{item.a}</p>
            </details>
          ))}

          <div className="mt-10 rounded-xl border border-border bg-bg-raised p-6 text-center text-sm text-fg-muted">
            Still stuck?{' '}
            <a
              className="text-accent hover:underline"
              href={SITE.issuesUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              Open an issue on GitHub
            </a>{' '}
            or read the{' '}
            <Link href="/install" className="text-accent hover:underline">
              install guide
            </Link>
            .
          </div>
        </div>
      </section>
    </>
  );
}
