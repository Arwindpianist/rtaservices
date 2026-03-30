import type { OssFamily } from '@/lib/oss/oss-catalog';

export interface OssAnswerTemplate {
  title: string;
  paragraph: string;
  bullets: [string, string, string, string];
  ctaLabel: 'Discuss your environment' | 'Request support assessment';
}

export const SINGLE_FAMILY_TEMPLATES: Record<OssFamily, OssAnswerTemplate> = {
  'platform-orchestration': {
    title: 'Enterprise support for platform and orchestration environments',
    paragraph:
      'Support for production platform environments where operational stability, risk reduction, and continuity matter.',
    bullets: [
      'SLA-based response aligned to severity',
      'Meaningful workaround and mitigation guidance',
      'Support through upgrade, compatibility, and operational pressure',
      'Stronger continuity and control for critical environments',
    ],
    ctaLabel: 'Discuss your environment',
  },
  'messaging-streaming': {
    title: 'Enterprise support for messaging and streaming environments',
    paragraph:
      'Support for production messaging environments where continuity, resilience, and operational control matter.',
    bullets: [
      'SLA-based response aligned to severity',
      'Meaningful workaround and mitigation guidance',
      'Support through operational pressure and lifecycle constraints',
      'Stronger continuity and resilience for business-critical message flows',
    ],
    ctaLabel: 'Discuss your environment',
  },
  'database-data-platform': {
    title: 'Enterprise support for database and data platform environments',
    paragraph:
      'Support for production data environments where availability, performance, and continuity of critical services matter.',
    bullets: [
      'SLA-based response aligned to severity',
      'Meaningful workaround and mitigation guidance',
      'Support through performance, continuity, and operational pressure',
      'Stronger confidence in stability, recovery, and controlled transition',
    ],
    ctaLabel: 'Discuss your environment',
  },
  'application-runtime-framework': {
    title: 'Enterprise support for application runtime and framework environments',
    paragraph:
      'Support for production application environments where stability, compatibility, and controlled change matter.',
    bullets: [
      'SLA-based response aligned to severity',
      'Meaningful workaround and mitigation guidance',
      'Support through compatibility, upgrade, and change pressure',
      'Stronger continuity and control for business-critical applications',
    ],
    ctaLabel: 'Discuss your environment',
  },
  'identity-security-access': {
    title: 'Enterprise support for identity, security, and access environments',
    paragraph:
      'Support for production identity and access environments where secure continuity and operational control matter.',
    bullets: [
      'SLA-based response aligned to severity',
      'Meaningful workaround and mitigation guidance',
      'Support through access, continuity, and operational risk',
      'Stronger control for business-critical security and identity environments',
    ],
    ctaLabel: 'Discuss your environment',
  },
  'observability-operations-tooling': {
    title: 'Enterprise support for observability and operations tooling',
    paragraph:
      'Support for production operations tooling where visibility, operational awareness, and continuity matter.',
    bullets: [
      'SLA-based response aligned to severity',
      'Meaningful workaround and mitigation guidance',
      'Support through operational pressure, continuity needs, and change risk',
      'Stronger visibility and control in critical environments',
    ],
    ctaLabel: 'Discuss your environment',
  },
  'infrastructure-os': {
    title: 'Enterprise support for infrastructure and OS environments',
    paragraph:
      'Support for production foundational systems where stability, continuity, and lifecycle control matter.',
    bullets: [
      'SLA-based response aligned to severity',
      'Meaningful workaround and mitigation guidance',
      'Support through lifecycle pressure, compatibility, and operational risk',
      'Stronger continuity and control for critical foundational systems',
    ],
    ctaLabel: 'Discuss your environment',
  },
};

export const BLENDED_TEMPLATES: Record<'mixed' | 'broad' | 'lifecycle' | 'fallback', OssAnswerTemplate> = {
  mixed: {
    title: 'Support for OSS environments combining multiple critical components where continuity, stability, and operational control matter.',
    paragraph:
      'When several OSS components work together, the challenge is not only technical depth on each individual tool. It is the ability to respond quickly, reduce exposure, and support stable operations across the wider environment.',
    bullets: [
      'Faster response for production-critical situations',
      'Meaningful workaround and mitigation guidance',
      'Structured support across interconnected OSS components',
      'Stronger continuity through operational pressure and change risk',
    ],
    ctaLabel: 'Discuss your environment',
  },
  broad: {
    title: 'Support for complex OSS environments built on multiple interconnected components, where response time, mitigation, continuity, and operational control matter.',
    paragraph:
      'The value of enterprise support lies not only in resolving isolated issues, but in helping reduce operational exposure across the broader environment while maintaining continuity and supporting more controlled remediation.',
    bullets: [
      'Structured support for production-critical OSS environments',
      'Reduced exposure across platform, application, data, and access layers',
      'Stronger continuity through change, compatibility, and operational risk',
      'Documented action supporting more controlled operations',
    ],
    ctaLabel: 'Discuss your environment',
  },
  lifecycle: {
    title: 'Enterprise support for lifecycle-constrained OSS environments',
    paragraph:
      'Support for environments facing lifecycle pressure where reducing exposure and maintaining continuity matter while transition planning is underway.',
    bullets: [
      'Reduced operational exposure',
      'Better continuity for constrained environments',
      'More time to plan transitions properly',
      'Guidance on compatibility, exposure, and upgrade readiness',
    ],
    ctaLabel: 'Request support assessment',
  },
  fallback: {
    title: 'Enterprise support for your OSS environment',
    paragraph:
      'Tell us your OSS stack and constraints. We provide structured response, practical mitigation, and continuity support for production environments.',
    bullets: [
      'Faster response aligned to operational severity',
      'Practical mitigation and workaround guidance',
      'Support across change, compatibility, and lifecycle pressure',
      'Actionable recommendations for stronger continuity',
    ],
    ctaLabel: 'Discuss your environment',
  },
};
