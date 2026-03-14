'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ProductLogo from '@/components/ProductLogo';
import { OSS_PRODUCT_LOGO } from '@/lib/data/product-range-logos';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function OSSProductRange() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.div
          className="text-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <h2 className="text-h2-md md:text-h2 font-bold text-rta-blue mb-2">
            RTA <span className="text-rta-gold">OSS</span> Product Range
          </h2>
          <p className="text-body-lg text-rta-blue mb-2">
            We Provide Support for Top (400+)
          </p>
          <p className="text-body-lg font-bold text-rta-red uppercase tracking-wide mb-4">
            Open-Source Software Packages
          </p>
          <Separator className="w-24 mx-auto my-6 bg-rta-red" />
        </motion.div>

        <motion.div
          className="flex justify-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <Button
            asChild
            variant="outline"
            className="border-2 border-rta-blue text-rta-blue bg-transparent hover:bg-rta-blue hover:text-white px-8 py-4 text-base font-semibold rounded-lg transition-colors duration-300"
            aria-label="Search supported open-source software and request OSS support"
          >
            <Link href="/support/request">
              Search for OSS support
            </Link>
          </Button>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(staggerContainer)}
        >
          {OSS_PRODUCT_LOGO.map((item) => (
            <motion.div
              key={item.name}
              variants={getAnimationVariants(fadeInUp)}
              className="flex flex-col items-center justify-center gap-2 px-4 py-4 bg-rta-card-bg border border-rta-border rounded-lg text-center"
            >
              <ProductLogo name={item.name} logo={item.logo} size={40} className="flex-shrink-0" />
              <span className="text-body-sm font-medium text-rta-text">{item.name}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <div className="flex gap-4 items-start">
            <div className="w-[6px] flex-shrink-0 h-full min-h-[80px] bg-rta-red rounded-full" aria-hidden="true" />
            <div>
              <p className="text-4xl font-bold text-rta-text mb-1">97%</p>
              <p className="text-body text-rta-text-secondary">Codebases contain</p>
              <p className="text-body font-semibold text-rta-text">Open-Source Software!</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-[6px] flex-shrink-0 h-full min-h-[80px] bg-rta-red rounded-full" aria-hidden="true" />
            <div>
              <p className="text-4xl font-bold text-rta-text mb-1">90%</p>
              <p className="text-body text-rta-text-secondary">Enterprise IT Leaders</p>
              <p className="text-body font-semibold text-rta-text">utilize Open-Source Today!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
