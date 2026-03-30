import { OSS_LOOKUP, type OssCatalogItem } from '@/lib/oss/oss-catalog';

const TOKEN_SPLIT_REGEX = /\s*(?:,|;|\+|&|\band\b|\n)\s*/gi;

export interface OssRecognitionResult {
  tokens: string[];
  recognized: OssCatalogItem[];
  unrecognized: string[];
}

export function normalizeOssInput(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.+/\\_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenizeOssInput(value: string): string[] {
  return value
    .split(TOKEN_SPLIT_REGEX)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function recognizeOss(input: string): OssRecognitionResult {
  const tokens = tokenizeOssInput(input);
  const recognizedMap = new Map<string, OssCatalogItem>();
  const unrecognized: string[] = [];

  for (const token of tokens) {
    const normalized = normalizeOssInput(token);
    const direct = OSS_LOOKUP.get(normalized);

    if (direct) {
      recognizedMap.set(direct.name, direct);
      continue;
    }

    // Soft contains-match for phrases like "legacy kafka cluster"
    let softMatch: OssCatalogItem | undefined;
    for (const [lookupKey, item] of OSS_LOOKUP.entries()) {
      if (normalized.includes(lookupKey)) {
        softMatch = item;
        break;
      }
    }

    if (softMatch) {
      recognizedMap.set(softMatch.name, softMatch);
    } else {
      unrecognized.push(token);
    }
  }

  // Whole-input scan so users can type naturally (not only comma-separated tokens).
  // Catalog size is small, so an O(n) scan is fine.
  const normalizedAll = ` ${normalizeOssInput(input)} `;
  const lookupEntries = Array.from(OSS_LOOKUP.entries()).sort(
    ([a], [b]) => b.length - a.length
  );
  for (const [lookupKey, item] of lookupEntries) {
    const needle = ` ${lookupKey} `;
    if (normalizedAll.includes(needle)) {
      recognizedMap.set(item.name, item);
    }
  }

  return {
    tokens,
    recognized: Array.from(recognizedMap.values()),
    unrecognized,
  };
}
