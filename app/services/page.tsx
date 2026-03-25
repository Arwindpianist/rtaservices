'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Wrench, Code2, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function ServicesPage() {
  const services = [
    {
      title: 'RTA TPM',
      subtitle: 'Extend Hardware Lifespan',
      icon: Wrench,
      image: '/images/services/service-tpm-cover.jpg',
      alt: 'Enterprise data center and server infrastructure - third-party hardware maintenance and support - RTA Services',
      accentBorder: 'rta-red',
      description: 'Cost-effective alternative to OEM maintenance. Master service levels without premium renewals cost.',
      features: [
        '24/7 Global helpdesk',
        'Response time under Enterprise SLA',
        'Multi-vendor expertise',
        'Extended warranty support',
        'Hardware sparing',
      ],
    },
    {
      title: 'RTA OSS',
      subtitle: 'Open-Source Software under SLA',
      icon: Code2,
      image: '/images/services/service-oss-cover.jpg',
      alt: 'Open-source software development and enterprise OSS support - RTA Services',
      accentBorder: 'rta-blue',
      description: 'Enterprise-grade reliability with guaranteed SLAs, ensuring your critical OSS stacks never sleep.',
      features: [
        '24/7/365 Global Technical Support',
        'Guaranteed SLAs – Tiering model',
        'Access to Senior Enterprise Architects',
        'End-to-End Stack Coverage',
        'Extended Long-Term Support (LTS)',
      ],
    },
    {
      title: 'RTA PS',
      subtitle: 'Strategic Consulting & Make IT Happen',
      icon: Users,
      image: '/images/services/service-ps-cover.jpg',
      alt: 'IT professional services and strategic consulting - enterprise infrastructure - RTA Services',
      accentBorder: 'rta-blue',
      description: 'RTA Professional Services – Delivering End-to-End IT Excellence. Comprehensive infrastructure solutions tailored for enterprise scale and reliability.',
      features: [
        'Engineering expertise from L1 to L3 support levels',
        'Project management services for complex enterprises computing systems',
        'IMAC services (Install, Move, Add & Change) for servers, storage and networking',
        'Operating system installation configuration and upgrades',
        'IT Assets Disposition (ITAD) with secure data erasure and compliance',
      ],
    },
  ];

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <h1 className="text-h1-md md:text-h1 font-bold text-rta-blue mb-4">
            Our Services
          </h1>
          <Separator className="w-24 mx-auto my-6 bg-rta-red" />
          <p className="text-body-lg text-rta-text-secondary max-w-3xl mx-auto">
            Enterprise SLA Grade Maintenance Services & Support Partner. We empower organizations to maintain, migrate and scale, cost effectively.
          </p>
        </motion.div>

        <motion.div 
          className="space-y-12"
          initial="hidden"
          animate="visible"
          viewport={viewportOptions}
          variants={{
            hidden: { opacity: 1 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.05 }
            }
          }}
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const sectionId = index === 0 ? 'maintenance' : index === 1 ? 'oss' : 'professional';
            const detailHref = index === 0 ? '/services/tpm' : index === 1 ? '/services/oss' : '/services/ps';
            return (
              <motion.div
                key={index}
                id={sectionId}
                variants={getAnimationVariants(fadeInUp)}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`overflow-hidden border-rta-border hover:shadow-lg transition-all duration-300 ${
                  service.accentBorder === 'rta-red' ? 'border-l-[6px] border-l-rta-red' : 'border-l-[6px] border-l-rta-blue'
                } bg-rta-card-bg`}>
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}>
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      <motion.div 
                        className="relative h-64 md:h-96 w-full"
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
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-3 bg-rta-gold/10 rounded-lg">
                            <IconComponent className="w-6 h-6 text-rta-gold" aria-hidden="true" />
                          </div>
                        </div>
                        <CardTitle className="text-2xl mb-2">
                          <span className="text-rta-blue">{service.title.split(' ')[0]} </span>
                          <span className="text-rta-gold">{service.title.split(' ').slice(1).join(' ')}</span>
                        </CardTitle>
                        <p className="text-body font-semibold text-rta-text mb-2">{service.subtitle}</p>
                        <p className="text-body-lg text-rta-text-secondary leading-relaxed">
                          {service.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <Separator className="my-4" />
                        <ul className="space-y-3">
                          {service.features.map((feature, idx) => (
                            <motion.li 
                              key={idx} 
                              className="flex items-start gap-3"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={viewportOptions}
                              transition={{ delay: idx * 0.05, duration: 0.2 }}
                            >
                              <CheckCircle2 className="w-5 h-5 text-rta-gold mt-0.5 flex-shrink-0" aria-hidden="true" />
                              <span className="text-body text-rta-text-secondary leading-relaxed">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="flex flex-col sm:flex-row gap-3">
                        <Button
                          asChild
                          className="flex-1 bg-rta-gold-cta text-white hover:bg-rta-gold-cta-hover hover:shadow-lg"
                          size="lg"
                        >
                          <Link href={detailHref}>
                            Learn More
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="flex-1 border-rta-blue text-rta-blue hover:bg-rta-blue hover:text-white"
                          size="lg"
                        >
                          <Link href={`${detailHref}#request-quote`}>
                            Request Quote
                          </Link>
                        </Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
