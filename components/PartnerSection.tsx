'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Handshake } from 'lucide-react';
import { fadeInUp, slideInFromLeft, slideInFromRight, getAnimationVariants, viewportOptions } from '@/lib/animations';

export default function PartnerSection() {
  return (
    <section className="bg-gradient-to-br from-rta-bg-blue/50 to-white py-16 lg:py-24">
      <div className="mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <Card className="bg-gradient-to-br from-rta-bg-blue/30 to-white border-rta-border shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-rta-gold/10 rounded-lg">
                    <Handshake className="w-6 h-6 text-rta-gold" aria-hidden="true" />
                  </div>
                  <Badge className="bg-rta-gold-cta text-white">30+ Years Experience</Badge>
                </div>
                <CardTitle className="text-2xl mb-4">
                  Trusted Partnership with ACA Pacific
                </CardTitle>
                <CardDescription className="text-base mb-6 leading-relaxed">
                  RTA Services is the preferred services partner for ACA Pacific, an established regional value-added distribution company that has served the Asia-Pacific region for over 30 years. ACA Pacific Technology's forte is selecting and integrating the "Best-of-Breed" software and hardware to meet changing business dynamics.
                </CardDescription>
                <Button variant="outline" asChild>
                  <Link href="/about">
                    Learn About Our Partnership
                  </Link>
                </Button>
              </div>
              <motion.div 
                className="flex items-center justify-center bg-white/50 rounded-lg p-6"
                initial="hidden"
                whileInView="visible"
                viewport={viewportOptions}
                variants={getAnimationVariants(slideInFromRight)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/assets/original/aca-logo.png"
                  alt="ACA Pacific Logo - Trusted Partner"
                  width={300}
                  height={150}
                  className="object-contain"
                />
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
