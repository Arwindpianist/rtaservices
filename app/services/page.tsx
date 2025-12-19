'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function ServicesPage() {
  const services = [
    {
      title: 'IT Maintenance Services (TPM)',
      image: '/assets/original/maintenance.jpg',
      alt: 'Asian engineer performing replacement of parts in a data center',
      description: 'Comprehensive maintenance services to keep your enterprise systems running smoothly.',
      features: [
        'Extended warranties for EOL and EOSL enterprise hardware.',
        '24/7 helpdesk support.',
        'Replacement of faulty hardware parts.',
        'L1 to L3 remote/ onsite engineering support.',
        'Customizable Service Level Agreement (SLA).',
      ],
    },
    {
      title: 'IT Assets Management Services',
      image: '/assets/original/logistics.jpg',
      alt: 'Asian logistic lady in a warehouse packing',
      description: 'Complete asset management solutions for ISPs and data centers.',
      features: [
        'Regional warehousing.',
        'Logistics support.',
        'Hardware sparing and management.',
        'Hardware Disposal & Degaussing.',
      ],
    },
    {
      title: 'IT Professional Services',
      image: '/assets/original/engineer.png',
      alt: 'Female Engineer',
      description: 'Expert engineering services for enterprise computing systems.',
      features: [
        'Engineering expertise from L1 to L3 support',
        'Project management services for enterprise computing systems.',
        'IMAC (Install, Move, Add & Change) servers, storage, and networking equipment.',
        'Operating system installation and upgrades.',
      ],
    },
  ];

  return (
    <div className="bg-rta-bg-light py-20 lg:py-[100px]">
      <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <h1 className="text-h1-md md:text-h1 font-bold text-rta-text mb-4">
            Our Services
          </h1>
          <p className="text-body-lg text-rta-text-secondary max-w-3xl mx-auto">
            With expert asset management, extended support, and L1-L3 engineering expertise, RTA Services help businesses optimize performance, reduce downtime, and maintain seamless operations.
          </p>
        </motion.div>

        <motion.div 
          className="space-y-16"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(staggerContainer)}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
              variants={getAnimationVariants(fadeInUp)}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <motion.div 
                  className="relative h-64 md:h-96 rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </div>
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <h2 className="text-h2-md md:text-h2 font-bold text-rta-text mb-4">
                  {service.title}
                </h2>
                <p className="text-body-lg text-rta-text-secondary mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <motion.li 
                      key={idx} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={viewportOptions}
                      transition={{ delay: idx * 0.05, duration: 0.2 }}
                    >
                      <motion.svg
                        className="w-6 h-6 text-[#FFBF23] mr-3 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        whileHover={{ scale: 1.1, rotate: 3 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </motion.svg>
                      <span className="text-body text-rta-text-secondary">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="bg-[#FFBF23] text-white hover:bg-[#E6A91F] hover:shadow-lg hover:shadow-[#FFBF23]/20"
                  style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                >
                  <Link href="/contact?form=quote">
                    Request Quote
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
