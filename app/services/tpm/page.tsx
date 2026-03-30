'use client';

import Link from 'next/link';
import QuoteForm from '@/components/QuoteForm';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Headphones, Package, Server, CheckCircle2, ArrowRight } from 'lucide-react';
import ProductLogo from '@/components/ProductLogo';
import { TPM_PRODUCT_LOGO } from '@/lib/data/product-range-logos';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

const tpmTiers = [
  { name: 'BASIC', coverage: 'Normal Business Hours Coverage, 9 am - 6 pm, Monday to Friday Excluding public holidays', sla: '9x5', scope: 'Our 24x7 Global Helpdesk assures timely escalation, quick turnaround and effective resolution of incidences.', icon: Headphones },
  { name: 'ENHANCED', coverage: 'Extended hours coverage, 9 am - 6 pm, Monday to Saturday Excluding public holidays', sla: '9x6', scope: 'Efficient spare parts management and logistics aimed at accelerating break-fix processes.', icon: Package },
  { name: 'PREMIUM', coverage: 'Full coverage, 7 days a week 24 hours a day Including public holidays', sla: '24x7', scope: 'Swift, on-site technical support from our team of qualified and certified engineers.', icon: Server },
];

export default function TPMPage() {
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
                <span className="text-rta-gold">Third-Party Maintenance</span> – Extend Hardware Lifespan
              </h1>
              <p className="text-body-lg text-rta-text-secondary max-w-2xl mb-6">
                Cost-effective alternative to OEM maintenance. Master service levels without premium renewals cost.
              </p>
              <p className="text-body-sm text-rta-text-muted">
                Server, Storage & Network – all major brands supported
              </p>
            </div>
            <div className="relative h-48 lg:h-64 w-full lg:w-80 rounded-xl overflow-hidden">
              <Image
                src="/images/services/service-tpm-cover.jpg"
                alt="Enterprise data center and server infrastructure"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Proof points */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            {[
              { metric: '24/7', title: 'Global Helpdesk', desc: 'Around-the-clock support with enterprise SLA response times and timely escalation.' },
              { metric: 'Multi-vendor', title: 'Expertise', desc: 'Unified support for Dell, IBM, HPE, Oracle, NetApp, Cisco, and more, no finger-pointing.' },
              { metric: '40-60%', title: 'Cost Savings', desc: 'Significant savings vs OEM renewals while maintaining or exceeding service levels.' },
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

      {/* Benefits */}
      <section className="py-16 lg:py-24 bg-rta-card-bg">
        <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.div className="mb-12" initial="hidden" whileInView="visible" viewport={viewportOptions} variants={getAnimationVariants(fadeInUp)}>
            <h2 className="text-h2-md md:text-h2 font-bold mb-2">
              What RTA TPM <span className="text-rta-gold">Offers</span>
            </h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            {[
              '24/7 Global helpdesk',
              'Response time under Enterprise SLA',
              'Multi-vendor expertise',
              'Extended warranty support',
              'Hardware sparing',
              'On-site technical support (Premium tier)',
            ].map((item, idx) => (
              <motion.div key={idx} variants={getAnimationVariants(fadeInUp)} className="flex gap-3 items-start">
                <CheckCircle2 className="w-6 h-6 text-rta-gold flex-shrink-0 mt-0.5" />
                <span className="text-body text-rta-text">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Support tiers */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.div className="mb-10" initial="hidden" whileInView="visible" viewport={viewportOptions} variants={getAnimationVariants(fadeInUp)}>
            <h2 className="text-h2-md md:text-h2 font-bold text-rta-blue mb-2">
              RTA TPM <span className="text-rta-gold">24x7</span> Support Levels
            </h2>
            <p className="text-body text-rta-text-secondary">SLA TYPE: Next Business Day / 4 Hours Onsite Response / 2 Hours Onsite Response</p>
          </motion.div>
          <motion.div
            className="space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            {tpmTiers.map((tier, idx) => {
              const IconComponent = tier.icon;
              return (
                <motion.div key={idx} variants={getAnimationVariants(fadeInUp)}>
                  <Card className="overflow-hidden border-rta-border bg-rta-card-bg">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                      <div className="md:col-span-2 bg-rta-tier-grey px-4 py-3 flex items-center">
                        <span className="text-white font-bold text-sm uppercase">{tier.name}</span>
                      </div>
                      <div className="md:col-span-5 bg-rta-tier-light/50 px-4 py-3 flex items-center">
                        <span className="text-body-sm text-rta-text">{tier.coverage}</span>
                      </div>
                      <div className="md:col-span-2 bg-rta-blue px-4 py-3 flex items-center justify-center">
                        <span className="text-white font-bold">{tier.sla}</span>
                      </div>
                      <div className="md:col-span-3 px-4 py-3 flex items-start gap-3">
                        <IconComponent className="w-6 h-6 text-rta-blue flex-shrink-0 mt-0.5" />
                        <span className="text-body-sm text-rta-text-secondary">{tier.scope}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Product range */}
      <section className="py-12 bg-rta-card-bg border-y border-rta-border">
        <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.p className="text-center text-body-sm text-rta-text-secondary mb-6" initial="hidden" whileInView="visible" viewport={viewportOptions} variants={getAnimationVariants(fadeInUp)}>
            Supported Brands – Server, Storage & Network
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            {TPM_PRODUCT_LOGO.map((item) => (
              <motion.div
                key={item.name}
                variants={getAnimationVariants(fadeInUp)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-rta-border rounded-lg"
              >
                <ProductLogo name={item.name} logo={item.logo} size={28} grayscale />
                <span className="text-body-sm font-medium text-rta-text">{item.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Request Quote */}
      <section id="request-quote" className="py-16 lg:py-24 bg-rta-bg-light scroll-mt-20">
        <div className="mx-auto" style={{ maxWidth: '640px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={viewportOptions} variants={getAnimationVariants(fadeInUp)}>
            <h2 className="text-h2-md md:text-h2 font-bold text-rta-blue mb-2 text-center">Request TPM Quote</h2>
            <p className="text-body text-rta-text-secondary mb-8 text-center max-w-xl mx-auto">
              Get a quote for third-party maintenance. Significant savings with enterprise-grade support.
            </p>
            <div className="bg-white rounded-xl border border-rta-border shadow-card p-6 sm:p-8">
              <QuoteForm defaultService="rta-tpm" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
