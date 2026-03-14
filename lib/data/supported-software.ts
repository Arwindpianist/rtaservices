/**
 * Full supported-technology list (442 entries) sourced from the same catalog
 * as OpenLogic’s supported technology offering. Refreshed via:
 *   npm run fetch-supported-software
 * Data file: openlogic-supported.json (do not edit by hand—re-run fetch).
 */

import openlogicRaw from './openlogic-supported.json';

export type SupportLevel = 'Gold' | 'Silver' | 'Bronze';

export interface SupportedSoftware {
  name: string;
  supportLevel?: SupportLevel[];
}

function parseLevels(levels: string): SupportLevel[] {
  if (!levels || !levels.trim()) return [];
  return levels
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is SupportLevel => s === 'Gold' || s === 'Silver' || s === 'Bronze');
}

/** Full list, alphabetical by name */
export const SUPPORTED_SOFTWARE: SupportedSoftware[] = (openlogicRaw as { name: string; levels: string }[])
  .map((row) => ({
    name: row.name,
    supportLevel: parseLevels(row.levels),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function searchSupportedSoftware(query: string): SupportedSoftware[] {
  const q = query.trim().toLowerCase();
  if (!q) return SUPPORTED_SOFTWARE;
  return SUPPORTED_SOFTWARE.filter((s) => s.name.toLowerCase().includes(q));
}
