#!/usr/bin/env node
/**
 * check_public_content.mjs — fail-closed checks for the marketing site.
 *
 * Contract:
 *   1. /install renders the three official commands (verbatim).
 *   2. /install never refers to the product as a "skill" in user-facing
 *      copy where "plugin" is the right word.
 *   3. The home page exposes a primary CTA to /install.
 *   4. README.md and the site keep the canonical description in sync.
 *   5. No accidental secrets (.env, api keys) leak into the site sources.
 *
 * Anything that fails exits 1 — CI blocks the deploy.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(HERE, '..');
const REPO = path.resolve(WEB, '..');

const installSrc = readFileSync(path.join(WEB, 'src/app/install/page.tsx'), 'utf8');
const homeSrc = readFileSync(path.join(WEB, 'src/app/page.tsx'), 'utf8');
const siteSrc = readFileSync(path.join(WEB, 'src/lib/site.ts'), 'utf8');
const readme = readFileSync(path.join(REPO, 'README.md'), 'utf8');

let failures = 0;
const fail = (m) => {
  console.error(`[FAIL] ${m}`);
  failures += 1;
};
const pass = (m) => console.log(`[PASS] ${m}`);

console.log('\n── public content check ──\n');

const COMMANDS = [
  '/plugin marketplace add IanVDev/orbit-prompt',
  '/plugin install orbit-prompt@orbit-prompt',
  '/reload-plugins',
];

for (const cmd of COMMANDS) {
  if (siteSrc.includes(cmd)) pass(`site config has command: ${cmd}`);
  else fail(`site config missing command: ${cmd}`);

  if (readme.includes(cmd)) pass(`README has command: ${cmd}`);
  else fail(`README missing command: ${cmd}`);
}

if (/Claude Code plugin/.test(installSrc))
  pass('install page mentions "Claude Code plugin"');
else fail('install page does not mention "Claude Code plugin"');

const FORBIDDEN_INSTALL_PHRASES = [
  /install the orbit-prompt skill/i,
  /skill marketplace/i,
  /skill install/i,
];
for (const re of FORBIDDEN_INSTALL_PHRASES) {
  if (re.test(installSrc)) fail(`install page uses forbidden phrase ${re}`);
  else pass(`install page does not use ${re}`);
}

if (/href="\/install"/.test(homeSrc)) pass('home links to /install');
else fail('home does not link to /install');

const CANONICAL = 'A Claude Code plugin that turns rough ideas into structured prompts';
if (siteSrc.includes(CANONICAL)) pass('site config uses canonical description');
else fail('site config canonical description drift');
if (readme.includes(CANONICAL)) pass('README uses canonical description');
else fail('README canonical description drift');

const SECRET_PATTERNS = [
  /AKIA[0-9A-Z]{16}/g,
  /sk-[A-Za-z0-9]{20,}/g,
  /ghp_[A-Za-z0-9]{20,}/g,
  /-----BEGIN (?:RSA|OPENSSH|EC) PRIVATE KEY-----/g,
];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next') continue;
    const full = path.join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full);
    else if (/\.(tsx?|mdx?|json|ya?ml|css)$/.test(entry)) {
      const text = readFileSync(full, 'utf8');
      for (const re of SECRET_PATTERNS) {
        if (re.test(text)) fail(`possible secret leak in ${path.relative(WEB, full)}`);
      }
    }
  }
}
walk(WEB);
pass('no obvious secret patterns in web/');

if (failures > 0) {
  console.error(`\n🔴 public content check failed (${failures})`);
  process.exit(1);
}
console.log('\n🟢 public content OK');
