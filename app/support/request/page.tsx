'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import OssSearch from '@/components/OssSearch';
import { fadeInUp, getAnimationVariants, viewportOptions } from '@/lib/animations';
import { ArrowLeft } from 'lucide-react';

export default function SupportRequestPage() {
  return (
    <div className="bg-gradient-to-br from-rta-bg-blue/40 to-white py-16 lg:py-24">
      <div className="mx-auto" style={{ maxWidth: '1100px', paddingLeft: '20px', paddingRight: '20px' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOptions}
          variants={getAnimationVariants(fadeInUp)}
        >
          <Button asChild variant="ghost" size="sm" className="text-rta-text-secondary mb-6 -ml-2">
            <Link href="/support" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to support
            </Link>
          </Button>

          <OssSearch
            heading="Enterprise support for open-source environments"
            description="Describe your OSS stack in plain language. We will detect the technologies and return a clear support posture you can act on."
            variant="page"
          />
        </motion.div>
      </div>
    </div>
  );
}
