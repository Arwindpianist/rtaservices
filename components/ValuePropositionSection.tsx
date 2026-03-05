'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeInUp, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function ValuePropositionSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.h2
          className="text-h2-md md:text-h2 font-bold text-rta-blue text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          RTA Services Overall Value Proposition
        </motion.h2>

        <motion.div
          className="space-y-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <div className="w-full overflow-hidden rounded-xl">
            <Image
              src="/images/value-proposition-graphic.png"
              alt="RTA Services value proposition: Hardware and Software services with Hybrid Support, Extended Hardware, Extended OSS, and End of Life (EoL) support"
              width={1200}
              height={600}
              className="w-full h-auto object-contain"
              priority={false}
            />
          </div>
          <div className="w-full overflow-hidden rounded-xl">
            <Image
              src="/images/strategic-enablers-graphic.png"
              alt="RTA Services strategic enablers: Enterprise Grade Services (24/7 Call Center, Enterprise Grade SLA, L1-L3 Expertise) and Professional Services Capabilities (Architecture Consulting, IMAC Services, Global Logistics & Warehousing, IT Asset Disposition)"
              width={1200}
              height={400}
              className="w-full h-auto object-contain"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
