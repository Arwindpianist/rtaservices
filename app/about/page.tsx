'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Handshake, Target, Star, DollarSign, Layers, Zap, ChevronRight } from 'lucide-react';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

const VALUE_ITEMS = [
  { icon: DollarSign, title: 'Significant Cost Saving', body: 'Our attractive pricing is designed to undercut traditional OEM maintenance contracts, offering significant cost benefits with uncompromised quality.' },
  { icon: Layers, title: 'Multi Vendor Support', body: 'With our broad coverage across major OEM brands, you can access the support you need through a single vendor.' },
  { icon: Zap, title: 'Guaranteed Uptime', body: 'Our 24x7 Global Helpdesk ensures timely escalation and resolution of incidents, complemented by efficient spare parts management and swift on-site support.' },
];

const PROPOSITION_ITEMS = [
  '24/7 Call Center',
  'Enterprise Grade SLA',
  'Access to L1–L3 Expertise',
  'Architecture Consulting',
  'IMAC Services',
  'Global/Local Logistics & Warehousing',
  'IT Asset Disposition',
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero aligned to homepage aesthetic */}
      <section className="relative bg-gradient-to-br from-rta-bg-blue/80 to-white py-16 lg:py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-rta-gold/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-rta-blue/5 rounded-full -translate-x-1/2 pointer-events-none" aria-hidden="true" />

        <div className="relative mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            <motion.div className="text-center lg:text-left" variants={getAnimationVariants(staggerContainer)}>
              <motion.h1 className="text-h1-md md:text-h1 font-bold text-rta-blue mb-4 leading-tight" variants={getAnimationVariants(fadeInUp)}>
                About RTA Services
              </motion.h1>
              <motion.span className="inline-block w-16 h-1 rounded-full bg-rta-gold mt-1 mb-6" variants={getAnimationVariants(fadeInUp)} />
              <motion.p
                className="text-body-lg md:text-xl text-rta-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed"
                variants={getAnimationVariants(fadeInUp)}
              >
                Your strategic IT maintenance partner, backed by{' '}
                <HoverCard openDelay={120} closeDelay={160}>
                  <HoverCardTrigger asChild>
                    <Link
                      href="https://aca-apac.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rta-blue hover:text-rta-blue-hover underline underline-offset-2"
                    >
                      ACA Pacific
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent side="top" align="start" className="w-[340px]">
                    <p className="text-sm font-semibold text-rta-blue mb-1">ACA Pacific</p>
                    <p className="text-sm text-rta-text-secondary leading-relaxed">
                      Established regional value-added distributor in Asia-Pacific with over 30 years
                      of experience helping organizations adopt and scale enterprise technology.
                    </p>
                  </HoverCardContent>
                </HoverCard>{' '}
                to deliver enterprise-grade support, open source expertise, and professional services at scale.
              </motion.p>
              <motion.div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start" variants={getAnimationVariants(fadeInUp)}>
                <Button asChild className="bg-rta-gold-cta text-white hover:bg-rta-gold-cta-hover px-7 py-3 rounded-lg">
                  <Link href="/contact?form=quote">Talk to Our Team</Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div className="relative w-full h-64 md:h-80 lg:h-[360px] rounded-xl overflow-hidden lg:max-w-[560px] lg:ml-auto" variants={getAnimationVariants(fadeInUp)}>
              <div className="absolute inset-0 rounded-xl ring-2 ring-white/80 ring-offset-4 ring-offset-rta-bg-blue/50 shadow-xl shadow-rta-blue/10 z-10 pointer-events-none" aria-hidden="true" />
              <Image
                src="/images/about/about-hero.jpg"
                alt="RTA Services and ACA Pacific partnership"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Unified company overview */}
      <section className="py-10 sm:py-14 lg:py-20 bg-white">
        <div className="mx-auto px-5 sm:px-6" style={{ maxWidth: '1400px' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
            className="space-y-8 sm:space-y-10"
          >
            <motion.div
              variants={getAnimationVariants(fadeInUp)}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/about/about-values.jpg"
                  alt="Partnership and collaboration - RTA Services and ACA Pacific"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="rounded-2xl border border-rta-border/70 bg-white/85 backdrop-blur-sm p-6 sm:p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-rta-gold/10 rounded-xl">
                    <Handshake className="w-6 h-6 text-rta-gold" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-bold text-rta-blue">Who We Are</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-body-lg text-rta-text-secondary leading-relaxed">
                    RTA Services is your strategic IT maintenance and support partner, helping organizations maintain, migrate, and scale infrastructure cost-effectively.
                  </p>
                  <div className="h-px bg-rta-border/70" aria-hidden="true" />
                  <p className="text-body-lg text-rta-text-secondary leading-relaxed">
                    Our team delivers reliable, specialized IT solutions tailored to changing business demands, from day-to-day operations to complex transformation initiatives.
                  </p>
                  <p className="text-body-lg text-rta-text-secondary leading-relaxed">
                    Backed by over 30 years of regional distribution and integration experience with ACA Pacific, we combine practical engineering depth, responsive support, and service discipline to keep enterprise environments stable, secure, and ready to scale.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={getAnimationVariants(fadeInUp)}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center"
            >
              <div className="rounded-2xl border border-rta-border/70 bg-white/85 backdrop-blur-sm p-6 sm:p-7 shadow-sm order-2 lg:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-rta-gold/10 rounded-xl">
                    <Target className="w-6 h-6 text-rta-gold" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-bold text-rta-blue">What We Do</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-body-lg text-rta-text-secondary leading-relaxed">
                    We provide third-party hardware and software maintenance, enterprise open source software support, and professional services spanning installation, upgrades, and OS deployment for servers, storage, and networking.
                  </p>
                  <div className="h-px bg-rta-border/70" aria-hidden="true" />
                  <p className="text-body-lg text-rta-text-secondary leading-relaxed">
                    Our service model is backed by L1 to L3 expertise, 24/7 incident response, and enterprise-grade SLAs commitments designed for production-critical systems.
                  </p>
                  <p className="text-body-lg text-rta-text-secondary leading-relaxed">
                    We also extend warranty coverage for EOL/EOSL hardware and provide warehousing, logistics, and sparing to sustain reliability beyond manufacturer support windows.
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg order-1 lg:order-2">
                <Image
                  src="/images/about/about-mission.jpg"
                  alt="Enterprise IT support and technical expertise across hardware, software, and services"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>

            <motion.div
              variants={getAnimationVariants(fadeInUp)}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/about/about-values.jpg"
                  alt="RTA Services values and customer-first delivery approach"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-rta-gold/10 rounded-xl">
                    <Star className="w-6 h-6 text-rta-gold" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-bold text-rta-blue">Why Organizations Choose Us</h2>
                </div>
                <motion.div
                  className="grid grid-cols-1 gap-4"
                  variants={getAnimationVariants(staggerContainer)}
                >
                  {VALUE_ITEMS.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={idx}
                        variants={getAnimationVariants(fadeInUp)}
                        whileHover={{ x: 6 }}
                        transition={{ duration: 0.2 }}
                        className="group flex gap-4 p-4 rounded-xl border border-rta-border bg-white hover:border-rta-blue/40 hover:shadow-md transition-all duration-300 cursor-default"
                      >
                        <div className="p-2.5 bg-rta-gold/10 rounded-lg flex-shrink-0 group-hover:bg-rta-gold/20 transition-colors">
                          <Icon className="w-5 h-5 text-rta-gold" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-h3 font-bold text-rta-blue mb-1">{item.title}</h3>
                          <p className="text-body text-rta-text-secondary">{item.body}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-rta-text-secondary flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity self-center" aria-hidden="true" />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
