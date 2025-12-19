'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function Hero() {
  const features = [
    { title: 'Significant', subtitle: 'Cost Saving' },
    { title: 'Multi Vendor', subtitle: 'Support' },
    { title: 'Guaranteed', subtitle: 'Uptime' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-rta-bg-blue to-white py-20 lg:py-[100px]">
      <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(staggerContainer)}
        >
          {/* Content */}
          <motion.div 
            className="text-center lg:text-left"
            variants={getAnimationVariants(fadeInUp)}
          >
            <h1 className="text-hero-sm md:text-hero-md lg:text-hero font-bold text-rta-text mb-6">
              Discover the Power of Our IT Solutions
            </h1>
            <p className="text-body-lg md:text-xl text-rta-text-secondary mb-8 leading-relaxed">
              RTA Services provide end-to-end IT services for enterprise systems, including installation, upgrades, and OS deployment for servers, storage, and networking equipment, backed by L1 to L3 support for seamless operations. Our asset management services for ISPs and data centers cover warehousing, logistics, and hardware sparing. We also extend warranties for EOL/EOSL hardware, ensuring continued reliability beyond manufacturer guarantees.
            </p>
            <Button
              asChild
              className="bg-[#FFBF23] text-white hover:bg-[#E6A91F] hover:shadow-lg hover:shadow-[#FFBF23]/20"
              style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
            >
              <Link href="/services">
                Learn More
              </Link>
            </Button>
          </motion.div>

          {/* Image */}
          <motion.div 
            className="relative h-64 md:h-96 lg:h-[500px] rounded-lg overflow-hidden"
            variants={getAnimationVariants(fadeInUp)}
          >
            <Image
              src="/assets/original/hero-engineer.jpg"
              alt="Asian IT female engineer in data centers"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(staggerContainer)}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="text-center space-y-2"
              variants={getAnimationVariants(fadeInUp)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl font-bold text-[#FFBF23]">{feature.title}</div>
              <div className="text-xl font-semibold text-rta-text">{feature.subtitle}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
