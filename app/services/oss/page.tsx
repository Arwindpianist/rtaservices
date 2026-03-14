'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Clock,
  User,
  Layers,
  Shield,
  Wrench,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import ProductLogo from '@/components/ProductLogo';
import { OSS_PRODUCT_LOGO } from '@/lib/data/product-range-logos';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

const ossTiers = [
  { tier: 'GOLD', coverage: '24 x 7 Around the clock', response: 'Within 1 hour', submission: 'Chat, Email, Group Chat, Phone', l1: 'By RTA', l2l3: 'Enterprise Architects 20+ years experience' },
  { tier: 'SILVER', coverage: 'Business Hours 8am - 6pm local time', response: 'Within 4 hours', submission: 'Chat, Email, Group Chat', l1: 'By RTA', l2l3: 'Senior Engineers 10+ years experience' },
  { tier: 'BRONZE', coverage: 'Business Hours 8am - 6pm local time', response: 'Within 8 hours', submission: 'Email, Portal', l1: 'By RTA', l2l3: 'Engineers 5+ years experience' },
  { tier: 'LTS', coverage: 'EOL Versions (Extended Lifecycle)', response: 'SLA-backed (14–30 days for patches)', submission: 'Chat, Email, Portal', l1: 'By RTA', l2l3: 'Senior Engineers' },
];

export default function OSSPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-rta-bg-blue/50 to-white">
        <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.div
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <div>
              <h1 className="text-h1-md md:text-h1 font-bold text-rta-blue mb-4">
                Enterprise Grade Partner for <span className="text-rta-red">Open-Source Software</span>
              </h1>
              <p className="text-body-lg text-rta-text-secondary max-w-2xl mb-6">
                We empower organizations to maintain, migrate and scale with Open-Source Software.
              </p>
              <p className="text-body-sm text-rta-text-muted">
                Enterprise-Grade Services and Support for Open-Source Software
              </p>
            </div>
            <div className="flex flex-col items-start gap-2">
              <span className="text-body-sm font-semibold text-rta-red">Elite Sponsor</span>
              <div className="text-body-sm text-rta-text-secondary">open source initiative®</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.div
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <h2 className="text-h2-md md:text-h2 font-bold mb-2">
              What Are The <span className="text-rta-red">Pain Points</span>?
            </h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            <motion.div variants={getAnimationVariants(fadeInUp)}>
              {[
                { title: 'Constant Updates & Patching', desc: 'Frequent security and bug fixes make it hard to stay compliant and secure.' },
                { title: 'Maintaining End-of-Life Software', desc: 'Legacy systems like CentOS, AngularJS, or Tomcat still power critical apps but lack official vendor support.' },
                { title: 'Shortage of Skilled Personnel', desc: "In-house teams may not have deep expertise across 400+ open-source technologies." },
                { title: 'Unreliable or Slow Support', desc: "Community forums or outsourced call centers can't deliver enterprise-grade response times." },
                { title: 'Multiple Vendors to Manage', desc: "Different providers for OS, databases, middleware, and DevOps tools create complexity and finger-pointing." },
              ].map((point, idx) => (
                <div key={idx} className="flex gap-4 mb-6">
                  <div className="w-[6px] flex-shrink-0 min-h-[60px] bg-rta-red rounded-full" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-rta-red mb-1">{point.title}</h3>
                    <p className="text-body-sm text-rta-text-secondary">{point.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
            <motion.div variants={getAnimationVariants(fadeInUp)} className="relative hidden lg:block">
              <div className="aspect-[3/4] max-h-[400px] bg-rta-bg-blue/20 rounded-xl" aria-hidden="true" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24 bg-rta-card-bg">
        <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.div
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <h2 className="text-h2-md md:text-h2 font-bold mb-2">
              What Are the <span className="text-rta-red">Benefits</span> of Using RTA OSS?
            </h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            <motion.div variants={getAnimationVariants(fadeInUp)}>
              {[
                { title: 'Stay Secure & Compliant', desc: 'LTS patches, fixes, and documentation for end-of-life software. Provide full auditing coverage for your open-source software.' },
                { title: 'Reduce Risk', desc: 'Minimize downtime and vulnerabilities. Provide direct expert support running 24/7.' },
                { title: 'Optimize Costs', desc: 'Lowering total cost of ownership and scaling support via instance-based licensing. Migration support from legacy proprietary software.' },
                { title: 'Enable Innovation', desc: 'Free up internal teams to focus on core projects. Provide full OSS for maintenance and security.' },
                { title: 'Ensure Operational Confidence', desc: 'Reliable response times. Provide proactive workshops and regular reviews.' },
              ].map((benefit, idx) => (
                <div key={idx} className="flex gap-4 mb-6">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-rta-red flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-rta-text mb-1">{benefit.title}</h3>
                    <p className="text-body-sm text-rta-text-secondary">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
            <motion.div variants={getAnimationVariants(fadeInUp)} className="relative hidden lg:block">
              <div className="aspect-[3/4] max-h-[400px] bg-rta-bg-blue/30 rounded-xl" aria-hidden="true" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Offered */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.div
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <h2 className="text-h2-md md:text-h2 font-bold text-rta-blue mb-2">
              What RTA OSS <span className="text-rta-gold">Offers?</span>
            </h2>
            <p className="text-body text-rta-text-secondary">
              Enterprise-Grade Services and Support for Open-Source Software
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            {[
              { icon: Clock, title: '24/7/365 Global Technical Support', desc: <>With guaranteed SLAs, covering <span className="text-rta-red font-bold">400+</span> open-source technologies.</> },
              { icon: User, title: 'Direct Access to Senior Enterprise Architects', desc: 'No call centers, no delays. Direct expert connection.' },
              { icon: Layers, title: 'End-to-End Stack Coverage', desc: 'Operating systems, DevOps, databases, middleware, orchestration, security, and more.' },
              { icon: Shield, title: 'Extended Long-Term Support (LTS)', desc: 'For end-of-life software (CentOS, AngularJS, Kafka, Bootstrap, Tomcat, etc.) with custom patches, security fixes, and compliance assurance.' },
            ].map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <motion.div key={idx} variants={getAnimationVariants(fadeInUp)}>
                  <Card className="h-full border-rta-border bg-rta-card-bg">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-rta-gold/10 rounded-full flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-rta-gold" aria-hidden="true" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-rta-text">{item.title}</CardTitle>
                          <p className="text-body-sm text-rta-text-secondary mt-2">{item.desc}</p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
            <motion.div className="md:col-span-2" variants={getAnimationVariants(fadeInUp)}>
              <Card className="h-full border-rta-border bg-rta-card-bg">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-rta-gold/10 rounded-full flex-shrink-0">
                      <Wrench className="w-6 h-6 text-rta-gold" aria-hidden="true" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-rta-text">Professional Services</CardTitle>
                      <p className="text-body-sm text-rta-text-secondary mt-2">
                        Migrations options, architecture reviews, implementation support, deployment and management of your stack, when required.
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SLA */}
      <section className="py-16 lg:py-24 bg-rta-card-bg">
        <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.div
            className="mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <h2 className="text-h2-md md:text-h2 font-bold text-rta-blue mb-2">
              OpenLogic Support Levels
            </h2>
          </motion.div>
          <motion.div
            className="overflow-x-auto rounded-lg border border-rta-border"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <table className="w-full text-left border-collapse bg-white min-w-[720px]">
              <thead>
                <tr>
                  <th className="bg-rta-blue text-white px-4 py-3 text-body-sm font-semibold">Tier</th>
                  <th className="bg-rta-gold text-white px-4 py-3 text-body-sm font-semibold">GOLD</th>
                  <th className="bg-rta-tier-grey text-white px-4 py-3 text-body-sm font-semibold">SILVER</th>
                  <th className="bg-amber-700 text-white px-4 py-3 text-body-sm font-semibold">BRONZE</th>
                  <th className="bg-rta-blue/90 text-white px-4 py-3 text-body-sm font-semibold">LTS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-rta-border">
                  <td className="px-4 py-3 bg-rta-bg-light font-medium text-body-sm">Coverage</td>
                  {ossTiers.map((t) => (
                    <td key={t.tier} className="px-4 py-3 text-body-sm">{t.coverage}</td>
                  ))}
                </tr>
                <tr className="border-b border-rta-border">
                  <td className="px-4 py-3 bg-rta-bg-light font-medium text-body-sm">Response Time (Severity 1)</td>
                  {ossTiers.map((t) => (
                    <td key={t.tier} className="px-4 py-3 text-body-sm">{t.response}</td>
                  ))}
                </tr>
                <tr className="border-b border-rta-border">
                  <td className="px-4 py-3 bg-rta-bg-light font-medium text-body-sm">Problem Submission</td>
                  {ossTiers.map((t) => (
                    <td key={t.tier} className="px-4 py-3 text-body-sm">{t.submission}</td>
                  ))}
                </tr>
                <tr className="border-b border-rta-border">
                  <td className="px-4 py-3 bg-rta-bg-light font-medium text-body-sm">L1 Support</td>
                  {ossTiers.map((t) => (
                    <td key={t.tier} className="px-4 py-3 text-body-sm">{t.l1} <span className="inline-block px-2 py-0.5 bg-rta-blue text-white text-xs rounded">RTA TEAM</span></td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 bg-rta-bg-light font-medium text-body-sm">L2/L3 Support</td>
                  {ossTiers.map((t) => (
                    <td key={t.tier} className="px-4 py-3 text-body-sm">{t.l2l3}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Long-Term Support (LTS) */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.div
            className="mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <h2 className="text-h2-md md:text-h2 font-bold text-white bg-rta-blue px-6 py-4 rounded-t-lg">
              Long-Term Support (LTS): Extended Security &amp; Compliance
            </h2>
          </motion.div>
          <motion.div
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            <motion.div variants={getAnimationVariants(fadeInUp)} className="rounded-b-lg border border-t-0 border-rta-border p-6 bg-rta-card-bg">
              <h3 className="text-h3 font-bold text-rta-blue mb-3">What is LTS?</h3>
              <p className="text-body text-rta-text-secondary">
                Long-Term Support (LTS) is a specialized offering for End-of-Life (EOL) versions of open-source software. It extends the lifecycle of critical applications by providing security maintenance and compliance support after community support ends.
              </p>
            </motion.div>

            <motion.div variants={getAnimationVariants(fadeInUp)} className="rounded-lg border border-rta-border p-6 bg-rta-card-bg">
              <h3 className="text-h3 font-bold text-rta-blue mb-4">Key LTS Benefits</h3>
              <ul className="space-y-3">
                {[
                  'Security Patches: Proactive delivery of patches for disclosed vulnerabilities.',
                  'CVE Remediation: Timely fixes for Common Vulnerabilities and Exposures.',
                  'Compliance Support: Ensures systems remain compliant with industry standards.',
                  'Patch Repository: Exclusive access to a curated repository of patches.',
                  'Extended Lifecycle: Enables planned migrations without security risks.',
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-body text-rta-text-secondary">
                    <CheckCircle2 className="w-5 h-5 text-rta-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={getAnimationVariants(fadeInUp)} className="rounded-lg border border-rta-border overflow-hidden">
              <h3 className="text-h3 font-bold text-rta-blue mb-4 px-6 pt-6">LTS SLA Structure</h3>
              <p className="text-body-sm text-rta-text-secondary mb-4 px-6">SLA targets based on CVE severity:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse bg-white">
                  <thead>
                    <tr>
                      <th className="bg-rta-bg-light px-4 py-3 text-body-sm font-semibold text-rta-text">CVE Severity</th>
                      <th className="bg-rta-bg-light px-4 py-3 text-body-sm font-semibold text-rta-text">SLA Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-rta-border">
                      <td className="px-4 py-3 text-body-sm">Critical CVEs (CVSS 9–10)</td>
                      <td className="px-4 py-3 text-body-sm font-semibold text-rta-red">14 Days</td>
                    </tr>
                    <tr className="border-b border-rta-border">
                      <td className="px-4 py-3 text-body-sm">High/Medium CVEs (CVSS 7–8.9)</td>
                      <td className="px-4 py-3 text-body-sm font-semibold">30 Days</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-body-sm">Other patches (less critical)</td>
                      <td className="px-4 py-3 text-body-sm">As soon as possible</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-body-sm text-rta-text-secondary px-6 py-3 bg-rta-bg-light border-t border-rta-border">
                Critical CVEs typically addressed within days.
              </p>
            </motion.div>

            <motion.div variants={getAnimationVariants(fadeInUp)} className="rounded-lg border border-rta-border p-6 bg-rta-card-bg">
              <h3 className="text-h3 font-bold text-rta-blue mb-3">Why Choose LTS?</h3>
              <p className="text-body text-rta-text-secondary">
                Minimize security risk while maintaining operational stability. LTS lets you plan strategic upgrades at your own pace without exposing infrastructure to known vulnerabilities.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Proof points */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            {[
              { metric: '400+', title: 'Technologies Mastered', desc: 'Deep expertise across the entire open-source landscape, from operating systems to databases and middleware.' },
              { metric: '24/7', title: 'Global Support', desc: 'Enterprise-grade reliability with guaranteed SLAs, ensuring your critical infrastructure never sleeps.' },
              { metric: '100%', title: 'Commitment', desc: 'Dedicated to maintaining, upgrading, and migrating your open-source infrastructure with expert support.' },
            ].map((block, idx) => (
              <motion.div
                key={idx}
                className="relative pl-6 border-l-[6px] border-l-rta-red bg-white p-6 rounded-lg border border-rta-border shadow-sm"
                variants={getAnimationVariants(fadeInUp)}
              >
                <p className="text-3xl font-bold text-rta-red mb-2">{block.metric}</p>
                <h3 className="text-h3 font-bold text-rta-text mb-2">{block.title}</h3>
                <p className="text-body text-rta-text-secondary">{block.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technologies mastered */}
      <section className="py-12 bg-rta-card-bg border-y border-rta-border">
        <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.p
            className="text-center text-body-sm text-rta-text-secondary mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            Technologies Mastered
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            {OSS_PRODUCT_LOGO.map((item) => (
              <motion.div
                key={item.name}
                variants={getAnimationVariants(fadeInUp)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-rta-border rounded-lg"
              >
                <ProductLogo name={item.name} logo={item.logo} size={28} />
                <span className="text-body-sm font-medium text-rta-text">{item.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-rta-blue">
        <div className="mx-auto text-center" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <h2 className="text-h2-md md:text-h2 font-bold text-white mb-4">
              Ready to Get Enterprise OSS Support?
            </h2>
            <p className="text-body-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Connect with our experts for a free consultation. We&apos;ll help you maintain, migrate, and scale your open-source infrastructure.
            </p>
            <Button
              asChild
              className="bg-rta-gold-cta text-white hover:bg-rta-gold-cta-hover hover:shadow-lg px-8 py-4 text-base font-semibold"
            >
              <Link href="/contact?form=quote&service=rta-oss">
                Request Free Consultation
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
