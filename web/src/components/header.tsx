import Link from 'next/link';
import { NAV, SITE } from '@/lib/site';
import { Logo } from './logo';

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-bg/70 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-fg"
        >
          <Logo className="h-6 w-6 text-accent" />
          <span>{SITE.name}</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-fg-muted transition hover:bg-bg-raised hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={SITE.githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden text-sm text-fg-muted transition hover:text-fg sm:inline"
          >
            GitHub
          </a>
          <Link href="/install" className="btn-primary">
            Install
          </Link>
        </div>
      </div>
    </header>
  );
}
