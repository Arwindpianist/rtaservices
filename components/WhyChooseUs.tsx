'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MagicCard } from '@/components/ui/magic-card';
import { DollarSign, Settings, Zap, CheckCircle2 } from 'lucide-react';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

const regionalPresence = [
  { name: 'Indonesia', code: 'id' },
  { name: 'Malaysia', code: 'my' },
  { name: 'Singapore', code: 'sg' },
  { name: 'Thailand', code: 'th' },
];

export default function WhyChooseUs() {
  const benefits = [
    {
      title: 'Multivendor Support',
      description: 'Broad coverage across major OEM brands, providing streamlined support through a single vendor.',
      icon: Settings,
    },
    {
      title: 'Cost Savings',
      description: 'Attractive pricing designed to undercut traditional OEM maintenance contracts without compromising quality.',
      icon: DollarSign,
    },
    {
      title: 'Guaranteed Uptime',
      description: '24x7 Global Helpdesk, efficient spare parts management, and swift on-site support from qualified engineers.',
      icon: Zap,
    },
    {
      title: 'Regional Heritage',
      description: "Leveraging ACA Pacific's established presence in Asia to provide service built on reliability and trust.",
      icon: CheckCircle2,
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
          <h2 className="text-h2-md md:text-h2 font-bold text-rta-red mb-4">
            Key Value Propositions
          </h2>
          <Separator className="w-24 h-1 mx-auto my-6 bg-rta-red rounded-full" />
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
                <Card className="h-full border-2 hover:border-rta-gold/50 transition-all duration-300 hover:shadow-lg border-l-[6px] border-l-rta-gold">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="p-4 bg-gradient-to-br from-rta-gold/10 to-rta-gold/5 rounded-xl">
                        <IconComponent className="w-8 h-8 text-rta-gold" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-rta-text-secondary leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Regional Presence - MagicCard with muted bg so glow is visible */}
        <motion.div
          className="mt-12 rounded-2xl bg-rta-bg-light p-6 md:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <h3 className="text-h3 font-bold text-rta-text-muted mb-4 text-center">Regional Presence</h3>
          <MagicCard
            mode="gradient"
            gradientFrom="#FFBF23"
            gradientTo="#E0292D"
            gradientColor="#FFBF2366"
            gradientOpacity={0.6}
            gradientSize={280}
            className="w-full max-w-2xl mx-auto p-6 md:p-8"
          >
            <div className="flex flex-wrap gap-6 justify-center items-center">
              {regionalPresence.map((country) => (
                <div
                  key={country.code}
                  className="flex flex-col items-center gap-2"
                >
                  <span className="overflow-hidden rounded-lg shrink-0 ring-2 ring-rta-border/50 shadow-sm">
                    <Image
                      src={`https://flagcdn.com/w80/${country.code}.png`}
                      alt={`${country.name} flag`}
                      width={48}
                      height={36}
                      className="block object-cover w-12 h-9"
                    />
                  </span>
                  <span className="text-body font-medium text-rta-text">{country.name}</span>
                </div>
              ))}
            </div>
          </MagicCard>
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
              src="/images/services/why-rta-cover.jpg"
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
