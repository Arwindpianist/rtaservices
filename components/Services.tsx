'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function Services() {
  const services = [
    {
      title: 'IT Maintenance Services (TPM)',
      image: '/assets/original/maintenance.jpg',
      alt: 'Asian engineer performing replacement of parts in a data center',
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
      features: [
        'Engineering expertise from L1 to L3 support',
        'Project management services for enterprise computing systems.',
        'IMAC (Install, Move, Add & Change) servers, storage, and networking equipment.',
        'Operating system installation and upgrades.',
      ],
    },
  ];

  return (
    <section className="py-20 lg:py-[100px]" style={{ backgroundColor: '#FFBF23' }}>
      <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <h2 className="text-h2-md md:text-h2 font-bold text-white mb-4">
            What We Offer
          </h2>
          <p className="text-body-lg text-white max-w-3xl mx-auto" style={{ opacity: 0.95 }}>
            With expert asset management, extended support, and L1-L3 engineering expertise, RTA Services help businesses optimize performance, reduce downtime, and maintain seamless operations.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(staggerContainer)}
        >
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              className="space-y-4"
              variants={getAnimationVariants(fadeInUp)}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-h3 font-bold text-white mb-4">
                  {service.title}
                </h3>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <motion.svg
                        className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0"
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
                      <span className="text-body text-white" style={{ opacity: 0.95 }}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
