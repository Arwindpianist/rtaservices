'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function Hero() {
  const features = [
    { title: 'Cost Saving', detail: 'Up to 40%' },
    { title: 'Multi-Vendor', detail: '20+ brands' },
    { title: 'Guaranteed Uptime', detail: '99.9% SLA' },
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
              <h1 className="text-hero-sm md:text-hero-md lg:text-hero font-bold text-rta-blue mb-4 leading-tight">
                Enterprise <span className="text-rta-red font-bold">SLA</span> Grade Maintenance{' '}
                <span className="relative inline-block">
                  <span className="text-rta-gold">Services</span>
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-1 bg-rta-gold/40 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={viewportOptions}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    style={{ originX: 0 }}
                  />
                </span>
                {' '}&amp; Support Partner
              </h1>
              <span className="inline-block w-16 h-1 rounded-full bg-rta-gold mt-2 mb-6" aria-hidden="true" />
            </motion.div>
            <motion.p 
              className="text-body-lg md:text-xl text-rta-text-secondary mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              variants={getAnimationVariants(fadeInUp)}
            >
              We empower organizations to maintain, migrate and scale, cost effectively.
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
            className="relative h-64 md:h-96 lg:h-[420px] rounded-xl overflow-hidden"
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
              className="group relative text-center p-5 pl-6 rounded-xl bg-white/70 backdrop-blur-sm border border-rta-border/60 hover:border-rta-blue/30 hover:bg-white/90 hover:shadow-md hover:shadow-rta-blue/5 transition-all duration-300 overflow-hidden"
              variants={getAnimationVariants(fadeInUp)}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <span className="absolute left-0 top-0 bottom-0 w-[6px] bg-gradient-to-b from-rta-blue/60 to-rta-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
              <p className="text-body font-semibold text-rta-blue">{feature.title}</p>
              <p className="text-body-sm text-rta-text-secondary mt-1">{feature.detail}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
