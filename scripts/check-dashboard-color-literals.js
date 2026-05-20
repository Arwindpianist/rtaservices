const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DASHBOARD_DIR = path.join(ROOT, 'app', 'dashboard');
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css']);

const LITERAL_PATTERNS = [
  /#[0-9a-fA-F]{3,8}\b/g,
  /\brgba?\([^)]+\)/g,
  /\bhsla?\([^)]+\)/g,
];

const ALLOWLIST = [
  /var\(--/,
  /className=.*rta-/,
  /className=.*sa-/,
  /className=.*staff-/,
  /className=.*rta-neu-/,
  /className=.*rta-staff-/,
];

function walk(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(abs, acc);
      continue;
    }
    const ext = path.extname(entry.name);
    if (EXTENSIONS.has(ext)) acc.push(abs);
  }
  return acc;
}

function isAllowed(line) {
  return ALLOWLIST.some((rx) => rx.test(line));
}

function checkFile(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  const violations = [];

  lines.forEach((line, index) => {
    if (isAllowed(line)) return;
    for (const pattern of LITERAL_PATTERNS) {
      const matches = line.match(pattern);
      if (matches) {
        violations.push({
          file: rel,
          line: index + 1,
          snippet: line.trim().slice(0, 180),
          matches,
        });
      }
    }
  });

  return violations;
}

function main() {
  const files = walk(DASHBOARD_DIR);
  const violations = files.flatMap((f) => checkFile(f));

  if (violations.length === 0) {
    console.log('dashboard-color-check: OK (no hardcoded color literals detected)');
    process.exit(0);
  }

  console.error('dashboard-color-check: Found hardcoded color literals in /app/dashboard/**');
  for (const v of violations) {
    console.error(`- ${v.file}:${v.line} -> ${v.matches.join(', ')} | ${v.snippet}`);
  }
  process.exit(1);
}

main();

