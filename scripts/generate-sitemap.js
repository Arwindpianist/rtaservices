#!/usr/bin/env node
/**
 * Generates public/sitemap.xml at build time.
 * Run before `next build` so the static sitemap is included in the output.
 * Next.js also serves /sitemap.xml via app/sitemap.ts when the app runs.
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.rtaservices.net';
const PUBLIC_PATHS = [
  { path: '', priority: '1.0', changeFrequency: 'weekly' },
  { path: '/about', priority: '0.8', changeFrequency: 'monthly' },
  { path: '/services', priority: '0.9', changeFrequency: 'monthly' },
  { path: '/services/oss', priority: '0.8', changeFrequency: 'monthly' },
  { path: '/contact', priority: '0.7', changeFrequency: 'monthly' },
  { path: '/support/request', priority: '0.85', changeFrequency: 'monthly' },
];

const baseUrl = BASE_URL.replace(/\/$/, '');
const now = new Date().toISOString();

const urls = PUBLIC_PATHS.map(({ path, priority, changeFrequency }) => {
  const url = path ? `${baseUrl}${path}` : baseUrl;
  return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n');

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const fs = require('fs');
const path = require('path');
const outDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf8');
console.log('Generated public/sitemap.xml');
