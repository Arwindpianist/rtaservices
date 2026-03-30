import type { OssFamily } from '@/lib/oss/oss-catalog';
import type { OssRecognitionResult } from '@/lib/oss/oss-recognition';
import { BLENDED_TEMPLATES, SINGLE_FAMILY_TEMPLATES, type OssAnswerTemplate } from '@/lib/oss/oss-templates';

const LIFECYCLE_KEYWORDS = [
  'legacy',
  'unsupported',
  'old version',
  'cannot upgrade',
  'cant upgrade',
  'eol',
  'eos',
  'end of life',
  'end-of-life',
];

export interface OssRoutedAnswer extends OssAnswerTemplate {
  mode: 'single-family' | 'mixed' | 'broad' | 'lifecycle' | 'fallback';
  familyCount: number;
  families: OssFamily[];
}

export function hasLifecycleSignal(input: string, supportContext?: string): boolean {
  const source = `${input} ${supportContext ?? ''}`.toLowerCase();
  return LIFECYCLE_KEYWORDS.some((k) => source.includes(k));
}

export function routeOssAnswer(
  recognition: OssRecognitionResult,
  input: string,
  supportContext?: string
): OssRoutedAnswer {
  const familySet = new Set<OssFamily>(recognition.recognized.map((item) => item.family));
  const families = Array.from(familySet);
  const familyCount = families.length;
  const lifecycle = hasLifecycleSignal(input, supportContext);

  if (lifecycle) {
    return { ...BLENDED_TEMPLATES.lifecycle, mode: 'lifecycle', familyCount, families };
  }

  if (familyCount === 1 && families[0]) {
    return {
      ...SINGLE_FAMILY_TEMPLATES[families[0]],
      mode: 'single-family',
      familyCount,
      families,
    };
  }

  if (familyCount === 2) {
    return { ...BLENDED_TEMPLATES.mixed, mode: 'mixed', familyCount, families };
  }

  if (familyCount >= 3) {
    return { ...BLENDED_TEMPLATES.broad, mode: 'broad', familyCount, families };
  }

  return { ...BLENDED_TEMPLATES.fallback, mode: 'fallback', familyCount, families };
}
