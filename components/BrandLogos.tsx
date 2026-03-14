'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ProductLogo from '@/components/ProductLogo';
import { TPM_PRODUCT_LOGO } from '@/lib/data/product-range-logos';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function BrandLogos() {
  const brands = TPM_PRODUCT_LOGO;

  return (
    <section className="relative py-16 lg:py-24 bg-rta-blue overflow-hidden">
      {/* White tint overlay */}
      <div className="absolute inset-0 bg-white/10 z-0" aria-hidden="true" />
      <div className="relative z-10 mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <h2 className="text-h2-md md:text-h2 font-bold text-white mb-2">
            RTA <span className="text-rta-gold">TPM</span> Product Range
          </h2>
          <p className="text-body-lg font-semibold text-white/90 uppercase tracking-wider mb-4">
            Server, Storage & Network
          </p>
          <Separator className="w-24 mx-auto my-6 bg-white/30" />
          <p className="text-body-lg text-white max-w-3xl mx-auto" style={{ opacity: 0.95 }}>
            RTA Services supports all major brands in the IT space, offering comprehensive solutions for a wide range of enterprise hardware, including servers, storage systems, and networking equipment.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(staggerContainer)}
        >
          {brands.map((brand) => (
            <motion.div
              key={brand.name}
              className="group flex items-center justify-center aspect-square min-h-[140px] rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/25 hover:border-rta-gold hover:shadow-lg hover:shadow-rta-gold/20"
              variants={getAnimationVariants(fadeInUp)}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <ProductLogo
                  name={brand.name}
                  logo={brand.logo}
                  size={160}
                  grayscale
                  className="max-h-24 max-w-full w-auto object-contain"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <Button
            asChild
            className="bg-rta-gold-cta text-white hover:bg-rta-gold-cta-hover hover:shadow-lg"
            style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
          >
            <Link href="/contact">
              Get Started
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
