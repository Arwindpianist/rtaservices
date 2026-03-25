'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Handshake, Target, Star, DollarSign, Layers, Zap, ChevronRight } from 'lucide-react';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

const TAB_IMAGES: Record<string, string> = {
  partnership: '/images/about/about-hero.jpg',
  mission: '/images/about/about-mission.jpg',
  values: '/images/about/about-values.jpg',
};

const VALUE_ITEMS = [
  { icon: DollarSign, title: 'Significant Cost Saving', body: 'Our attractive pricing is designed to undercut traditional OEM maintenance contracts, offering significant cost benefits with uncompromised quality.' },
  { icon: Layers, title: 'Multi Vendor Support', body: 'With our broad coverage across major OEM brands, you can access the support you need through a single vendor.' },
  { icon: Zap, title: 'Guaranteed Uptime', body: 'Our 24x7 Global Helpdesk ensures timely escalation and resolution of incidents, complemented by efficient spare parts management and swift on-site support.' },
];

const PROPOSITION_ITEMS = [
  '24/7 Call Center',
  'Enterprise Grade SLA',
  'Access to L1–L3 Expertise',
  'Architecture Consulting',
  'IMAC Services',
  'Global/Local Logistics & Warehousing',
  'IT Asset Disposition',
];

export default function AboutPage() {
  return (
    <div className="bg-rta-bg-light">
      {/* Hero with image */}
      <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about/about-hero.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-rta-blue/75 z-10" aria-hidden="true" />
        </div>
        <div className="relative z-20 mx-auto max-w-4xl px-5 sm:px-6 text-center">
          <motion.h1
            className="text-h1-md md:text-h1 font-bold text-white mb-3 sm:mb-4 drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            About Us
          </motion.h1>
          <motion.p
            className="text-body-lg md:text-xl text-white/95 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Your strategic IT maintenance partner in Asia, partnered with ACA Pacific to deliver enterprise-grade support and professional services.
          </motion.p>
        </div>
      </section>

      {/* Tabs with images */}
      <section className="py-10 sm:py-14 lg:py-20 bg-white">
        <div className="mx-auto px-5 sm:px-6" style={{ maxWidth: '1200px' }}>
          <Tabs defaultValue="partnership" className="w-full">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOptions}
              variants={getAnimationVariants(fadeInUp)}
            >
              <TabsList className="grid w-full grid-cols-3 mb-8 sm:mb-10 p-1.5 bg-rta-bg-light rounded-xl h-auto gap-1 min-h-[48px]">
                <TabsTrigger
                  value="partnership"
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 sm:py-4 px-2 sm:px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-rta-blue rounded-lg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-rta-blue focus-visible:ring-offset-2"
                >
                  <Handshake className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Partnership</span>
                </TabsTrigger>
                <TabsTrigger
                  value="mission"
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 sm:py-4 px-2 sm:px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-rta-blue rounded-lg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-rta-blue focus-visible:ring-offset-2"
                >
                  <Target className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Mission</span>
                </TabsTrigger>
                <TabsTrigger
                  value="values"
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 sm:py-4 px-2 sm:px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-rta-blue rounded-lg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-rta-blue focus-visible:ring-offset-2"
                >
                  <Star className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Values</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="partnership" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center"
                >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg order-2 lg:order-1">
                      <Image
                        src={TAB_IMAGES.partnership}
                        alt="Partnership and collaboration - RTA Services and ACA Pacific"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                    <Card className="border-rta-border shadow-card order-1 lg:order-2">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-3 bg-rta-gold/10 rounded-xl">
                            <Handshake className="w-6 h-6 text-rta-gold" aria-hidden="true" />
                          </div>
                          <CardTitle className="text-2xl text-rta-blue">Collaboration with ACA Pacific</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-body-lg text-rta-text-secondary leading-relaxed">
                          Collaboration with ACA Pacific provides a solid foundation for RTA Services, empowering it to deliver reliable, specialized IT solutions.
                        </p>
                        <Separator />
                        <p className="text-body-lg text-rta-text-secondary leading-relaxed">
                          RTA Services is the preferred services partner for ACA Pacific, an established regional value-added distribution company that has served the Asia-Pacific region for over 30 years. ACA Pacific Technology&apos;s forte is selecting and integrating the &quot;Best-of-Breed&quot; software and hardware to meet changing business dynamics.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
              </TabsContent>

              <TabsContent value="mission" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center"
                >
                    <Card className="border-rta-border shadow-card">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-3 bg-rta-gold/10 rounded-xl">
                            <Target className="w-6 h-6 text-rta-gold" aria-hidden="true" />
                          </div>
                          <CardTitle className="text-2xl text-rta-blue">Our Mission</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-body-lg text-rta-text-secondary leading-relaxed">
                          RTA Services deliver three branches of support: third-party hardware and software maintenance, open source software (OSS) support, and professional services, including installation, upgrades, and OS deployment for servers, storage, and networking, backed by L1 to L3 support.
                        </p>
                        <Separator />
                        <p className="text-body-lg text-rta-text-secondary leading-relaxed">
                          We extend warranties for EOL/EOSL hardware and offer warehousing, logistics, and sparing where needed, ensuring continued reliability beyond manufacturer guarantees.
                        </p>
                      </CardContent>
                    </Card>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src={TAB_IMAGES.mission}
                        alt="Our mission - enterprise IT support and technical excellence"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </motion.div>
              </TabsContent>

              <TabsContent value="values" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center"
                >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg order-2 lg:order-1">
                      <Image
                        src={TAB_IMAGES.values}
                        alt="Why choose RTA Services - teamwork and values"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                    <div className="order-1 lg:order-2">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-rta-gold/10 rounded-xl">
                          <Star className="w-6 h-6 text-rta-gold" aria-hidden="true" />
                        </div>
                        <h2 className="text-2xl font-bold text-rta-blue">Why Choose RTA Services?</h2>
                      </div>
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-1 gap-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOptions}
                        variants={getAnimationVariants(staggerContainer)}
                      >
                        {VALUE_ITEMS.map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <motion.div
                              key={idx}
                              variants={getAnimationVariants(fadeInUp)}
                              whileHover={{ x: 6 }}
                              transition={{ duration: 0.2 }}
                              className="group flex gap-4 p-4 rounded-xl border border-rta-border bg-white hover:border-rta-blue/40 hover:shadow-md transition-all duration-300 cursor-default"
                            >
                              <div className="p-2.5 bg-rta-gold/10 rounded-lg flex-shrink-0 group-hover:bg-rta-gold/20 transition-colors">
                                <Icon className="w-5 h-5 text-rta-gold" aria-hidden="true" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-h3 font-bold text-rta-blue mb-1">{item.title}</h3>
                                <p className="text-body text-rta-text-secondary">{item.body}</p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-rta-text-secondary flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity self-center" aria-hidden="true" />
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </div>
                  </motion.div>
                </TabsContent>
            </motion.div>
          </Tabs>
        </div>
      </section>

      {/* Value proposition - interactive list */}
      <section className="py-10 sm:py-14 lg:py-20 bg-rta-bg-light">
        <div className="mx-auto px-5 sm:px-6" style={{ maxWidth: '1200px' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
            variants={getAnimationVariants(fadeInUp)}
          >
            <h2 className="text-h2-md font-bold text-rta-blue mb-2">Our Value Proposition</h2>
            <p className="text-body text-rta-text-secondary mb-6 sm:mb-8 max-w-2xl">
              RTA Services extends hardware and OSS lifespan with hybrid support across the EoL threshold. Strategic enablers include:
            </p>
            <motion.ul
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOptions}
              variants={getAnimationVariants(staggerContainer)}
            >
              {PROPOSITION_ITEMS.map((label, idx) => (
                <motion.li
                  key={idx}
                  variants={getAnimationVariants(fadeInUp)}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border border-rta-border hover:border-rta-gold/50 hover:shadow-sm transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rta-gold flex-shrink-0" aria-hidden="true" />
                  <span className="text-body text-rta-text">{label}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
