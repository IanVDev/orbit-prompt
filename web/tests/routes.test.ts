import { existsSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { NAV, FOOTER_LINKS } from '../src/lib/site';

const ROOT = new URL('../src/app/', import.meta.url);

function pageFileFor(href: string): URL {
  if (href === '/') return new URL('page.tsx', ROOT);
  return new URL(`${href.replace(/^\//, '')}/page.tsx`, ROOT);
}

describe('every navigable href has a matching page.tsx', () => {
  for (const item of NAV) {
    it(`NAV → ${item.href} has a page`, () => {
      expect(existsSync(pageFileFor(item.href))).toBe(true);
    });
  }

  for (const link of FOOTER_LINKS) {
    it(`FOOTER → ${link.href} has a page`, () => {
      expect(existsSync(pageFileFor(link.href))).toBe(true);
    });
  }
});
