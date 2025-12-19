'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function AboutPage() {
  return (
    <div className="py-20 lg:py-[100px]">
      <div className="mx-auto" style={{ maxWidth: '1200px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.h1 
          className="text-h1-md md:text-h1 font-bold text-rta-text mb-8 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          About Us
        </motion.h1>

        <div className="max-w-none">
          <motion.div 
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <h2 className="text-h2-md md:text-h2 font-bold text-rta-text mb-6">
              Collaboration with ACA Pacific
            </h2>
            <p className="text-body-lg text-rta-text-secondary leading-relaxed mb-6">
              Collaboration with ACA Pacific provides a solid foundation for RTA Services, empowering it to deliver reliable, specialized IT solutions.
            </p>
            <p className="text-body-lg text-rta-text-secondary leading-relaxed mb-6">
              RTA Services is the preferred services partner for ACA Pacific, an established regional value-added distribution company that has served the Asia-Pacific region for over 30 years. ACA Pacific Technology's forte is selecting and integrating the "Best-of-Breed" software and hardware to meet changing business dynamics.
            </p>
          </motion.div>

          <motion.div 
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <h2 className="text-h2-md md:text-h2 font-bold text-rta-text mb-6">
              Our Mission
            </h2>
            <p className="text-body-lg text-rta-text-secondary leading-relaxed mb-6">
              RTA Services provide end-to-end IT services for enterprise systems, including installation, upgrades, and OS deployment for servers, storage, and networking equipment, backed by L1 to L3 support for seamless operations.
            </p>
            <p className="text-body-lg text-rta-text-secondary leading-relaxed mb-6">
              Our asset management services for ISPs and data centers cover warehousing, logistics, and hardware sparing. We also extend warranties for EOL/EOSL hardware, ensuring continued reliability beyond manufacturer guarantees.
            </p>
          </motion.div>

          <motion.div 
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <h2 className="text-h2-md md:text-h2 font-bold text-rta-text mb-6">
              Why Choose RTA Services?
            </h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOptions}
              variants={getAnimationVariants(staggerContainer)}
            >
              <motion.div 
                className="space-y-3"
                variants={getAnimationVariants(fadeInUp)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-h3 font-bold text-rta-text">
                  Significant Cost Saving
                </h3>
                <p className="text-body text-rta-text-secondary">
                  Our attractive pricing is designed to undercut traditional OEM maintenance contracts, offering significant cost benefits with uncompromised quality.
                </p>
              </motion.div>
              <motion.div 
                className="space-y-3"
                variants={getAnimationVariants(fadeInUp)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-h3 font-bold text-rta-text">
                  Multi Vendor Support
                </h3>
                <p className="text-body text-rta-text-secondary">
                  With our broad coverage across major OEM brands, you can access the support you need through a single vendor.
                </p>
              </motion.div>
              <motion.div 
                className="space-y-3"
                variants={getAnimationVariants(fadeInUp)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-h3 font-bold text-rta-text">
                  Guaranteed Uptime
                </h3>
                <p className="text-body text-rta-text-secondary">
                  Our 24x7 Global Helpdesk ensures timely escalation and resolution of incidents, complemented by efficient spare parts management and swift on-site support.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
