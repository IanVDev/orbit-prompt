import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { INSTALL_COMMANDS, SITE } from '../src/lib/site';

const installPage = readFileSync(
  new URL('../src/app/install/page.tsx', import.meta.url),
  'utf8',
);

const homePage = readFileSync(
  new URL('../src/app/page.tsx', import.meta.url),
  'utf8',
);

const readme = readFileSync(
  new URL('../../README.md', import.meta.url),
  'utf8',
);

const pluginManifest = JSON.parse(
  readFileSync(new URL('../../.claude-plugin/plugin.json', import.meta.url), 'utf8'),
) as { name: string; description: string };

const marketplace = JSON.parse(
  readFileSync(new URL('../../.claude-plugin/marketplace.json', import.meta.url), 'utf8'),
) as { plugins: Array<{ name: string; source: { source: string; repo: string } }> };

describe('/install page — anti-regression', () => {
  it('mentions the canonical Claude Code plugin framing', () => {
    expect(installPage).toMatch(/Claude Code plugin/);
  });

  it('renders the three official install commands via the canonical config', () => {
    // The page binds the commands via INSTALL_COMMANDS so a single source of
    // truth in src/lib/site.ts can never drift. site-config.test.ts asserts
    // those values equal the README and plugin manifest verbatim.
    expect(installPage).toContain('INSTALL_COMMANDS.marketplace');
    expect(installPage).toContain('INSTALL_COMMANDS.install');
    expect(installPage).toContain('INSTALL_COMMANDS.reload');
    // Also fail if anyone hardcodes a *wrong* command bypassing the config.
    const FORBIDDEN_BAD_COMMANDS = [
      '/plugin marketplace add orbit-prompt',
      '/plugin install orbit-prompt',
      '/plugin marketplace add IanVDev/orbitprompt',
    ];
    for (const bad of FORBIDDEN_BAD_COMMANDS) {
      expect(installPage).not.toContain(bad);
    }
    // Sanity: the literal commands are present elsewhere (site config + README).
    expect(INSTALL_COMMANDS.marketplace).toBe('/plugin marketplace add IanVDev/orbit-prompt');
    expect(INSTALL_COMMANDS.install).toBe('/plugin install orbit-prompt@orbit-prompt');
    expect(INSTALL_COMMANDS.reload).toBe('/reload-plugins');
  });

  it('warns the user not to run /plugin in a terminal', () => {
    expect(installPage).toMatch(/Do not paste these in zsh, bash, or PowerShell/i);
  });

  it('has a CTA to the demo / videos page', () => {
    expect(installPage).toMatch(/Watch a 2-minute demo|\/videos|\/examples/);
  });

  it('links to the GitHub repo', () => {
    expect(installPage).toContain('SITE.githubUrl');
  });

  it('does not call the plugin a "skill" in any user-facing copy block', () => {
    // The technical distinction is allowed *only* on /prompt or in terms like
    // "skill definition". On /install, the public-facing word is "plugin".
    expect(installPage.toLowerCase()).not.toMatch(
      /\binstall the orbit-prompt skill\b|\bskill marketplace\b|\bskill install\b/,
    );
  });

  it('uses the official slash command name via SITE.command', () => {
    expect(installPage).toContain('SITE.command');
    expect(SITE.command).toBe('/orbit-prompt');
    // No silent drift to a wrong/legacy command name.
    expect(installPage).not.toContain('/orbit_prompt');
    expect(installPage).not.toContain('/orbitprompt');
  });
});

describe('/install commands match the README and plugin manifest', () => {
  it('marketplace command in README matches site config', () => {
    expect(readme).toContain(INSTALL_COMMANDS.marketplace);
  });

  it('install command in README matches site config', () => {
    expect(readme).toContain(INSTALL_COMMANDS.install);
  });

  it('plugin name in manifest matches site config', () => {
    expect(pluginManifest.name).toBe(SITE.pluginName);
  });

  it('plugin description in manifest leads with "A Claude Code plugin"', () => {
    expect(pluginManifest.description.startsWith('A Claude Code plugin')).toBe(true);
  });

  it('marketplace source repo matches site config', () => {
    const src = marketplace.plugins[0]?.source;
    expect(src?.source).toBe('github');
    expect(src?.repo).toBe(SITE.marketplaceSlug);
  });
});

describe('home page — surface checks', () => {
  it('renders the canonical tagline', () => {
    expect(homePage).toContain('SITE.tagline');
  });

  it('shows install commands inline', () => {
    expect(homePage).toContain('INSTALL_COMMANDS.marketplace');
    expect(homePage).toContain('INSTALL_COMMANDS.install');
    expect(homePage).toContain('INSTALL_COMMANDS.reload');
  });

  it('has CTAs to /install and /videos', () => {
    expect(homePage).toMatch(/href="\/install"/);
    expect(homePage).toMatch(/href="\/videos"/);
  });
});
