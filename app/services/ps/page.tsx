'use client';

import Link from 'next/link';
import QuoteForm from '@/components/QuoteForm';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Wrench } from 'lucide-react';
import { PS_SERVICES } from '@/lib/data/product-range-logos';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function PSPage() {
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
                <span className="text-rta-text-secondary">Professional Services</span> – Strategic Consulting & Make IT Happen
              </h1>
              <p className="text-body-lg text-rta-text-secondary max-w-2xl mb-6">
                RTA Professional Services – Delivering End-to-End IT Excellence. Comprehensive infrastructure solutions tailored for enterprise scale and reliability.
              </p>
              <p className="text-body-sm text-rta-text-muted">
                Servers, storage, networking – installation, upgrades, migrations, and more
              </p>
            </div>
            <div className="relative h-48 lg:h-64 w-full lg:w-80 rounded-xl overflow-hidden">
              <Image
                src="/images/services/service-ps-cover.jpg"
                alt="IT professional services and strategic consulting"
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
              {
                metric: 'L1–L3',
                title: 'Engineering',
                desc: 'Escalation and resolution from helpdesk to senior engineers and architects.',
                accentBorder: 'border-l-rta-blue',
                accentMetric: 'text-rta-text-secondary',
                accentBg: 'bg-rta-blue/[0.04]',
              },
              {
                metric: 'IMAC',
                title: 'Services',
                desc: 'Install, Move, Add & Change for servers, storage and networking.',
                accentBorder: 'border-l-rta-gold',
                accentMetric: 'text-rta-gold',
                accentBg: 'bg-rta-gold/[0.08]',
              },
              {
                metric: 'End-to-end',
                title: 'Projects',
                desc: 'From architecture reviews to migrations, deployment, and ITAD.',
                accentBorder: 'border-l-rta-red',
                accentMetric: 'text-rta-red',
                accentBg: 'bg-rta-red/[0.05]',
              },
            ].map((block, idx) => (
              <motion.div
                key={idx}
                className={`relative pl-6 border-l-[6px] ${block.accentBorder} ${block.accentBg} p-6 rounded-lg border border-rta-border/80 shadow-sm`}
                variants={getAnimationVariants(fadeInUp)}
              >
                <p className={`text-3xl font-bold mb-2 ${block.accentMetric}`}>{block.metric}</p>
                <h3 className="text-h3 font-bold text-rta-text mb-2">{block.title}</h3>
                <p className="text-body text-rta-text-secondary">{block.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Range of services */}
      <section className="py-16 lg:py-24 bg-rta-card-bg">
        <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.div className="mb-12" initial="hidden" whileInView="visible" viewport={viewportOptions} variants={getAnimationVariants(fadeInUp)}>
            <h2 className="text-h2-md md:text-h2 font-bold mb-2">
              RTA PS <span className="text-rta-gold">Range of Services</span>
            </h2>
            <p className="text-body text-rta-text-secondary">Comprehensive professional services for enterprise infrastructure</p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            {PS_SERVICES.map((service, idx) => (
              <motion.div key={idx} variants={getAnimationVariants(fadeInUp)}>
                <Card className="h-full p-6 border-rta-border bg-white hover:border-rta-gold/50 hover:shadow-md transition-all">
                  <div className="flex gap-4">
                    <div className="p-2.5 bg-rta-gold/10 rounded-lg flex-shrink-0 h-fit">
                      <Wrench className="w-5 h-5 text-rta-gold" />
                    </div>
                    <div>
                      <h3 className="text-h3 font-bold text-rta-blue mb-1">{service.title}</h3>
                      {service.description && (
                        <p className="text-body-sm text-rta-text-secondary">{service.description}</p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features list */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.div className="mb-10" initial="hidden" whileInView="visible" viewport={viewportOptions} variants={getAnimationVariants(fadeInUp)}>
            <h2 className="text-h2-md md:text-h2 font-bold text-rta-blue mb-2">What You Get</h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            {[
              'Engineering expertise from L1 to L3 support levels',
              'Project management for complex enterprise computing systems',
              'IMAC services (Install, Move, Add & Change) for servers, storage and networking',
              'Operating system installation, configuration and upgrades',
              'IT Asset Disposition (ITAD) with secure data erasure and compliance',
              'Migrations, architecture reviews, and implementation support',
            ].map((item, idx) => (
              <motion.div key={idx} variants={getAnimationVariants(fadeInUp)} className="flex gap-3 items-start">
                <CheckCircle2 className="w-6 h-6 text-rta-gold flex-shrink-0 mt-0.5" />
                <span className="text-body text-rta-text">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Request Quote */}
      <section id="request-quote" className="py-16 lg:py-24 bg-rta-bg-light scroll-mt-20">
        <div className="mx-auto" style={{ maxWidth: '640px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={viewportOptions} variants={getAnimationVariants(fadeInUp)}>
            <h2 className="text-h2-md md:text-h2 font-bold text-rta-blue mb-2 text-center">Ready to Make IT Happen?</h2>
            <p className="text-body text-rta-text-secondary mb-8 text-center max-w-xl mx-auto">
              Connect with our experts for professional services. From IMAC to migrations and ITAD. We deliver.
            </p>
            <div className="bg-white rounded-xl border border-rta-border shadow-card p-6 sm:p-8">
              <QuoteForm defaultService="rta-ps" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
