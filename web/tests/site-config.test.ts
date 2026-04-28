import { describe, it, expect } from 'vitest';
import { INSTALL_COMMANDS, NAV, OUTPUT_BLOCKS, SITE } from '../src/lib/site';

describe('site config — single source of truth', () => {
  it('GitHub URL points to the canonical IanVDev repo', () => {
    expect(SITE.githubUrl).toBe('https://github.com/IanVDev/orbit-prompt');
    expect(SITE.issuesUrl.startsWith(SITE.githubUrl)).toBe(true);
    expect(SITE.releasesUrl.startsWith(SITE.githubUrl)).toBe(true);
  });

  it('install commands are non-empty and contain no shell-only syntax', () => {
    for (const cmd of Object.values(INSTALL_COMMANDS)) {
      expect(cmd.length).toBeGreaterThan(0);
      expect(cmd.startsWith('/')).toBe(true);
      expect(cmd).not.toMatch(/\bsudo\b|\bcurl\b|\bbash\b/);
    }
  });

  it('canonical description matches the plugin-first framing', () => {
    expect(SITE.canonicalDescription).toBe(
      'A Claude Code plugin that turns rough ideas into structured prompts.',
    );
  });

  it('NAV does not duplicate hrefs', () => {
    const hrefs = NAV.map((n) => n.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('OUTPUT_BLOCKS contains exactly the five contractual labels', () => {
    expect(OUTPUT_BLOCKS).toEqual([
      'ORIGINAL PROMPT',
      'ANALYSIS',
      'IMPROVED PROMPT',
      'KEY IMPROVEMENTS',
      'READY TO SEND',
    ]);
  });

  it('slash command is /orbit-prompt', () => {
    expect(SITE.command).toBe('/orbit-prompt');
  });
});
