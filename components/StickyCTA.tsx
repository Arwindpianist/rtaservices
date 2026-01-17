'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Phone, Mail, X } from 'lucide-react';
import Link from 'next/link';

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!isDismissed) {
        setIsVisible(window.scrollY > 300);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-rta-border shadow-lg p-4 md:hidden"
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto">
            <Button
              asChild
              className="flex-1 bg-[#FFBF23] text-white hover:bg-[#E6A91F]"
              size="sm"
            >
              <Link href="tel:+6596444147">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 border-[#FFBF23] text-[#FFBF23] hover:bg-[#FFBF23]/10"
              size="sm"
            >
              <Link href="/contact?form=quote">
                <Mail className="w-4 h-4 mr-2" />
                Get Quote
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setIsDismissed(true)}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
