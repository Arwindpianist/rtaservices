'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer } from 'vaul';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/product', label: 'Product' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <motion.nav 
      className="bg-white sticky top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 backdrop-blur-sm bg-white/95"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isScrolled ? 1 : 0,
          boxShadow: isScrolled ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
        }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: 'none' }}
      />
      <div className="relative mx-auto" style={{ maxWidth: '1400px', paddingLeft: '20px', paddingRight: '20px' }}>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/original/logo.png"
                alt="RTA Services"
                width={120}
                height={38}
                className="h-8 w-auto"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={link.href}
                  className="text-rta-text hover:text-[#FFBF23] px-3 py-2 text-body font-medium transition-colors duration-200 relative"
                >
                  {link.label}
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFBF23]"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </motion.div>
            ))}
            <Button
              asChild
              className="bg-[#FFBF23] text-white hover:bg-[#E6A91F] hover:shadow-lg hover:shadow-[#FFBF23]/20"
              style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
            >
              <Link href="/contact?form=quote">
                Ask for Quote
              </Link>
            </Button>
          </div>

          {/* Mobile menu button with Vaul Drawer */}
          <div className="md:hidden">
            <Drawer.Root 
              direction="bottom" 
              modal={true} 
              shouldScaleBackground={false}
              open={isDrawerOpen}
              onOpenChange={setIsDrawerOpen}
            >
              <Drawer.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md p-2 text-rta-text hover:text-[#FFBF23] hover:bg-gray-100 transition-colors"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Overlay className="bg-black/50 backdrop-blur-sm" />
                <Drawer.Content className="h-[85vh] max-h-[600px] w-full bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col focus:outline-none md:hidden rounded-t-2xl">
                  <div className="flex flex-col h-full">
                    {/* Drag Handle */}
                    <Drawer.Handle className="mx-auto mt-2 mb-1" />
                    
                    {/* Header with close button */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-rta-border">
                      <Drawer.Title className="text-base font-bold text-rta-text">Menu</Drawer.Title>
                      <Drawer.Close asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-rta-text hover:text-[#FFBF23] h-9 w-9"
                          aria-label="Close menu"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </Drawer.Close>
                    </div>

                    {/* Navigation links - compact spacing */}
                    <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
                      {navLinks.map((link, index) => (
                        <motion.div
                          key={link.href}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ 
                            delay: index * 0.03, 
                            duration: 0.2,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                        >
                          <Drawer.Close asChild>
                            <Link
                              href={link.href}
                              className="block px-3 py-2.5 text-base font-medium text-rta-text hover:text-[#FFBF23] hover:bg-rta-bg-light rounded-lg transition-all duration-200"
                            >
                              {link.label}
                            </Link>
                          </Drawer.Close>
                        </motion.div>
                      ))}
                    </nav>

                    {/* CTA Button - positioned at bottom for easy thumb reach */}
                    <div className="px-4 pt-2 pb-4 border-t border-rta-border bg-white/95">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ 
                          delay: navLinks.length * 0.03, 
                          duration: 0.2 
                        }}
                      >
                        <Drawer.Close asChild>
                          <Button
                            asChild
                            className="bg-[#FFBF23] text-white w-full hover:bg-[#E6A91F] hover:shadow-lg hover:shadow-[#FFBF23]/20 h-11"
                            style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                          >
                            <Link href="/contact?form=quote">
                              Ask for Quote
                            </Link>
                          </Button>
                        </Drawer.Close>
                      </motion.div>
                    </div>
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
