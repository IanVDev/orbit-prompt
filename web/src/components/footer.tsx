import Link from 'next/link';
import { FOOTER_LINKS, SITE } from '@/lib/site';
import { Logo } from './logo';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60 bg-bg-raised/40">
      <div className="container-page flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-fg">
            <Logo className="h-5 w-5 text-accent" />
            {SITE.name}
          </Link>
          <p className="text-sm text-fg-muted">{SITE.canonicalDescription}</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-fg-muted transition hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={SITE.githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-fg-muted transition hover:text-fg"
          >
            GitHub
          </a>
          <a
            href={SITE.issuesUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-fg-muted transition hover:text-fg"
          >
            Report an issue
          </a>
        </nav>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-border/60 py-6 text-xs text-fg-subtle md:flex-row md:items-center md:justify-between">
        <span>© {year} {SITE.name}. All rights reserved.</span>
        <span>
          Built for developers who use Claude Code. Nothing on this page is sent off your machine.
        </span>
      </div>
    </footer>
  );
}
