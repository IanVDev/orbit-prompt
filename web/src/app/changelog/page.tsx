import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Changelog',
  description: `Recent ${SITE.name} releases — repo and skill versions.`,
};

const entries = [
  {
    version: 'Repo v0.3.0 · Skill v1.2.1',
    date: '2026',
    highlights: [
      'Marketplace install path stabilized — fixed plugins[0].source schema regression.',
      'README rewritten plugin-first; technical skill/plugin distinction moved to its own section.',
      'Public communication checks added to CI (canonical description, install command, troubleshooting section).',
      'Eight session inefficiency patterns documented in the skill contract.',
    ],
  },
  {
    version: 'Repo v0.2.x',
    date: '2025',
    highlights: [
      'First marketplace publication.',
      'Slash command bridge for project-local installs.',
      'Quick start, onboarding, and examples bundled inside the skill.',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <section className="container-page pt-20 pb-24">
      <div className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-3 text-center">
          <p className="heading-eyebrow">Changelog</p>
          <h1 className="heading-1">What changed, in plain language.</h1>
          <p className="lead">
            The full machine-readable log lives in{' '}
            <a
              className="text-accent hover:underline"
              href={`${SITE.githubUrl}/blob/main/CHANGELOG.md`}
              target="_blank"
              rel="noreferrer noopener"
            >
              CHANGELOG.md
            </a>
            . The summary below is what most people care about.
          </p>
        </header>

        <ol className="space-y-6">
          {entries.map((entry) => (
            <li key={entry.version} className="surface p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-lg font-semibold text-fg">{entry.version}</h2>
                <span className="text-xs text-fg-subtle">{entry.date}</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-fg-muted">
                {entry.highlights.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="text-center">
          <Link href="/" className="btn-ghost">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
