/**
 * Consistent stage colors for pipeline visualization.
 * Applied to Top opportunities badges and Pipeline by stage table.
 */

type StageStyle = {
  badge: string;
  dot: string;
};

// Order matters: first match wins. Use lowercase for comparison.
const STAGE_RULES: { pattern: RegExp; badge: string; dot: string }[] = [
  { pattern: /closed\s*won|won/, badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500' },
  { pattern: /closed\s*lost|lost/, badge: 'bg-red-50 text-rta-red border-red-200', dot: 'bg-red-500' },
  { pattern: /delivered/, badge: 'bg-teal-50 text-teal-800 border-teal-200', dot: 'bg-teal-500' },
  { pattern: /confirmed/, badge: 'bg-blue-50 text-blue-800 border-blue-200', dot: 'bg-blue-500' },
  { pattern: /negotiation/, badge: 'bg-amber-50 text-amber-800 border-amber-300', dot: 'bg-amber-500' },
  { pattern: /on\s*hold|hold/, badge: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-500' },
  { pattern: /draft/, badge: 'bg-gray-100 text-gray-700 border-gray-300', dot: 'bg-gray-500' },
  { pattern: /sent|submitted/, badge: 'bg-indigo-50 text-indigo-800 border-indigo-200', dot: 'bg-indigo-500' },
  { pattern: /approved/, badge: 'bg-green-50 text-green-800 border-green-200', dot: 'bg-green-500' },
  { pattern: /rejected/, badge: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
];

const DEFAULT_STYLE: StageStyle = {
  badge: 'bg-rta-bg-light text-rta-text-secondary border-rta-border',
  dot: 'bg-rta-text-light',
};

export function getStageBadgeClass(stage: string): string {
  const s = (stage || '').toLowerCase().trim();
  const rule = STAGE_RULES.find((r) => r.pattern.test(s));
  return rule ? rule.badge : DEFAULT_STYLE.badge;
}

export function getStageDotClass(stage: string): string {
  const s = (stage || '').toLowerCase().trim();
  const rule = STAGE_RULES.find((r) => r.pattern.test(s));
  return rule ? rule.dot : DEFAULT_STYLE.dot;
}
