// Regenerates public/sitemap.xml from the live Supabase catalog (active +
// indexed categories/products) plus the fixed static routes. Runs
// automatically before every `npm run build` (see package.json "prebuild"),
// so whatever ships in the next deploy always reflects the real catalog —
// no more hand-edited, stale sitemap.
//
// Mirrors the query shape of supabase/functions/generate-sitemap (kept for
// reference / on-demand regeneration), but writes straight into public/ so
// it ships with the static build without needing any extra hosting wiring.
//
// Uses the public anon/publishable key — same one shipped to the browser —
// so this only ever reads what an anonymous visitor could already read.

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Most hosts already inject VITE_* as real env vars during the build (Vite
// needs them at build time regardless). Locally there's usually no such env
// var set, only a .env file — so fall back to a tiny manual parse of it
// rather than pulling in a dotenv dependency or relying on a Node version
// flag (`--env-file` needs Node 20.6+, which we can't assume the build host has).
function loadDotEnvFallback() {
  const path = join(ROOT, '.env');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, '');
  }
}
loadDotEnvFallback();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SITE_URL = (process.env.SITE_URL || 'https://steelwood.uz').replace(/\/+$/, '');

const STATIC_PAGES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/catalog', changefreq: 'daily', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  { path: '/faq', changefreq: 'monthly', priority: '0.5' },
];

function urlEntry(loc, { lastmod, changefreq, priority } = {}) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    '  </url>',
  ].filter(Boolean).join('\n');
}

async function main() {
  const outPath = join(ROOT, 'public', 'sitemap.xml');

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('[sitemap] VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY not set — leaving public/sitemap.xml untouched.');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const entries = STATIC_PAGES.map((p) => urlEntry(`${SITE_URL}${p.path}`, p));

  const { data: categories, error: catErr } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .eq('is_active', true)
    .eq('is_indexed', true);
  if (catErr) console.warn('[sitemap] categories fetch failed:', catErr.message);
  for (const c of categories || []) {
    if (!c.slug) continue;
    entries.push(urlEntry(`${SITE_URL}/catalog?category=${c.slug}`, {
      lastmod: c.updated_at,
      changefreq: 'weekly',
      priority: '0.9',
    }));
  }

  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id, slug, updated_at')
    .eq('is_active', true)
    .eq('is_indexed', true);
  if (prodErr) console.warn('[sitemap] products fetch failed:', prodErr.message);
  for (const p of products || []) {
    entries.push(urlEntry(`${SITE_URL}/product/${p.slug || p.id}`, {
      lastmod: p.updated_at,
      changefreq: 'weekly',
      priority: '0.8',
    }));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
  writeFileSync(outPath, xml, 'utf8');
  console.log(`[sitemap] wrote ${entries.length} URLs to public/sitemap.xml (${categories?.length || 0} categories, ${products?.length || 0} products)`);
}

main().catch((err) => {
  // Never fail the build over sitemap generation — worst case we ship
  // whatever public/sitemap.xml already had on disk.
  console.error('[sitemap] generation failed, keeping existing public/sitemap.xml:', err.message || err);
});
