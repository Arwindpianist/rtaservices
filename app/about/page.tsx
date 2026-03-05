'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Handshake, Target, Star } from 'lucide-react';
import { fadeInUp, staggerContainer, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function AboutPage() {
  return (
    <div className="py-16 lg:py-24 bg-rta-bg-light">
      <div className="mx-auto" style={{ maxWidth: '1200px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.h1 
          className="text-h1-md md:text-h1 font-bold text-rta-blue mb-8 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          About Us
        </motion.h1>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <Tabs defaultValue="partnership" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="partnership" className="flex items-center gap-2">
                <Handshake className="w-4 h-4" />
                Partnership
              </TabsTrigger>
              <TabsTrigger value="mission" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Mission
              </TabsTrigger>
              <TabsTrigger value="values" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Values
              </TabsTrigger>
            </TabsList>

            <TabsContent value="partnership">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-rta-gold/10 rounded-lg">
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
                    RTA Services is the preferred services partner for ACA Pacific, an established regional value-added distribution company that has served the Asia-Pacific region for over 30 years. ACA Pacific Technology's forte is selecting and integrating the "Best-of-Breed" software and hardware to meet changing business dynamics.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mission">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-rta-gold/10 rounded-lg">
                      <Target className="w-6 h-6 text-rta-gold" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-2xl text-rta-blue">Our Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-body-lg text-rta-text-secondary leading-relaxed">
                    RTA Services deliver three branches of support: third-party hardware and software maintenance, open source software (OSS) support, and professional services—including installation, upgrades, and OS deployment for servers, storage, and networking, backed by L1 to L3 support.
                  </p>
                  <Separator />
                  <p className="text-body-lg text-rta-text-secondary leading-relaxed">
                    We extend warranties for EOL/EOSL hardware and offer warehousing, logistics, and sparing where needed, ensuring continued reliability beyond manufacturer guarantees.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="values">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-rta-gold/10 rounded-lg">
                      <Star className="w-6 h-6 text-rta-gold" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-2xl text-rta-blue">Why Choose RTA Services?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
                      <h3 className="text-h3 font-bold text-rta-blue">
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
                      <h3 className="text-h3 font-bold text-rta-blue">
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
                      <h3 className="text-h3 font-bold text-rta-blue">
                        Guaranteed Uptime
                      </h3>
                      <p className="text-body text-rta-text-secondary">
                        Our 24x7 Global Helpdesk ensures timely escalation and resolution of incidents, complemented by efficient spare parts management and swift on-site support.
                      </p>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.section
          className="mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <h2 className="text-h2-md font-bold text-rta-blue mb-4">Our Value Proposition</h2>
          <p className="text-body text-rta-text-secondary mb-4">
            RTA Services extends hardware and OSS lifespan with hybrid support across the EoL threshold. Strategic enablers include:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-body text-rta-text-secondary list-disc list-inside">
            <li>24/7 Call Center</li>
            <li>Enterprise Grade SLA</li>
            <li>Access to L1–L3 Expertise</li>
            <li>Architecture Consulting</li>
            <li>IMAC Services</li>
            <li>Global/Local Logistics & Warehousing</li>
            <li>IT Asset Disposition</li>
          </ul>
        </motion.section>
      </div>
    </div>
  );
}
