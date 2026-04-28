/**
 * Single source of truth for public-facing copy, commands, and links.
 *
 * Anti-regression tests in /tests assert against the literal values here:
 * if a command, GitHub link, or canonical phrase drifts from the README /
 * plugin manifest, CI fails before the site ships.
 */

export const SITE = {
  name: 'Orbit Prompt',
  tagline: 'Turn rough ideas into structured Claude Code prompts.',
  canonicalDescription:
    'A Claude Code plugin that turns rough ideas into structured prompts.',
  longDescription:
    'Orbit Prompt is a Claude Code plugin that catches weak prompts before they cost you turns. It reads your idea, surfaces the gaps, and suggests a scoped, verifiable version. It does not modify anything — you decide what to use.',
  url: 'https://orbit-prompt.dev',
  githubRepo: 'IanVDev/orbit-prompt',
  githubUrl: 'https://github.com/IanVDev/orbit-prompt',
  issuesUrl: 'https://github.com/IanVDev/orbit-prompt/issues',
  releasesUrl: 'https://github.com/IanVDev/orbit-prompt/releases',
  command: '/orbit-prompt',
  pluginName: 'orbit-prompt',
  marketplaceSlug: 'IanVDev/orbit-prompt',
} as const;

/**
 * Install commands — these run *inside* Claude Code, not in a shell.
 * The README enforces the same wording; tests assert exact equality.
 */
export const INSTALL_COMMANDS = {
  marketplace: '/plugin marketplace add IanVDev/orbit-prompt',
  install: '/plugin install orbit-prompt@orbit-prompt',
  reload: '/reload-plugins',
} as const;

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/prompt', label: 'How it works' },
  { href: '/install', label: 'Install' },
  { href: '/examples', label: 'Examples' },
  { href: '/videos', label: 'Videos' },
  { href: '/faq', label: 'FAQ' },
] as const;

export const FOOTER_LINKS = [
  { href: '/install', label: 'Install' },
  { href: '/examples', label: 'Examples' },
  { href: '/videos', label: 'Videos' },
  { href: '/faq', label: 'FAQ' },
  { href: '/changelog', label: 'Changelog' },
  { href: '/engine', label: 'Coming next' },
] as const;

/**
 * Output blocks the plugin returns. Used in marketing copy and rendered
 * verbatim on /prompt and /examples to avoid drift with the skill contract.
 */
export const OUTPUT_BLOCKS = [
  'ORIGINAL PROMPT',
  'ANALYSIS',
  'IMPROVED PROMPT',
  'KEY IMPROVEMENTS',
  'READY TO SEND',
] as const;
