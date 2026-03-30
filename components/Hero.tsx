'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HyperText } from '@/components/ui/hyper-text';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function Hero() {
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const heroServiceLines = useMemo(
    () => [
      'Hardware\nMaintenance.',
      'Open Source Software\nSupport.',
      'Professional\nServices.',
    ],
    []
  );
  const heroServiceColors = useMemo(
    () => ['text-rta-gold', 'text-rta-red', 'text-rta-text-muted'],
    []
  );
  useEffect(() => {
    const cycle = window.setInterval(() => {
      setActiveServiceIndex((current) => (current + 1) % heroServiceLines.length);
    }, 2600);
    return () => window.clearInterval(cycle);
  }, [heroServiceLines.length]);

  const features = [
    { title: 'Hardware Maintenance', detail: '', subDetail: 'Network and Server under SLAs', href: '/services/tpm' },
    { title: 'Open Source Software Support', detail: '24/7, guaranteed SLAs', href: '/services/oss' },
    { title: 'Professional Services', detail: 'consult, migrate, deploy', href: '/services/ps' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-rta-bg-blue/80 to-white py-20 lg:py-28 overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-rta-gold/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-rta-blue/5 rounded-full -translate-x-1/2 pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(staggerContainer)}
        >
          {/* Content */}
          <motion.div 
            className="text-center lg:text-left"
            variants={getAnimationVariants(staggerContainer)}
          >
            <motion.div variants={getAnimationVariants(fadeInUp)}>
              <div className="mb-4">
                <HyperText
                  key={heroServiceLines[activeServiceIndex]}
                  duration={900}
                  delay={0}
                  animateOnHover={false}
                  stableCharacters
                  className={`text-[clamp(1.55rem,6.5vw,3.05rem)] md:text-[clamp(2.1rem,4.2vw,3.15rem)] lg:text-[2.95rem] xl:text-[3.15rem] leading-[1.08] text-center lg:text-left mx-0 min-h-[2.8em] md:min-h-[2.6em] whitespace-pre-line lg:whitespace-pre ${heroServiceColors[activeServiceIndex] ?? 'text-rta-blue'}`}
                >
                  {heroServiceLines[activeServiceIndex] ?? ''}
                </HyperText>
                <h1 className="text-[clamp(1.55rem,6.5vw,3.05rem)] md:text-[clamp(2.1rem,4.2vw,3.15rem)] lg:text-[2.95rem] xl:text-[3.15rem] font-bold text-rta-blue leading-[1.12] mt-1 whitespace-nowrap">
                  One Trusted Partner.
                </h1>
              </div>
              <span className="inline-block w-16 h-1 rounded-full bg-rta-gold mt-2 mb-6" aria-hidden="true" />
            </motion.div>
            <motion.p 
              className="text-body-lg md:text-xl text-rta-text-secondary mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              variants={getAnimationVariants(fadeInUp)}
            >
              Maintain, migrate, and scale cost-effectively. Third-party Hardware Maintenance, OSS Support, and Professional Services. 24/7 Guaranteed SLAs.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={getAnimationVariants(fadeInUp)}
            >
              <Button
                asChild
                className="bg-rta-gold-cta text-white hover:bg-rta-gold-cta-hover hover:shadow-lg hover:shadow-rta-gold-cta/20 px-8 py-4 text-base font-semibold rounded-lg transition-all duration-300"
                aria-label="Request free consultation for enterprise IT services"
              >
                <Link href="/contact?form=quote">
                  Request Free Consultation
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Image with accent frame */}
          <motion.div 
            className="relative w-full h-56 md:h-80 lg:h-[360px] xl:h-[380px] rounded-xl overflow-hidden lg:max-w-[560px] lg:ml-auto"
            variants={getAnimationVariants(fadeInUp)}
          >
            <div className="absolute inset-0 rounded-xl ring-2 ring-white/80 ring-offset-4 ring-offset-rta-bg-blue/50 shadow-xl shadow-rta-blue/10 z-10 pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-rta-gold/20 rounded-tl-full rounded-br-xl z-0" aria-hidden="true" />
            <Image
              src="/assets/original/hero-engineer.jpg"
              alt="Certified IT engineer performing enterprise hardware maintenance in data center - RTA Services"
              fill
              className="object-cover relative z-0"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Features with accent bars */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-14 lg:mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(staggerContainer)}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="group h-full"
              variants={getAnimationVariants(fadeInUp)}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={feature.href}
                className="relative flex h-full flex-col items-center justify-center text-center p-5 pl-6 rounded-xl bg-white/70 backdrop-blur-sm border border-rta-border/60 hover:border-rta-blue/40 hover:bg-white hover:shadow-lg hover:shadow-rta-blue/10 transition-all duration-300 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rta-gold"
              >
                <span className="absolute left-0 top-0 bottom-0 w-[6px] bg-gradient-to-b from-rta-blue/70 to-rta-gold/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                <p className="text-body font-semibold text-rta-blue group-hover:text-rta-blue-hover transition-colors">{feature.title}</p>
                {feature.detail ? (
                  <p className="text-body-sm text-rta-text-secondary mt-1">{feature.detail}</p>
                ) : null}
                {feature.subDetail ? (
                  <p className="text-body-sm text-rta-text-secondary mt-0.5">{feature.subDetail}</p>
                ) : null}
                <span className="mt-2 text-xs font-semibold text-rta-gold opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore Service
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
