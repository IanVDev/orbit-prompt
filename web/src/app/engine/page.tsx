import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Coming next',
  description: 'A short note on what we are building after Orbit Prompt.',
  robots: { index: false, follow: true },
};

export default function EnginePage() {
  return (
    <section className="container-page pt-20 pb-32">
      <div className="mx-auto max-w-2xl space-y-6">
        <p className="heading-eyebrow">Coming next</p>
        <h1 className="heading-1">A developer toolchain for Claude Code plugins.</h1>
        <p className="lead">
          {SITE.name} is the first thing we shipped. The next thing is a CLI that builds, tests,
          and ships plugins like it. It is not public yet — there is no waitlist, no sign-up form,
          no demo to look at.
        </p>
        <p className="text-sm text-fg-muted">
          We will put a real page here when the CLI is something you can actually run. Until then,
          the only honest answer is: not yet.
        </p>

        <div className="surface space-y-2 p-6 text-sm text-fg-muted">
          <p className="font-semibold text-fg">If you want to know when it ships</p>
          <p>
            Star{' '}
            <a
              className="text-accent hover:underline"
              href={SITE.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              the GitHub repo
            </a>
            . Releases announce here first.
          </p>
        </div>

        <div>
          <Link href="/" className="btn-ghost">
            Back to {SITE.name}
          </Link>
        </div>
      </div>
    </section>
  );
}
