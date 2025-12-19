'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function WhyChooseUs() {
  const benefits = [
    {
      title: 'Significant Cost Saving',
      description: 'Our attractive pricing is designed to undercut traditional OEM maintenance contracts, offering significant cost benefits with uncompromised quality.',
      icon: '💰',
    },
    {
      title: 'Multi Vendor Support',
      description: 'With our broad coverage across major OEM brands, you can access the support you need through a single vendor.',
      icon: '🔧',
    },
    {
      title: 'Guaranteed Uptime',
      description: 'Our 24x7 Global Helpdesk ensures timely escalation and resolution of incidents, complemented by efficient spare parts management, logistics for rapid break-fix processes, and swift on-site support from our qualified engineers.',
      icon: '⚡',
    },
  ];

  return (
    <section className="bg-white py-20 lg:py-[100px]">
      <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <h2 className="text-h2-md md:text-h2 font-bold text-rta-text mb-4">
            Why Choose RTA Services?
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(staggerContainer)}
        >
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index} 
              className="text-center space-y-4"
              variants={getAnimationVariants(fadeInUp)}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="text-5xl mb-2"
                whileHover={{ scale: 1.1, rotate: 3 }}
                transition={{ duration: 0.2 }}
              >
                {benefit.icon}
              </motion.div>
              <h3 className="text-h3 font-bold text-rta-text">
                {benefit.title}
              </h3>
              <p className="text-body text-rta-text-secondary leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Image Section */}
        <motion.div 
          className="mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
            <Image
              src="/assets/original/why-rta.jpg"
              alt="Why Choose RTA Services"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
