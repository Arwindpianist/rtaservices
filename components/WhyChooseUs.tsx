'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Settings, Zap, CheckCircle2 } from 'lucide-react';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function WhyChooseUs() {
  const benefits = [
    {
      title: 'Significant Cost Savings',
      description: 'Reduce IT maintenance costs by 30-40% compared to OEM contracts while maintaining or improving service levels. Our flexible pricing models adapt to your business needs.',
      proofPoints: [
        'Average 35% cost reduction vs. OEM',
        'Customizable SLA options',
        'No long-term contract lock-ins',
      ],
      icon: DollarSign,
      metric: 'Up to 40%',
      metricLabel: 'Cost Reduction',
    },
    {
      title: 'Multi-Vendor Expertise',
      description: 'Single point of contact for Dell EMC, IBM, HPE, Cisco, NetApp, and 20+ other enterprise brands. Eliminate vendor management complexity and reduce procurement overhead.',
      proofPoints: [
        '20+ OEM brands supported',
        'Unified support portal',
        'Consolidated billing and reporting',
      ],
      icon: Settings,
      metric: '20+',
      metricLabel: 'OEM Brands',
    },
    {
      title: 'Guaranteed Uptime & Rapid Response',
      description: '99.9% uptime SLA with 24/7 global helpdesk, on-site support in major Asia-Pacific cities, and average 4-hour response time for critical incidents.',
      proofPoints: [
        '99.9% uptime guarantee',
        '4-hour average response time',
        'Regional spare parts inventory',
      ],
      icon: Zap,
      metric: '99.9%',
      metricLabel: 'Uptime SLA',
    },
  ];

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <h2 className="text-h2-md md:text-h2 font-bold text-rta-text mb-4">
            Why Leading Enterprises Choose RTA Services
          </h2>
          <Separator className="w-24 mx-auto my-6" />
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(staggerContainer)}
        >
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={index}
                variants={getAnimationVariants(fadeInUp)}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full border-2 hover:border-[#FFBF23]/50 transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 bg-gradient-to-br from-[#FFBF23]/10 to-[#FFBF23]/5 rounded-xl">
                        <IconComponent className="w-8 h-8 text-[#FFBF23]" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{benefit.title}</CardTitle>
                        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                          {benefit.metric} {benefit.metricLabel}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{benefit.description}</p>
                    <Separator className="my-4" />
                    <div className="space-y-2.5">
                      {benefit.proofPoints.map((point, idx) => (
                        <div key={idx} className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#FFBF23] flex-shrink-0" aria-hidden="true" />
                          <span className="text-sm">{point}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Image Section */}
        <motion.div 
          className="mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-md">
            <Image
              src="/assets/original/why-rta.jpg"
              alt="Enterprise IT infrastructure supported by RTA Services - multi-vendor hardware maintenance and asset management"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
