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

export default function Services() {
  const services = [
    {
      title: 'IT Maintenance Services (TPM)',
      icon: Wrench,
      image: '/assets/original/maintenance.jpg',
      alt: 'Certified IT engineer performing hardware maintenance and parts replacement in enterprise data center - RTA Services',
      badges: ['24/7 Support', 'EOL/EOSL'],
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
      badges: ['Regional', 'Logistics'],
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
      badges: ['L1-L3', 'IMAC'],
      features: [
        'Engineering expertise from L1 to L3 support',
        'Project management services for enterprise computing systems.',
        'IMAC (Install, Move, Add & Change) servers, storage, and networking equipment.',
        'Operating system installation and upgrades.',
      ],
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-rta-bg-light">
      <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <h2 className="text-h2-md md:text-h2 font-bold text-rta-text mb-4">
            Comprehensive IT Services for Enterprise Infrastructure
          </h2>
          <Separator className="w-24 mx-auto my-6" />
          <p className="text-body-lg text-rta-text-secondary max-w-3xl mx-auto">
            From hardware maintenance to complete asset lifecycle management, 
            we provide end-to-end solutions that keep your critical systems 
            running 24/7 while reducing total cost of ownership.
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
                <Card className="group h-full transition-all duration-300 hover:shadow-lg border-rta-border">
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
                      <div className="p-3 bg-[#FFBF23]/10 rounded-lg group-hover:bg-[#FFBF23]/20 transition-colors">
                        <IconComponent className="w-6 h-6 text-[#FFBF23]" aria-hidden="true" />
                      </div>
                      <Badge variant="secondary" className="text-xs">Enterprise</Badge>
                    </div>
                    <CardTitle className="text-xl mb-3">{service.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      {service.badges.map((badge, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2.5">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#FFBF23] mt-0.5 flex-shrink-0" aria-hidden="true" />
                          <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button
                      asChild
                      className="w-full bg-[#FFBF23] text-white hover:bg-[#E6A91F] hover:shadow-lg"
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
