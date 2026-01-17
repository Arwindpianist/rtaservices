'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wrench, Package, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function ServicesPage() {
  const services = [
    {
      title: 'IT Maintenance Services (TPM)',
      icon: Wrench,
      image: '/assets/original/maintenance.jpg',
      alt: 'Certified IT engineer performing hardware maintenance and parts replacement in enterprise data center - RTA Services',
      description: 'Comprehensive maintenance services to keep your enterprise systems running smoothly.',
      badges: ['24/7 Support', 'EOL/EOSL', 'L1-L3'],
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
      icon: Package,
      image: '/assets/original/logistics.jpg',
      alt: 'Professional logistics specialist managing IT asset inventory in regional warehouse - RTA Services',
      description: 'Complete asset management solutions for ISPs and data centers.',
      badges: ['Regional', 'Logistics', 'Warehousing'],
      features: [
        'Regional warehousing.',
        'Logistics support.',
        'Hardware sparing and management.',
        'Hardware Disposal & Degaussing.',
      ],
    },
    {
      title: 'IT Professional Services',
      icon: Users,
      image: '/assets/original/engineer.png',
      alt: 'Certified L3 IT engineer providing professional services for enterprise computing systems - RTA Services',
      description: 'Expert engineering services for enterprise computing systems.',
      badges: ['L1-L3', 'IMAC', 'Project Management'],
      features: [
        'Engineering expertise from L1 to L3 support',
        'Project management services for enterprise computing systems.',
        'IMAC (Install, Move, Add & Change) servers, storage, and networking equipment.',
        'Operating system installation and upgrades.',
      ],
    },
  ];

  return (
    <div className="bg-rta-bg-light py-16 lg:py-24">
      <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <h1 className="text-h1-md md:text-h1 font-bold text-rta-text mb-4">
            Our Services
          </h1>
          <Separator className="w-24 mx-auto my-6" />
          <p className="text-body-lg text-rta-text-secondary max-w-3xl mx-auto">
            With expert asset management, extended support, and L1-L3 engineering expertise, RTA Services help businesses optimize performance, reduce downtime, and maintain seamless operations.
          </p>
        </motion.div>

        <motion.div 
          className="space-y-12"
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
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`overflow-hidden border-rta-border hover:shadow-lg transition-all duration-300 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}>
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
                          <div className="p-3 bg-[#FFBF23]/10 rounded-lg">
                            <IconComponent className="w-6 h-6 text-[#FFBF23]" aria-hidden="true" />
                          </div>
                          <Badge variant="secondary">Enterprise</Badge>
                        </div>
                        <CardTitle className="text-2xl mb-3">{service.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {service.badges.map((badge, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
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
                              <CheckCircle2 className="w-5 h-5 text-[#FFBF23] mt-0.5 flex-shrink-0" aria-hidden="true" />
                              <span className="text-body text-rta-text-secondary leading-relaxed">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          asChild
                          className="w-full bg-[#FFBF23] text-white hover:bg-[#E6A91F] hover:shadow-lg"
                          size="lg"
                        >
                          <Link href="/contact?form=quote">
                            Request Quote
                            <ArrowRight className="w-4 h-4 ml-2" />
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
