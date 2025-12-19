'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeInUp, slideInFromLeft, slideInFromRight, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function PartnerSection() {
  return (
    <section className="bg-rta-bg-blue py-20 lg:py-[100px]">
      <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(slideInFromLeft)}
          >
            <h2 className="text-h2-md md:text-h2 font-bold text-rta-text mb-6">
              Collaboration with ACA Pacific provides a solid foundation for RTA Services, empowering it to deliver reliable, specialized IT solutions.
            </h2>
            <p className="text-body-lg text-rta-text-secondary leading-relaxed mb-6">
              RTA Services is the preferred services partner for ACA Pacific, an established regional value-added distribution company that has served the Asia-Pacific region for over 30 years. ACA Pacific Technology's forte is selecting and integrating the "Best-of-Breed" software and hardware to meet changing business dynamics.
            </p>
          </motion.div>
          <motion.div 
            className="flex items-center justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(slideInFromRight)}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src="/assets/original/aca-logo.png"
              alt="ACA Pacific Logo"
              width={300}
              height={150}
              className="object-contain"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
