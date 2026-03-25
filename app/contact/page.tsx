'use client';

import { use, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ContactForm from '@/components/ContactForm';
import QuoteForm from '@/components/QuoteForm';
import { fadeInUp, slideInFromLeft, slideInFromRight, getAnimationVariants, viewportOptions } from '@/lib/animations';

function FormSection() {
  const searchParams = useSearchParams();
  const formType = searchParams.get('form');

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOptions}
      variants={getAnimationVariants(slideInFromRight)}
    >
      <h2 className="text-h2-md md:text-h2 font-bold text-rta-text">
        {formType === 'quote' ? 'Request a Quote' : 'Send us a Message'}
      </h2>
      {formType === 'quote' ? <QuoteForm /> : <ContactForm />}
    </motion.div>
  );
}

export default function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  use(searchParams ?? Promise.resolve({}));

  return (
    <div className="bg-rta-bg-light py-20 lg:py-[100px]">
      <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <h1 className="text-h1-md md:text-h1 font-bold text-rta-text mb-4">
            Contact Us
          </h1>
          <p className="text-body-lg text-rta-text-secondary max-w-2xl mx-auto">
            Get in touch with us for inquiries, support, or to request a quote for our services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(slideInFromLeft)}
          >
            <h2 className="text-h2-md md:text-h2 font-bold text-rta-text mb-6">
              Get in Touch
            </h2>
            <div className="space-y-6">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewportOptions}
                variants={getAnimationVariants(fadeInUp)}
              >
                <h3 className="text-h3 font-semibold text-rta-text mb-2">
                  Address
                </h3>
                <p className="text-body text-rta-text-secondary">
                  20 UPPER CIRCULAR ROAD #03-01/05<br />
                  THE RIVERWALK<br />
                  SINGAPORE (058416)
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewportOptions}
                variants={getAnimationVariants(fadeInUp)}
              >
                <h3 className="text-h3 font-semibold text-rta-text mb-2">
                  Sales
                </h3>
                <motion.a
                  href="mailto:sales@rtaservices.net"
                  className="text-rta-gold hover:text-rta-gold-hover transition-colors"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  sales@rtaservices.net
                </motion.a>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewportOptions}
                variants={getAnimationVariants(fadeInUp)}
              >
                <h3 className="text-h3 font-semibold text-rta-text mb-2">
                  General Inquiries
                </h3>
                <motion.a
                  href="tel:+6596444147"
                  className="text-rta-gold hover:text-rta-gold-hover transition-colors"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  +65 9644 4147
                </motion.a>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewportOptions}
                variants={getAnimationVariants(fadeInUp)}
              >
                <h3 className="text-h3 font-semibold text-rta-text mb-2">
                  Customer Care
                </h3>
                <motion.a
                  href="mailto:support@rtaservices.net"
                  className="text-rta-gold hover:text-rta-gold-hover transition-colors"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  support@rtaservices.net
                </motion.a>
              </motion.div>
            </div>
          </motion.div>

          {/* Form */}
          <Suspense fallback={
            <div className="space-y-6">
              <h2 className="text-h2-md md:text-h2 font-bold text-rta-text">Send us a Message</h2>
              <ContactForm />
            </div>
          }>
            <FormSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
