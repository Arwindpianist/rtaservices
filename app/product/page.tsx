'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function ProductPage() {
  const brands = [
    { name: 'Dell EMC', image: '/assets/original/dell-emc.png' },
    { name: 'IBM', image: '/assets/original/ibm.png' },
    { name: 'HPE', image: '/assets/original/hpe.png' },
    { name: 'Sun Oracle', image: '/assets/original/sun-oracle.png' },
    { name: 'NetApp', image: '/assets/original/netapp.png' },
    { name: 'Cisco', image: '/assets/original/cisco.png' },
    { name: 'Huawei', image: '/assets/original/huawei.png' },
    { name: 'Fujitsu', image: '/assets/original/fujitsu.png' },
  ];

  return (
    <div className="bg-white py-20 lg:py-[100px]">
      <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <h1 className="text-h1-md md:text-h1 font-bold text-rta-blue mb-2">
            RTA <span className="text-rta-gold">TPM</span> Product Range
          </h1>
          <p className="text-body-lg font-semibold text-rta-text-secondary uppercase tracking-wider mb-4">
            Server, Storage & Network
          </p>
          <p className="text-body-lg text-rta-text-secondary max-w-3xl mx-auto mb-8">
            RTA Services supports all major brands in the IT space, offering comprehensive solutions for a wide range of enterprise hardware, including servers, storage systems, and networking equipment.
          </p>
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

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(staggerContainer)}
        >
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center h-32"
              variants={getAnimationVariants(fadeInUp)}
              whileHover={{ y: -4, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={brand.image}
                alt={brand.name}
                width={150}
                height={75}
                className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <h2 className="text-h2-md md:text-h2 font-bold text-rta-blue">
            Unlock the Full Potential of Your IT Infrastructure with RTA's Expert Solutions!
          </h2>
          <p className="text-body-lg text-rta-text-secondary max-w-2xl mx-auto">
            Whether you need maintenance, asset management, or professional services, we have the expertise and partnerships to support all major IT brands.
          </p>
          <Button
            asChild
            className="bg-rta-gold-cta text-white hover:bg-rta-gold-cta-hover hover:shadow-lg"
            style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
          >
            <Link href="/contact?form=quote">
              Request a Quote
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
