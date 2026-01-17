'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
              Enterprise IT Support That Reduces Costs by Up to 40%
            </h1>
            <p className="text-body-lg md:text-xl text-rta-text-secondary mb-8 leading-relaxed">
              Multi-vendor IT maintenance, asset management, and professional services 
              for enterprise systems across Asia-Pacific. 24/7 support with guaranteed 
              uptime SLAs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              className="bg-[#FFBF23] text-white hover:bg-[#E6A91F] hover:shadow-lg hover:shadow-[#FFBF23]/20 px-8 py-4 text-base font-semibold"
              style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
              aria-label="Request free consultation for enterprise IT services"
            >
              <Link href="/contact?form=quote">
                Request Free Consultation
              </Link>
            </Button>
              <Button
                asChild
                variant="outline"
                className="bg-white text-[#FFBF23] border-2 border-[#FFBF23] hover:bg-[#FFBF23]/10 px-8 py-4 text-base font-semibold"
              >
                <Link href="/services">
                  Learn More
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div 
            className="relative h-64 md:h-96 lg:h-[500px] rounded-lg overflow-hidden"
            variants={getAnimationVariants(fadeInUp)}
          >
            <Image
              src="/assets/original/hero-engineer.jpg"
              alt="Certified IT engineer performing enterprise hardware maintenance in data center - RTA Services"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(staggerContainer)}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="text-center space-y-3 p-6 rounded-lg bg-white/50 backdrop-blur-sm border border-rta-border/50 hover:bg-white/70 transition-colors"
              variants={getAnimationVariants(fadeInUp)}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl font-bold text-[#FFBF23]">{feature.title}</div>
              <div className="text-xl font-semibold text-rta-text">{feature.subtitle}</div>
              {index === 0 && (
                <Badge className="bg-green-100 text-green-800 border-green-200 mt-2">
                  Up to 40%
                </Badge>
              )}
              {index === 1 && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 mt-2">
                  20+ Brands
                </Badge>
              )}
              {index === 2 && (
                <Badge className="bg-purple-100 text-purple-800 border-purple-200 mt-2">
                  99.9% SLA
                </Badge>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
