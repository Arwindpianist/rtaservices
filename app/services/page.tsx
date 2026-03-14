'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Wrench, Code2, Users, CheckCircle2, ArrowRight, Headphones, Package, Server } from 'lucide-react';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function ServicesPage() {
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

  const tpmTiers = [
    { name: 'BASIC', coverage: 'Normal Business Hours Coverage, 9 am - 6 pm, Monday to Friday Excluding public holidays', sla: '9x5', scope: 'Our 24x7 Global Helpdesk assures timely escalation, quick turnaround and effective resolution of incidences.', icon: Headphones },
    { name: 'ENHANCED', coverage: 'Extended hours coverage, 9 am - 6 pm, Monday to Saturday Excluding public holidays', sla: '9x6', scope: 'Efficient spare parts management and logistics aimed at accelerating break-fix processes.', icon: Package },
    { name: 'PREMIUM', coverage: 'Full coverage, 7 days a week 24 hours a day Including public holidays', sla: '24x7', scope: 'Swift, on-site technical support from our team of qualified and certified engineers.', icon: Server },
  ];

  const ossTiers = [
    { tier: 'GOLD', coverage: '24 x 7 Around the clock', response: 'Within 1 hour', submission: 'Chat, Email, Group Chat, Phone', l1: 'By RTA', l2l3: 'Enterprise Architects 20+ years experience' },
    { tier: 'SILVER', coverage: 'Business Hours 8am-6pm local time', response: 'Within 4 hours', submission: 'Chat, Email, Group Chat', l1: 'By RTA', l2l3: 'Senior Engineers 10+ years experience' },
    { tier: 'BRONZE', coverage: 'Business Hours 8am - 6pm local time', response: 'Within 8 hours', submission: 'Email, Portal', l1: 'By RTA', l2l3: 'Engineers 5+ years experience' },
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
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(staggerContainer)}
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const sectionId = index === 0 ? 'maintenance' : index === 1 ? 'oss' : 'professional';
            const ossHref = index === 1 ? '/services/oss' : undefined;
            const quoteService = index === 0 ? 'rta-tpm' : index === 1 ? 'rta-oss' : 'rta-ps';
            const quoteHref = `/contact?form=quote&service=${quoteService}`;
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
                      <CardFooter>
                        <Button
                          asChild
                          className="w-full bg-rta-gold-cta text-white hover:bg-rta-gold-cta-hover hover:shadow-lg"
                          size="lg"
                        >
                          <Link href={ossHref || quoteHref}>
                            {ossHref ? 'Learn More' : 'Request Quote'}
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

        {/* RTA TPM 24x7 Support Level */}
        <motion.section
          className="mt-16 lg:mt-24"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <h2 id="tpm-support" className="text-h2-md md:text-h2 font-bold text-rta-blue mb-2">
            RTA TPM <span className="text-rta-gold">24x7</span> Support Level
          </h2>
          <p className="text-body text-rta-text-secondary mb-8">SLA TYPE: Next Business Day / 4 Hours Onsite Response / 2 Hours Onsite Response</p>
          <div className="space-y-4">
            {tpmTiers.map((tier, idx) => {
              const IconComponent = tier.icon;
              return (
                <Card key={idx} className="overflow-hidden border-rta-border bg-rta-card-bg">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                    <div className="md:col-span-2 bg-rta-tier-grey px-4 py-3 flex items-center">
                      <span className="text-white font-bold text-sm uppercase">{tier.name}</span>
                    </div>
                    <div className="md:col-span-5 bg-rta-tier-light/50 px-4 py-3 flex items-center">
                      <span className="text-body-sm text-rta-text">{tier.coverage}</span>
                    </div>
                    <div className="md:col-span-2 bg-rta-blue px-4 py-3 flex items-center justify-center">
                      <span className="text-white font-bold">{tier.sla}</span>
                    </div>
                    <div className="md:col-span-3 px-4 py-3 flex items-start gap-3">
                      <IconComponent className="w-6 h-6 text-rta-blue flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-body-sm text-rta-text-secondary">{tier.scope}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.section>

        {/* RTA OSS 24x7 Support Level */}
        <motion.section
          className="mt-16 lg:mt-24"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <h2 id="oss-support" className="text-h2-md md:text-h2 font-bold text-rta-blue mb-2">
            RTA OSS <span className="text-rta-gold">24x7</span> Support Level
          </h2>
          <p className="text-body text-rta-text-secondary mb-6">Tier comparison: Coverage, Response Time (Severity 1), Problem Submission, L1 Support, L2/L3 Support</p>
          <div className="overflow-x-auto rounded-lg border border-rta-border">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="bg-rta-blue text-white px-4 py-3 text-body-sm font-semibold">Tier</th>
                  <th className="bg-rta-gold text-white px-4 py-3 text-body-sm font-semibold">GOLD</th>
                  <th className="bg-rta-tier-grey text-white px-4 py-3 text-body-sm font-semibold">SILVER</th>
                  <th className="bg-amber-700 text-white px-4 py-3 text-body-sm font-semibold">BRONZE</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-rta-border">
                  <td className="px-4 py-3 bg-rta-bg-light font-medium text-body-sm">Coverage</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[0].coverage}</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[1].coverage}</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[2].coverage}</td>
                </tr>
                <tr className="border-b border-rta-border">
                  <td className="px-4 py-3 bg-rta-bg-light font-medium text-body-sm">Response Time (Severity 1)</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[0].response}</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[1].response}</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[2].response}</td>
                </tr>
                <tr className="border-b border-rta-border">
                  <td className="px-4 py-3 bg-rta-bg-light font-medium text-body-sm">Problem Submission</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[0].submission}</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[1].submission}</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[2].submission}</td>
                </tr>
                <tr className="border-b border-rta-border">
                  <td className="px-4 py-3 bg-rta-bg-light font-medium text-body-sm">L1 Support</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[0].l1} <Button size="sm" className="ml-1 bg-rta-blue text-white hover:bg-rta-blue/90 text-xs">RTA TEAM</Button></td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[1].l1} <Button size="sm" className="ml-1 bg-rta-blue text-white hover:bg-rta-blue/90 text-xs">RTA TEAM</Button></td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[2].l1} <Button size="sm" className="ml-1 bg-rta-blue text-white hover:bg-rta-blue/90 text-xs">RTA TEAM</Button></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 bg-rta-bg-light font-medium text-body-sm">L2/L3 Support</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[0].l2l3}</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[1].l2l3}</td>
                  <td className="px-4 py-3 text-body-sm">{ossTiers[2].l2l3}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
