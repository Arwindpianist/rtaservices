#!/usr/bin/env node
/**
 * Fetches all paginated rows from OpenLogic supported-technology and writes
 * lib/data/openlogic-supported.json. Run when you need to refresh the catalog.
 *
 *   npm run fetch-supported-software
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RTA-Services/1.0)' } },
      (res) => {
        let d = '';
        res.on('data', (c) => (d += c));
        res.on('end', () => resolve(d));
      }
    ).on('error', reject);
  });
}

function parseRows(html) {
  const rows = [];
  const re = /<tr[^>]*>\s*<td[^>]*>([^<]+)<\/td>\s*<td[^>]*>([^<]+)<\/td>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    rows.push({ name: m[1].trim(), levels: m[2].trim() });
  }
  return rows;
}

(async () => {
  const base = 'https://www.openlogic.com/supported-technology';
  const all = [];
  const seen = new Set();

  for (let page = 0; page < 100; page++) {
    const url = page === 0 ? base : `${base}?page=${page}`;
    const html = await get(url);
    const rows = parseRows(html);
    if (rows.length === 0) break;
    for (const r of rows) {
      if (!seen.has(r.name)) {
        seen.add(r.name);
        all.push(r);
      }
    }
    process.stdout.write(`\rPage ${page}  +${rows.length}  total ${all.length}   `);
    if (rows.length < 20) break;
  }

  const out = path.join(__dirname, '..', 'lib', 'data', 'openlogic-supported.json');
  fs.writeFileSync(out, JSON.stringify(all, null, 2), 'utf8');
  console.log(`\nWrote ${all.length} entries to ${out}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
