'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ProductLogo from '@/components/ProductLogo';
import {
  TPM_PRODUCT_LOGO,
  OSS_PRODUCT_LOGO,
  PS_SERVICES,
} from '@/lib/data/product-range-logos';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';
import { Wrench, Code2, Users } from 'lucide-react';

export default function ProductPage() {
  return (
    <div className="bg-white">
      {/* Page intro */}
      <section className="py-12 lg:py-16 border-b border-rta-border">
        <div className="mx-auto px-5 sm:px-6" style={{ maxWidth: '1400px' }}>
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <h1 className="text-h1-md md:text-h1 font-bold text-rta-blue mb-3">
              Our Product & Service Range
            </h1>
            <p className="text-body-lg text-rta-text-secondary max-w-2xl mx-auto">
              Third-party maintenance (TPM), open-source software (OSS) support, and professional services (PS)—all under one roof.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 1. TPM product range with logos */}
      <section className="py-12 lg:py-16 bg-rta-bg-light">
        <div className="mx-auto px-5 sm:px-6" style={{ maxWidth: '1400px' }}>
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <div className="inline-flex items-center gap-2 text-rta-gold mb-2" aria-hidden="true">
              <Wrench className="w-5 h-5" />
              <span className="text-body font-semibold uppercase tracking-wider">Hardware</span>
            </div>
            <h2 className="text-h2-md md:text-h2 font-bold text-rta-blue mb-2">
              RTA <span className="text-rta-gold">TPM</span> Product Range
            </h2>
            <p className="text-body-lg font-semibold text-rta-text-secondary uppercase tracking-wider mb-2">
              Server, Storage & Network
            </p>
            <Separator className="w-24 mx-auto my-4 bg-rta-gold" />
            <p className="text-body text-rta-text-secondary max-w-3xl mx-auto">
              We support all major brands in the IT space—servers, storage systems, and networking equipment—with comprehensive third-party maintenance.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            {TPM_PRODUCT_LOGO.map((brand) => (
              <motion.div
                key={brand.name}
                className="group flex items-center justify-center aspect-square min-h-[140px] rounded-xl bg-white border border-rta-border p-6 shadow-sm transition-all duration-300 hover:border-rta-gold hover:shadow-md hover:shadow-rta-gold/10"
                variants={getAnimationVariants(fadeInUp)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <ProductLogo
                  name={brand.name}
                  logo={brand.logo}
                  size={160}
                  grayscale
                  className="max-h-24 max-w-full w-auto object-contain"
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <Button asChild className="bg-rta-gold-cta text-white hover:bg-rta-gold-cta-hover">
              <Link href="/contact">Get TPM support</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 2. OSS product range with logos */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="mx-auto px-5 sm:px-6" style={{ maxWidth: '1400px' }}>
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <div className="inline-flex items-center gap-2 text-rta-red mb-2" aria-hidden="true">
              <Code2 className="w-5 h-5" />
              <span className="text-body font-semibold uppercase tracking-wider">Open source</span>
            </div>
            <h2 className="text-h2-md md:text-h2 font-bold text-rta-blue mb-2">
              RTA <span className="text-rta-gold">OSS</span> Product Range
            </h2>
            <p className="text-body-lg font-semibold text-rta-red uppercase tracking-wide mb-2">
              400+ open-source software packages supported
            </p>
            <Separator className="w-24 mx-auto my-4 bg-rta-red" />
            <p className="text-body text-rta-text-secondary max-w-3xl mx-auto">
              Enterprise-grade OSS support with guaranteed SLAs. From Kubernetes and PostgreSQL to CentOS and Rocky Linux.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            {OSS_PRODUCT_LOGO.map((item) => (
              <motion.div
                key={item.name}
                variants={getAnimationVariants(fadeInUp)}
                className="flex flex-col items-center justify-center gap-2 px-4 py-5 bg-rta-card-bg border border-rta-border rounded-xl text-center transition-all duration-300 hover:border-rta-gold hover:shadow-md"
              >
                <ProductLogo
                  name={item.name}
                  logo={item.logo}
                  size={40}
                  className="flex-shrink-0"
                />
                <span className="text-body-sm font-medium text-rta-text">{item.name}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <Button asChild variant="outline" className="border-2 border-rta-blue text-rta-blue hover:bg-rta-blue hover:text-white">
              <Link href="/services/oss">Explore OSS support</Link>
            </Button>
            <span className="mx-2 text-rta-text-secondary">or</span>
            <Button asChild variant="outline" className="border-2 border-rta-red text-rta-red hover:bg-rta-red hover:text-white">
              <Link href="/support/request">Search for OSS support</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 3. PS range of services */}
      <section className="py-12 lg:py-16 bg-rta-bg-light">
        <div className="mx-auto px-5 sm:px-6" style={{ maxWidth: '1400px' }}>
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <div className="inline-flex items-center gap-2 text-rta-blue mb-2" aria-hidden="true">
              <Users className="w-5 h-5" />
              <span className="text-body font-semibold uppercase tracking-wider">Consulting</span>
            </div>
            <h2 className="text-h2-md md:text-h2 font-bold text-rta-blue mb-2">
              RTA <span className="text-rta-gold">PS</span> Range of Services
            </h2>
            <p className="text-body-lg font-semibold text-rta-text-secondary uppercase tracking-wider mb-2">
              Strategic consulting & make IT happen
            </p>
            <Separator className="w-24 mx-auto my-4 bg-rta-blue" />
            <p className="text-body text-rta-text-secondary max-w-3xl mx-auto">
              End-to-end professional services for servers, storage, and networking—from installation and upgrades to migrations and ITAD.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(staggerContainer)}
          >
            {PS_SERVICES.map((service) => (
              <motion.div
                key={service.title}
                variants={getAnimationVariants(fadeInUp)}
                className="flex gap-4 p-5 rounded-xl bg-white border border-rta-border shadow-sm transition-all duration-300 hover:border-rta-gold hover:shadow-md"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-rta-gold/10 flex items-center justify-center" aria-hidden="true">
                  <span className="text-rta-gold font-bold text-sm">PS</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-h3 font-bold text-rta-blue mb-1">{service.title}</h3>
                  {service.description && (
                    <p className="text-body-sm text-rta-text-secondary">{service.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <Button asChild className="bg-rta-gold-cta text-white hover:bg-rta-gold-cta-hover">
              <Link href="/contact?form=quote&service=rta-ps">Request PS quote</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-rta-blue">
        <div className="mx-auto px-5 sm:px-6 text-center" style={{ maxWidth: '1400px' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <h2 className="text-h2-md font-bold text-white mb-3">
              Unlock the full potential of your IT infrastructure
            </h2>
            <p className="text-body-lg text-white/90 max-w-2xl mx-auto mb-6">
              Whether you need TPM, OSS support, or professional services, we have the expertise and partnerships to support you.
            </p>
            <Button
              asChild
              className="bg-rta-gold-cta text-white hover:bg-rta-gold-cta-hover hover:shadow-lg"
            >
              <Link href="/contact?form=quote">Request a quote</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
