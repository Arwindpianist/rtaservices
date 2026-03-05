'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Youtube, Facebook, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubscribed(true);
    setEmail('');
    setIsSubscribing(false);
    
    setTimeout(() => setSubscribed(false), 5000);
  };

  const socialLinks = [
    { href: 'https://www.linkedin.com/company/rta-services', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://www.youtube.com/@rtaservices', icon: Youtube, label: 'YouTube' },
    { href: 'https://www.facebook.com/rtaservices', icon: Facebook, label: 'Facebook' },
  ];

  return (
    <footer className="bg-rta-footer text-rta-text-light border-t-2 border-rta-red">
      <div className="mx-auto py-12" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-body-sm">
              <p>20 UPPER CIRCULAR ROAD #03-01/05</p>
              <p>THE RIVERWALK</p>
              <p>SINGAPORE (058416)</p>
              <p className="mt-4">
                <span className="font-semibold">Sales:</span>{' '}
                <a href="mailto:sales@rtaservices.net" className="hover:text-white transition-colors">
                  sales@rtaservices.net
                </a>
              </p>
              <p>
                <span className="font-semibold">General Inquiries:</span>{' '}
                <a href="tel:+6596444147" className="hover:text-white transition-colors">
                  +65 9644 4147
                </a>
              </p>
              <p>
                <span className="font-semibold">Customer Care:</span>{' '}
                <a href="mailto:support@rtaservices.net" className="hover:text-white transition-colors">
                  support@rtaservices.net
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-body-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Follow</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Sign up to get the latest news on our product.
            </h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email*"
                required
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-rta-red"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="newsletter-consent"
                  required
                  className="w-4 h-4"
                />
                <Label htmlFor="newsletter-consent" className="text-body-sm cursor-pointer text-rta-text-light">
                  Yes, subscribe me to your newsletter.*
                </Label>
              </div>
              <AnimatePresence mode="wait">
                {subscribed ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center gap-2 p-2 bg-green-500/20 border border-green-500/50 rounded-md"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-body-sm font-medium">Subscribed!</span>
                  </motion.div>
                ) : (
                  <Button
                    key="button"
                    type="submit"
                    disabled={isSubscribing}
                    className="bg-rta-gold-cta text-white w-full hover:bg-rta-gold-cta-hover hover:shadow-lg"
                    style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                  >
                    {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-body-sm">
          <p className="mb-2">© 2024 by RTA Services.</p>
          <p className="text-rta-text-light">
            Regional Presence: Indonesia · Malaysia · Singapore · Thailand
          </p>
        </div>
      </div>
    </footer>
  );
}
