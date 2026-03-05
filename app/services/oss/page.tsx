'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  User,
  Layers,
  Shield,
  Wrench,
  MessageCircle,
  Monitor,
  GitBranch,
  Users,
  MapPin,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

const OSS_PACKAGES = [
  'Puppet',
  'Kubernetes',
  'Prometheus',
  'Angular.js',
  'Apache Tomcat',
  'Apache ActiveMQ',
  'Apache Cassandra',
  'Apache Spark',
  'Apache Kafka',
  'CentOS',
  'Hadoop',
];

const ossTiers = [
  { tier: 'GOLD', coverage: '24 x 7 Around the clock', response: 'Within 1 hour', submission: 'Chat, Email, Group Chat, Phone', l1: 'By RTA', l2l3: 'Enterprise Architects 20+ years experience' },
  { tier: 'SILVER', coverage: 'Business Hours 8am - 6pm local time', response: 'Within 4 hours', submission: 'Chat, Email, Group Chat', l1: 'By RTA', l2l3: 'Senior Engineers 10+ years experience' },
  { tier: 'BRONZE', coverage: 'Business Hours 8am - 6pm local time', response: 'Within 8 hours', submission: 'Email, Portal', l1: 'By RTA', l2l3: 'Engineers 5+ years experience' },
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

      {/* Value Propositions - 3 blocks with red accent bars */}
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

      {/* Technology logos */}
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
            {OSS_PACKAGES.map((name) => (
              <motion.span
                key={name}
                variants={getAnimationVariants(fadeInUp)}
                className="px-4 py-2 bg-white border border-rta-border rounded-lg text-body-sm font-medium text-rta-text"
              >
                {name}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What RTA OSS Offers */}
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

      {/* Key Use Cases */}
      <section className="py-16 lg:py-24 bg-rta-card-bg">
        <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.div
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <h2 className="text-h2-md md:text-h2 font-bold text-rta-blue mb-2">
              RTA OSS <span className="text-rta-red">Key</span> Use Cases
            </h2>
            <p className="text-body text-rta-text-secondary">
              Solving critical challenges in production environments
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            {[
              { title: 'A security audit reveals unsupported packages', desc: 'EOL components are found in production. We rapidly provide patch coverage or mitigation plans.' },
              { title: 'A key package is no longer maintained', desc: 'When community support ends, we step in to ensure continuity and security for critical packages.' },
              { title: 'A production issue spans multiple layers', desc: 'Problems like Kafka slowdowns often involve JVM/OS layers; we diagnose and resolve across the stack.' },
              { title: 'DevOps and SRE teams need expert backup', desc: 'We handle deep open-source issues so internal teams can stay focused on product delivery.' },
            ].map((useCase, idx) => (
              <motion.div
                key={idx}
                className="bg-white border-l-[6px] border-l-rta-blue p-6 rounded-lg border border-rta-border shadow-sm"
                variants={getAnimationVariants(fadeInUp)}
              >
                <h3 className="font-bold text-rta-text mb-2">{useCase.title}</h3>
                <p className="text-body-sm text-rta-text-secondary">{useCase.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Integrated Community Management */}
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
              Integrated Community <span className="text-rta-red">Management</span>
            </h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            <motion.div variants={getAnimationVariants(fadeInUp)}>
              <h3 className="text-h3 font-bold text-rta-text mb-6">Online Activities</h3>
              <ul className="space-y-6">
                {[
                  { icon: MessageCircle, title: 'Forums & Mailing Lists', desc: 'Active moderation and technical guidance to foster healthy discussions.' },
                  { icon: Monitor, title: 'Webinars & Workshops', desc: 'Regular technical deep-dives and training sessions for the community.' },
                  { icon: GitBranch, title: 'Code Contribution', desc: 'Continuous upstream contribution and transparent patch management.' },
                ].map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={idx} className="flex gap-4">
                      <div className="p-2 bg-rta-red/10 rounded-lg flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-rta-red" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-rta-text mb-1">{item.title}</h4>
                        <p className="text-body-sm text-rta-text-secondary">{item.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
            <motion.div variants={getAnimationVariants(fadeInUp)}>
              <h3 className="text-h3 font-bold text-rta-text mb-6">Offline Activities</h3>
              <ul className="space-y-6">
                {[
                  { icon: Users, title: 'Conferences', desc: 'Sponsorship and speaking engagements at major open-source events.' },
                  { icon: MapPin, title: 'Local Meetups', desc: 'Organizing and supporting local user groups and developer meetups.' },
                  { icon: Lightbulb, title: 'Customer Advisory Board', desc: 'Direct feedback loop connecting enterprise needs with project roadmaps.' },
                ].map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={idx} className="flex gap-4">
                      <div className="p-2 bg-rta-red/10 rounded-lg flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-rta-red" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-rta-text mb-1">{item.title}</h4>
                        <p className="text-body-sm text-rta-text-secondary">{item.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 24/7 Support Levels */}
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
              RTA <span className="text-rta-red">24/7</span> Support Levels
            </h2>
          </motion.div>
          <motion.div
            className="overflow-x-auto rounded-lg border border-rta-border"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr>
                  <th className="bg-rta-blue text-white px-4 py-3 text-body-sm font-semibold">Tier</th>
                  <th className="bg-rta-gold text-white px-4 py-3 text-body-sm font-semibold">GOLD</th>
                  <th className="bg-rta-tier-grey text-white px-4 py-3 text-body-sm font-semibold">SILVER</th>
                  <th className="bg-amber-700 text-white px-4 py-3 text-body-sm font-semibold">BRONZE</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-rta-border">
                  <td className="px-4 py-3 bg-rta-bg-light font-medium text-body-sm">Coverage</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[0].coverage}</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[1].coverage}</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[2].coverage}</td>
                </tr>
                <tr className="border-b border-rta-border">
                  <td className="px-4 py-3 bg-rta-bg-light font-medium text-body-sm">Response Time (Severity 1)</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[0].response}</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[1].response}</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[2].response}</td>
                </tr>
                <tr className="border-b border-rta-border">
                  <td className="px-4 py-3 bg-rta-bg-light font-medium text-body-sm">Problem Submission</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[0].submission}</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[1].submission}</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[2].submission}</td>
                </tr>
                <tr className="border-b border-rta-border">
                  <td className="px-4 py-3 bg-rta-bg-light font-medium text-body-sm">L1 Support</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[0].l1} <span className="inline-block px-2 py-0.5 bg-rta-blue text-white text-xs rounded">RTA TEAM</span></td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[1].l1} <span className="inline-block px-2 py-0.5 bg-rta-blue text-white text-xs rounded">RTA TEAM</span></td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[2].l1} <span className="inline-block px-2 py-0.5 bg-rta-blue text-white text-xs rounded">RTA TEAM</span></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 bg-rta-bg-light font-medium text-body-sm">L2/L3 Support</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[0].l2l3}</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[1].l2l3}</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[2].l2l3}</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Rate Card */}
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
              Rate Card – <span className="text-rta-gold">Starting Price</span>
            </h2>
          </motion.div>
          <motion.div
            className="space-y-12"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            <motion.div variants={getAnimationVariants(fadeInUp)}>
              <h3 className="text-h3 font-bold text-rta-blue mb-4">
                Technical Support – Price Per Instance Per Package (USD)
              </h3>
              <div className="overflow-x-auto rounded-lg border border-rta-border">
                <table className="w-full text-left border-collapse bg-white">
                  <thead>
                    <tr>
                      <th className="bg-rta-blue text-white px-4 py-3 text-body-sm font-semibold">Tier</th>
                      <th className="bg-rta-blue text-white px-4 py-3 text-body-sm font-semibold">1–25</th>
                      <th className="bg-rta-blue text-white px-4 py-3 text-body-sm font-semibold">26–100</th>
                      <th className="bg-rta-blue text-white px-4 py-3 text-body-sm font-semibold">101–250</th>
                      <th className="bg-rta-blue text-white px-4 py-3 text-body-sm font-semibold">250+</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-rta-border"><td className="px-4 py-3 bg-rta-card-bg font-medium text-body-sm">Gold</td><td className="px-4 py-3 text-body-sm">—</td><td className="px-4 py-3 text-body-sm">—</td><td className="px-4 py-3 text-body-sm">—</td><td className="px-4 py-3 text-body-sm">—</td></tr>
                    <tr className="border-b border-rta-border"><td className="px-4 py-3 bg-rta-card-bg font-medium text-body-sm">Silver</td><td className="px-4 py-3 text-body-sm">—</td><td className="px-4 py-3 text-body-sm">—</td><td className="px-4 py-3 text-body-sm">—</td><td className="px-4 py-3 text-body-sm">—</td></tr>
                    <tr><td className="px-4 py-3 bg-rta-card-bg font-medium text-body-sm">Bronze</td><td className="px-4 py-3 text-body-sm text-rta-red font-semibold">At $1,318 per instance</td><td className="px-4 py-3 text-body-sm">—</td><td className="px-4 py-3 text-body-sm">—</td><td className="px-4 py-3 text-body-sm">—</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-body-sm text-rta-text-secondary mt-4">
                Open source with enterprise-grade standards, backed by guaranteed SLAs
              </p>
            </motion.div>
            <motion.div variants={getAnimationVariants(fadeInUp)}>
              <h3 className="text-h3 font-bold text-rta-blue mb-4">
                Long Term Support – Price Per Instance (AngularJS, CentOS, Bootstrap)
              </h3>
              <div className="overflow-x-auto rounded-lg border border-rta-border">
                <table className="w-full text-left border-collapse bg-white">
                  <thead>
                    <tr>
                      <th className="bg-rta-blue text-white px-4 py-3 text-body-sm font-semibold">Tier</th>
                      <th className="bg-rta-blue text-white px-4 py-3 text-body-sm font-semibold">1–25</th>
                      <th className="bg-rta-blue text-white px-4 py-3 text-body-sm font-semibold">26–100</th>
                      <th className="bg-rta-blue text-white px-4 py-3 text-body-sm font-semibold">101–250</th>
                      <th className="bg-rta-blue text-white px-4 py-3 text-body-sm font-semibold">250+</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 bg-rta-card-bg font-medium text-body-sm border-l-[6px] border-l-rta-gold">Gold</td>
                      <td className="px-4 py-3 text-body-sm text-rta-red font-semibold">At $5,600 per instance</td>
                      <td className="px-4 py-3 text-body-sm">—</td>
                      <td className="px-4 py-3 text-body-sm">—</td>
                      <td className="px-4 py-3 text-body-sm">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-body-sm text-rta-text-secondary mt-4">
                Private repositories, production-ready patches for critical/high-severity issues on EOL software including CentOS, AngularJS, and Bootstrap.
              </p>
            </motion.div>
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
              <Link href="/contact?form=quote">
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
