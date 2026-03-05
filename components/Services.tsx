'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Wrench, Code2, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function Services() {
  const services = [
    {
      title: 'RTA TPM',
      subtitle: 'Extend Hardware Lifespan',
      icon: Wrench,
      image: '/assets/original/maintenance.jpg',
      alt: 'Certified IT engineer performing third-party hardware and software maintenance in enterprise data center - RTA Services',
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
      image: '/assets/original/logistics.jpg',
      alt: 'Open source software support and enterprise OSS stacks - RTA Services',
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
      image: '/assets/original/engineer.png',
      alt: 'Certified L3 IT engineer providing professional services for enterprise computing systems - RTA Services',
      accentBorder: 'rta-blue',
      description: 'Dedicated to maintaining, upgrading, and migrating your Hardware stack and your open-source infrastructure with expert support.',
      features: [
        'Architecture Auditing & consulting',
        'IMAC services',
        'L1 to L3 engineering expertise',
        'IT asset reselling / disposition',
        'Global logistics & Warehousing capabilities',
      ],
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <h2 className="text-h2-md md:text-h2 font-bold text-rta-blue mb-4">
            Enterprise SLA Grade Maintenance Services & Support Partner
          </h2>
          <Separator className="w-24 mx-auto my-6 bg-rta-red" />
          <p className="text-body-lg text-rta-text-secondary max-w-3xl mx-auto">
            We empower organizations to maintain, migrate and scale, cost effectively.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(staggerContainer)}
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={index}
                variants={getAnimationVariants(fadeInUp)}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`group h-full transition-all duration-300 hover:shadow-lg border-rta-border bg-rta-card-bg ${
                  service.accentBorder === 'rta-red' ? 'border-l-[6px] border-l-rta-red' : 'border-l-[6px] border-l-rta-blue'
                }`}>
                  <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                    <Image
                      src={service.image}
                      alt={service.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-3 bg-rta-gold/10 rounded-lg group-hover:bg-rta-gold/20 transition-colors">
                        <IconComponent className="w-6 h-6 text-rta-gold" aria-hidden="true" />
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-1">
                      <span className="text-rta-blue">{service.title.split(' ')[0]} </span>
                      <span className="text-rta-gold">{service.title.split(' ').slice(1).join(' ')}</span>
                    </CardTitle>
                    <p className="text-body-sm font-semibold text-rta-text mb-3">{service.subtitle}</p>
                    <p className="text-body-sm text-rta-text-secondary mb-3">{service.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2.5">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-rta-gold mt-0.5 flex-shrink-0" aria-hidden="true" />
                          <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button
                      asChild
                      className="w-full bg-rta-gold-cta text-white hover:bg-rta-gold-cta-hover hover:shadow-lg"
                      size="lg"
                    >
                      <Link href="/contact?form=quote">
                        Get Quote
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
