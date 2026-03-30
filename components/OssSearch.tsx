'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ShineBorder } from '@/components/ui/shine-border';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Drawer } from 'vaul';
import { CheckCircle2, Loader2, Search, ArrowRight } from 'lucide-react';
import { OSS_CATALOG, OSS_FAMILY_LABEL, type OssFamily } from '@/lib/oss/oss-catalog';

interface OssSearchResponse {
  title: string;
  paragraph: string;
  bullets: [string, string, string, string];
  ctaLabel: 'Discuss your environment' | 'Request support assessment';
  families: OssFamily[];
  recognizedNames: string[];
  unrecognized: string[];
}

interface OssSearchProps {
  className?: string;
  heading?: string;
  description?: string;
  variant?: 'embed' | 'page';
}

export default function OssSearch({
  className = '',
  heading = 'Enterprise support for open-source environments',
  description = 'Tell us more about your OSS stack or what interests you. We return a focused support posture in seconds.',
  variant = 'embed',
}: OssSearchProps) {
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState<OssSearchResponse | null>(null);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [answerError, setAnswerError] = useState('');

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [urgency, setUrgency] = useState('Medium');
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [selectedFamilies, setSelectedFamilies] = useState<OssFamily[]>([]);
  const [ossVersions, setOssVersions] = useState<Array<{ technology: string; version: string }>>([
    { technology: '', version: '' },
  ]);
  const [typedParagraph, setTypedParagraph] = useState('');
  const [visibleBullets, setVisibleBullets] = useState(0);
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  const [showSearchAssist, setShowSearchAssist] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const typingTimersRef = useRef<number[]>([]);
  const lastTypedAnswerSignatureRef = useRef('');

  const suggestionItems = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return [];
    return OSS_CATALOG.filter((item) => item.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map((item) => item.name);
  }, [input]);

  const familyExamples = useMemo(() => {
    const familyIds: OssFamily[] = [
      'platform-orchestration',
      'messaging-streaming',
      'database-data-platform',
      'application-runtime-framework',
      'identity-security-access',
      'observability-operations-tooling',
      'infrastructure-os',
    ];
    return familyIds.map((family) => {
      const examples = OSS_CATALOG.filter((i) => i.family === family)
        .slice(0, 3)
        .map((i) => i.name);
      return { family, label: OSS_FAMILY_LABEL[family], examples };
    });
  }, []);

  const familyExampleMap = useMemo(
    () =>
      familyExamples.reduce<Record<OssFamily, string[]>>((acc, item) => {
        acc[item.family] = item.examples;
        return acc;
      }, {} as Record<OssFamily, string[]>),
    [familyExamples]
  );

  const allFamilyExampleNames = useMemo(
    () => new Set(familyExamples.flatMap((item) => item.examples).map((name) => name.toLowerCase())),
    [familyExamples]
  );

  const detectedFamilies = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return [] as OssFamily[];
    const matches = OSS_CATALOG.filter((item) => q.includes(item.name.toLowerCase())).map((item) => item.family);
    return Array.from(new Set(matches));
  }, [input]);

  const quickPrompts = useMemo(
    () => [
      'Kubernetes + PostgreSQL + Redis for production support',
      'Need LTS for CentOS and Apache Tomcat with security patching',
      'Apache Kafka, NGINX, Spring Boot and Keycloak support posture',
      'Operating mixed stack and need one SLA-backed support model',
      'OpenJDK + Spring Boot + PostgreSQL migration from legacy app servers',
      'RabbitMQ + MariaDB + NGINX for regional e-commerce platform uptime',
      'Kubernetes + Istio + Prometheus + Grafana SRE support setup',
      'MongoDB + Redis + Node.js performance tuning for customer portal',
      'OpenVPN + WireGuard + HashiCorp Vault hardening for distributed teams',
      'Elasticsearch + Logstash + Kibana reliability support for audit workloads',
      'Apache Pulsar + Apache Flink + ClickHouse pipeline support',
      'CentOS to Rocky Linux transition with minimal downtime',
      'AlmaLinux + Apache Tomcat + PostgreSQL long-term maintenance',
      'OpenSearch + Fluent Bit + Jaeger observability uplift',
      'Jenkins + Sonatype Nexus + SonarQube CI/CD stability support',
      'KVM + OpenStack Magnum + Kubernetes platform lifecycle support',
      'MySQL + Redis + NGINX readiness for year-end sales traffic',
      'PostgreSQL + Apache Airflow + Apache Spark data platform support',
      'Keycloak + OAuth2 Proxy + OpenLDAP identity integration support',
      'Apache ActiveMQ + Apache Camel middleware support for enterprise integration',
      'Prometheus + Alertmanager incident response model for 24/7 operations',
      'Kafka Connect + Schema Registry governance and compatibility support',
      'Retail peak-season resilience for Kubernetes, Redis, and PostgreSQL stack',
      'Manufacturing ERP reliability using OpenJDK, WildFly, and MariaDB',
      'Banking workload hardening with Keycloak, Vault, PostgreSQL, and NGINX',
      'Logistics platform support for RabbitMQ, MongoDB, and Node.js',
      'Hospital systems uptime support using NGINX, PostgreSQL, and OpenVPN',
      'Cross-country APAC operations: one support model for mixed OSS stack',
    ],
    []
  );

  const suggestedPrompts = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return quickPrompts.slice(0, 4);

    const ranked = quickPrompts
      .map((prompt) => {
        const lower = prompt.toLowerCase();
        const score = q
          .split(/\s+/)
          .filter(Boolean)
          .reduce((acc, token) => acc + (lower.includes(token) ? 1 : 0), 0);
        return { prompt, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((item) => item.prompt);

    return ranked.length > 0 ? ranked : quickPrompts.slice(0, 4);
  }, [input, quickPrompts]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHintIndex((prev) => (prev + 1) % quickPrompts.length);
    }, 2500);
    return () => window.clearInterval(timer);
  }, [quickPrompts.length]);

  function clearTypingTimers() {
    typingTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    typingTimersRef.current = [];
  }

  function appendToInput(value: string) {
    setInput((current) => {
      const trimmed = current.trim();
      if (!trimmed) return value;
      const tokens = trimmed
        .split(',')
        .map((token) => token.trim().toLowerCase())
        .filter(Boolean);
      if (tokens.includes(value.toLowerCase())) return current;
      return `${trimmed}, ${value}`;
    });
  }

  useEffect(() => {
    if (!input.trim()) {
      setAnswer(null);
      setAnswerError('');
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoadingAnswer(true);
      setAnswerError('');
      try {
        const res = await fetch('/api/oss/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input, selectedFamilies: detectedFamilies }),
        });
        const data = (await res.json()) as OssSearchResponse & { error?: string };
        if (!res.ok) {
          setAnswer(null);
          setAnswerError(data.error || 'Failed to analyze OSS input');
          return;
        }
        setAnswer(data);
      } catch {
        setAnswer(null);
        setAnswerError('Network error while analyzing your OSS environment');
      } finally {
        setLoadingAnswer(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [input, detectedFamilies]);

  useEffect(() => {
    if (!answer) {
      clearTypingTimers();
      setIsGeneratingAnswer(false);
      setTypedParagraph('');
      setVisibleBullets(0);
      lastTypedAnswerSignatureRef.current = '';
      return;
    }

    const answerSignature = JSON.stringify({
      title: answer.title,
      paragraph: answer.paragraph,
      bullets: answer.bullets,
      ctaLabel: answer.ctaLabel,
    });

    if (lastTypedAnswerSignatureRef.current === answerSignature) {
      clearTypingTimers();
      setIsGeneratingAnswer(false);
      setTypedParagraph(answer.paragraph);
      setVisibleBullets(answer.bullets.length);
      return;
    }

    lastTypedAnswerSignatureRef.current = answerSignature;
    clearTypingTimers();
    setTypedParagraph('');
    setVisibleBullets(0);
    setIsGeneratingAnswer(true);
    const paragraph = answer.paragraph;
    for (let i = 1; i <= paragraph.length; i += 1) {
      const timer = window.setTimeout(() => {
        setTypedParagraph(paragraph.slice(0, i));
      }, i * 10);
      typingTimersRef.current.push(timer);
    }

    const paragraphDoneDelay = paragraph.length * 10 + 120;
    answer.bullets.forEach((_, idx) => {
      const timer = window.setTimeout(() => {
        setVisibleBullets((current) => Math.max(current, idx + 1));
      }, paragraphDoneDelay + idx * 180);
      typingTimersRef.current.push(timer);
    });

    const completionTimer = window.setTimeout(() => {
      setIsGeneratingAnswer(false);
    }, paragraphDoneDelay + answer.bullets.length * 180 + 60);
    typingTimersRef.current.push(completionTimer);

    return () => clearTypingTimers();
  }, [answer]);

  useEffect(() => {
    if (!answer) {
      setSelectedFamilies([]);
      setOssVersions([{ technology: '', version: '' }]);
      return;
    }
    setSelectedFamilies(answer.families);
    if (answer.recognizedNames.length > 0) {
      setOssVersions(answer.recognizedNames.slice(0, 4).map((name) => ({ technology: name, version: '' })));
    } else {
      setOssVersions([{ technology: '', version: '' }]);
    }
  }, [answer]);

  const canSubmit = useMemo(() => {
    return (
      !!answer &&
      !!input.trim() &&
      !!name.trim() &&
      !!company.trim() &&
      !!email.trim() &&
      !!phone.trim() &&
      !!shortDescription.trim()
    );
  }, [answer, input, name, company, email, phone, shortDescription]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !answer) return;

    setSubmitting(true);
    setSubmitStatus('idle');
    setSubmitError('');

    const versionLines = ossVersions
      .map(({ technology, version }) => ({
        technology: technology.trim(),
        version: version.trim(),
      }))
      .filter(({ technology, version }) => technology || version);

    const requirements = [
      `OSS in environment: ${input.trim()}`,
      `Urgency: ${urgency}`,
      answer.recognizedNames.length > 0 ? `Recognized OSS: ${answer.recognizedNames.join(', ')}` : 'Recognized OSS: none',
      selectedFamilies.length > 0
        ? `Selected OSS families: ${selectedFamilies.map((family) => OSS_FAMILY_LABEL[family]).join(', ')}`
        : 'Selected OSS families: none',
      detectedFamilies.length > 0
        ? `Auto-detected families: ${detectedFamilies.map((family) => OSS_FAMILY_LABEL[family]).join(', ')}`
        : 'Auto-detected families: none',
      versionLines.length > 0
        ? `Declared versions: ${versionLines.map(({ technology, version }) => `${technology}${version ? ` (${version})` : ''}`).join(', ')}`
        : 'Declared versions: none',
      `Generated support posture: ${answer.title}`,
      `Short description: ${shortDescription.trim()}`,
    ].join('\n');

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: 'rta-oss',
          companyName: company.trim(),
          contactPerson: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          requirements,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setSubmitStatus('error');
        setSubmitError(data.error || 'Failed to submit request');
        return;
      }
      setSubmitStatus('success');
      setShortDescription('');
      setDrawerOpen(false);
    } catch {
      setSubmitStatus('error');
      setSubmitError('Network error while submitting request');
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => () => clearTypingTimers(), []);

  const AnswerBlock = answer ? (
    <div
      className={`rounded-xl p-6 ${variant === 'page' ? 'bg-rta-bg-light/60 shadow-sm' : 'border border-rta-border bg-white shadow-sm'}`}
    >
      <h3 className="text-body-lg font-semibold text-rta-blue mb-2">{answer.title}</h3>
      <p className="text-body text-rta-text-secondary mb-4 min-h-[56px]">
        {typedParagraph}
        {isGeneratingAnswer && <span className="inline-block w-2 h-4 ml-1 align-middle bg-rta-blue/40 animate-pulse rounded-sm" />}
      </p>
      <ul className="space-y-2">
        {answer.bullets.slice(0, visibleBullets).map((bullet) => (
          <li key={bullet} className="text-body-sm text-rta-text-secondary flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-rta-gold mt-0.5 shrink-0" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      {answer.families.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-rta-text-secondary mb-2">Matched families:</p>
          <div className="flex flex-wrap gap-2">
            {answer.families.map((family) => (
              <Link
                key={family}
                href={`/services/oss?family=${family}#request-quote`}
                className="text-xs px-2.5 py-1.5 rounded-full border border-rta-border bg-rta-bg-light hover:bg-rta-bg-blue/20 text-rta-blue transition-colors"
              >
                {OSS_FAMILY_LABEL[family]}
              </Link>
            ))}
          </div>
        </div>
      )}
      {answer.unrecognized.length > 0 && (
        <p className="text-xs text-rta-text-secondary mt-4">
          Some entries were not recognized. Include versions and context in the description for best matching.
        </p>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          className="bg-rta-gold-cta text-white hover:bg-rta-gold-cta-hover"
          onClick={() => setDrawerOpen(true)}
        >
          {answer.ctaLabel}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-rta-border text-rta-text hover:bg-rta-bg-light"
        >
          <Link href="/contact">Talk to us</Link>
        </Button>
      </div>
    </div>
  ) : null;

  const SearchBody = (
    <div className="space-y-6">
      <div className="p-1">
        <div className="relative rounded-2xl p-[2px] max-w-4xl mx-auto">
          <ShineBorder />
          <div className="relative rounded-[15px] bg-white shadow-[0_14px_36px_rgba(1,42,74,0.16)]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-rta-gold" />
            <Input
              id="oss-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => {
                setShowSearchAssist(true);
                setIsInputFocused(true);
              }}
              onBlur={() => {
                window.setTimeout(() => setIsInputFocused(false), 120);
              }}
              placeholder="Search PostgreSQL, Kubernetes outage, unsupported Redis version…"
              aria-label="Search your OSS stack"
              className="pl-14 pr-5 h-20 rounded-[15px] border-rta-border text-lg font-medium focus-visible:ring-rta-gold"
            />
          </div>
          <AnimatePresence>
            {(showSearchAssist || input.trim().length > 0) && isInputFocused && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                className="absolute left-0 right-0 top-[calc(100%+10px)] z-40 rounded-xl border border-rta-border bg-white shadow-[0_14px_30px_rgba(1,42,74,0.14)] overflow-hidden"
              >
                <div className="px-4 py-2.5 text-xs text-rta-text-secondary bg-rta-bg-light/40 border-b border-rta-border/60">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={hintIndex}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                    >
                      Try: <span className="font-semibold text-rta-text">{quickPrompts[hintIndex]}</span>
                    </motion.p>
                  </AnimatePresence>
                </div>
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setInput(prompt);
                      setIsInputFocused(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-rta-text-secondary hover:text-rta-text hover:bg-rta-bg-light transition-colors border-b border-rta-border/60 last:border-b-0"
                  >
                    {prompt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-rta-border bg-rta-bg-light/40 p-3 sm:p-4"
          >
            <p className="text-sm font-semibold text-rta-text">
              Matched families: {answer.families.length}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {answer.families.length > 0 ? (
                answer.families.map((family) => (
                  <span
                    key={`matched-${family}`}
                    className="text-sm px-3 py-1.5 rounded-full bg-rta-blue text-white border border-rta-blue shadow-sm"
                  >
                    {OSS_FAMILY_LABEL[family]}
                  </span>
                ))
              ) : (
                <span className="text-sm text-rta-text-secondary">No family match detected yet.</span>
              )}
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-rta-text-secondary">
              Other families
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {familyExamples
                .filter((family) => !answer.families.includes(family.family))
                .map((family) => (
                  <span
                    key={`other-${family.family}`}
                    className="text-sm px-3 py-1.5 rounded-full border border-rta-border bg-white text-rta-text-secondary"
                  >
                    {family.label}
                  </span>
                ))}
            </div>
          </motion.div>
        )}

        {suggestionItems.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2.5">
            {suggestionItems.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => appendToInput(name)}
                className="text-sm px-3 py-1.5 rounded-full border border-rta-border bg-white hover:bg-rta-bg-light text-rta-text-secondary transition-colors hover:-translate-y-0.5"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Familiar OSS families are auto-detected from input and intentionally hidden to keep focus on search. */}

      {loadingAnswer && (
        <div className="flex items-center gap-2 text-rta-text-secondary text-body-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Analyzing your OSS environment...
        </div>
      )}

      {answerError && <p className="text-body-sm text-red-600">{answerError}</p>}

      {answer && (variant === 'page' ? <div className="lg:hidden">{AnswerBlock}</div> : AnswerBlock)}
    </div>
  );

  function toggleFamily(family: OssFamily) {
    setSelectedFamilies((current) =>
      current.includes(family) ? current.filter((item) => item !== family) : [...current, family]
    );
  }

  function updateVersionRow(index: number, key: 'technology' | 'version', value: string) {
    setOssVersions((current) => current.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  function addVersionRow() {
    setOssVersions((current) => [...current, { technology: '', version: '' }]);
  }

  function removeVersionRow(index: number) {
    setOssVersions((current) => {
      if (current.length === 1) return [{ technology: '', version: '' }];
      return current.filter((_, i) => i !== index);
    });
  }

  return (
    <div className={className}>
      {variant === 'page' ? (
        <div className="p-1 sm:p-2 lg:p-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-h2-md md:text-h2 lg:text-[44px] font-bold text-rta-blue">{heading}</h2>
            <p className="text-body-lg text-rta-text-secondary mt-3">{description}</p>
          </div>
          <motion.div layout transition={{ duration: 0.35, ease: 'easeOut' }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <motion.div
              layout
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={loadingAnswer || !!answer ? 'lg:col-span-7' : 'lg:col-span-12'}
            >
              {SearchBody}
            </motion.div>
            <AnimatePresence initial={false}>
              {(loadingAnswer || !!answer) && (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: 24, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 16, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="hidden lg:block lg:col-span-5 w-full"
                >
                  {loadingAnswer && !answer ? (
                    <div className="rounded-xl border border-rta-border bg-white p-6 shadow-sm">
                      <div className="h-4 w-2/3 rounded bg-rta-bg-light animate-pulse" />
                      <div className="mt-4 space-y-2">
                        <div className="h-3 w-full rounded bg-rta-bg-light animate-pulse" />
                        <div className="h-3 w-11/12 rounded bg-rta-bg-light animate-pulse" />
                        <div className="h-3 w-10/12 rounded bg-rta-bg-light animate-pulse" />
                      </div>
                      <div className="mt-6 space-y-3">
                        <div className="h-3 w-4/5 rounded bg-rta-bg-light animate-pulse" />
                        <div className="h-3 w-3/4 rounded bg-rta-bg-light animate-pulse" />
                        <div className="h-3 w-4/5 rounded bg-rta-bg-light animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    AnswerBlock
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      ) : (
        <Card className="border-rta-border bg-white">
          <CardHeader>
            <CardTitle className="text-h3 text-rta-blue">{heading}</CardTitle>
            <p className="text-body text-rta-text-secondary">{description}</p>
          </CardHeader>
          <CardContent>{SearchBody}</CardContent>
        </Card>
      )}

      <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen} direction="bottom" modal>
        <Drawer.Portal>
          <Drawer.Overlay className="bg-black/50 backdrop-blur-sm" />
          <Drawer.Content className="h-[90vh] max-h-[820px] w-full bg-white shadow-2xl flex flex-col focus:outline-none rounded-t-3xl border-t border-rta-border">
            <div className="flex flex-col h-full">
              <Drawer.Handle className="mx-auto mt-2 mb-1" />
              <div className="px-6 sm:px-8 py-5 border-b border-rta-border flex items-center justify-between bg-rta-bg-light">
                <div>
                  <Drawer.Title className="text-lg font-bold text-rta-text">
                    {answer?.ctaLabel ?? 'Discuss your environment'}
                  </Drawer.Title>
                  <Drawer.Description className="text-body-sm text-rta-text-secondary mt-1">
                    Share a few details. We’ll respond with the right support path.
                  </Drawer.Description>
                </div>
                <Drawer.Close asChild>
                  <button className="text-rta-text-secondary hover:text-rta-text text-sm px-3 py-1.5 rounded-md hover:bg-rta-bg-light transition-colors">Close</button>
                </Drawer.Close>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
                <div className="rounded-xl border border-rta-border bg-white p-5">
                  <p className="text-body-sm font-semibold text-rta-blue mb-4">Contact details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="oss-name">Name</Label>
                      <Input id="oss-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-2 border-rta-border bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="oss-company">Company</Label>
                      <Input id="oss-company" value={company} onChange={(e) => setCompany(e.target.value)} className="mt-2 border-rta-border bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="oss-email">Email</Label>
                      <Input id="oss-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 border-rta-border bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="oss-phone">Phone</Label>
                      <Input id="oss-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 border-rta-border bg-white" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-rta-border bg-white p-5">
                  <p className="text-body-sm font-semibold text-rta-blue mb-4">Support request</p>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="oss-in-env">OSS in your environment</Label>
                      <Input id="oss-in-env" value={input} onChange={(e) => setInput(e.target.value)} className="mt-2 border-rta-border bg-white" />
                    </div>

                    <div>
                      <Label htmlFor="urgency">Urgency</Label>
                      <select
                        id="urgency"
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value)}
                        className="mt-2 flex h-10 w-full rounded-md border border-rta-border bg-white px-3 py-2 text-sm"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-rta-text">OSS families in scope (select multiple)</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {familyExamples.map((family) => {
                          const active = selectedFamilies.includes(family.family);
                          return (
                            <button
                              key={family.family}
                              type="button"
                              onClick={() => toggleFamily(family.family)}
                              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                                active
                                  ? 'bg-rta-blue text-white border-rta-blue'
                                  : 'bg-white text-rta-text-secondary border-rta-border hover:border-rta-blue/50'
                              }`}
                            >
                              {family.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <Label className="text-rta-text">OSS versions (optional)</Label>
                        <button
                          type="button"
                          onClick={addVersionRow}
                          className="text-sm font-medium text-rta-blue hover:text-rta-blue-hover"
                        >
                          + Add row
                        </button>
                      </div>
                      <div className="mt-2 space-y-2">
                        {ossVersions.map((row, index) => (
                          <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-2">
                            <Input
                              value={row.technology}
                              onChange={(e) => updateVersionRow(index, 'technology', e.target.value)}
                              placeholder="Technology (e.g. Kubernetes)"
                              className="border-rta-border bg-white"
                            />
                            <Input
                              value={row.version}
                              onChange={(e) => updateVersionRow(index, 'version', e.target.value)}
                              placeholder="Version (e.g. 1.29)"
                              className="border-rta-border bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => removeVersionRow(index)}
                              className="h-10 px-3 rounded-md border border-rta-border text-rta-text-secondary hover:text-rta-text hover:bg-rta-bg-light"
                              aria-label="Remove version row"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="short-description">Short description</Label>
                      <Textarea
                        id="short-description"
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        rows={5}
                        className="mt-2 border-rta-border bg-white"
                        placeholder="Describe your support need, constraints, or current issue."
                      />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-body-sm text-emerald-700"
                    >
                      Request submitted. Our OSS team will contact you shortly.
                    </motion.p>
                  )}
                  {submitStatus === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-body-sm text-red-600"
                    >
                      {submitError || 'Submission failed. Please try again.'}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="sticky bottom-0 bg-white border-t border-rta-border -mx-6 sm:-mx-8 px-6 sm:px-8 py-4">
                  <Button
                    type="submit"
                    disabled={submitting || !canSubmit}
                    className="bg-rta-gold-cta text-white hover:bg-rta-gold-cta-hover w-full h-11"
                  >
                    {submitting ? 'Submitting...' : (answer?.ctaLabel ?? 'Submit')}
                  </Button>
                </div>
              </form>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}

