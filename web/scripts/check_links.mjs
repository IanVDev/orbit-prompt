#!/usr/bin/env node
/**
 * check_links.mjs — validate that every internal href in the site points
 * to a real route and that no obviously broken external link (e.g. wrong
 * GitHub owner) ships.
 *
 * Fail-closed: any unknown internal href OR a forbidden external pattern
 * exits 1. Run as: node ./scripts/check_links.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(HERE, '..');
const APP = path.join(WEB, 'src/app');

/** Routes that exist on the site (derived from src/app). */
function discoverRoutes(dir, prefix = '') {
  const out = new Set();
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      const next = `${prefix}/${entry}`;
      const pageFile = path.join(full, 'page.tsx');
      if (existsFile(pageFile)) {
        out.add(next || '/');
      }
      for (const r of discoverRoutes(full, next)) out.add(r);
    } else if (entry === 'page.tsx') {
      out.add(prefix || '/');
    }
  }
  return out;
}

function existsFile(p) {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

function walkSources(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walkSources(full));
    } else if (/\.(tsx?|mdx)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const routes = discoverRoutes(APP);
const sources = walkSources(path.join(WEB, 'src'));

const internalRefs = new Set();
const externalRefs = new Set();

const HREF_RE = /href=(?:"|\{")([^"]+)(?:"|"\})/g;

for (const file of sources) {
  const text = readFileSync(file, 'utf8');
  let m;
  while ((m = HREF_RE.exec(text)) !== null) {
    const href = m[1];
    if (!href || href.startsWith('#')) continue;
    if (href.startsWith('http')) externalRefs.add(href);
    else if (href.startsWith('/')) internalRefs.add(href.split('#')[0].split('?')[0]);
  }
}

let failures = 0;
const fail = (msg) => {
  console.error(`[FAIL] ${msg}`);
  failures += 1;
};
const pass = (msg) => console.log(`[PASS] ${msg}`);

console.log('\n── link check ──\n');
console.log(`Discovered routes: ${[...routes].sort().join(', ')}`);

for (const ref of [...internalRefs].sort()) {
  if (routes.has(ref)) {
    pass(`internal ${ref}`);
  } else {
    fail(`internal href ${ref} has no matching page.tsx`);
  }
}

const FORBIDDEN_EXTERNAL = [
  /github\.com\/(?!IanVDev\/orbit-prompt)[^/]+\/orbit-prompt/i,
  /(?<!nocookie\.)youtube\.com\/embed/i, // privacy: prefer youtube-nocookie
];

for (const ref of [...externalRefs].sort()) {
  let bad = false;
  for (const re of FORBIDDEN_EXTERNAL) {
    if (re.test(ref)) {
      fail(`external href looks wrong: ${ref}`);
      bad = true;
      break;
    }
  }
  if (!bad) pass(`external ${ref}`);
}

if (failures > 0) {
  console.error(`\n🔴 link check failed (${failures})`);
  process.exit(1);
}
console.log('\n🟢 link check OK');
