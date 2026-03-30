'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer } from 'vaul';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const pathname = usePathname();

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
    { href: '/contact', label: 'Contact' },
  ];

  const mobileNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  const serviceLinks = [
    { href: '/services', label: 'All Services Overview' },
    { href: '/services/tpm', label: 'Third-Party Maintenance' },
    { href: '/services/oss', label: 'Open Source Software (OSS)' },
    { href: '/services/ps', label: 'Professional Services' },
  ];

  return (
    <motion.nav 
      className="bg-white sticky top-0 z-50 border-b border-transparent"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`absolute inset-0 backdrop-blur-sm bg-white/95 ${isScrolled ? 'border-b border-rta-black' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isScrolled ? 1 : 0,
          boxShadow: isScrolled ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
        }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: 'none' }}
      />
      <div className="relative mx-auto" style={{ maxWidth: '1400px', paddingLeft: '12px', paddingRight: '12px' }}>
        <div className="flex justify-between items-center h-14 py-2">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center pt-1.5">
              <Image
                src="/images/newlogo.png"
                alt="RTA Services - Sustaining your IT assets"
                width={280}
                height={56}
                className="h-10 md:h-12 lg:h-16 w-auto"
                priority
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-8">
            {/* Home */}
            {navLinks
              .filter((l) => l.href === '/')
              .map((link) => (
                <motion.div
                  key={link.href}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className={`text-rta-text hover:text-rta-red px-2 lg:px-3 py-2 text-sm lg:text-body font-medium transition-colors duration-200 relative ${
                      pathname === link.href ? 'text-rta-gold' : ''
                    }`}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <motion.span
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-rta-gold"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-rta-gold"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: pathname === link.href ? 1 : 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </motion.div>
              ))}
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/services"
                  className={`text-rta-text hover:text-rta-gold px-2 lg:px-3 py-2 text-sm lg:text-body font-medium transition-colors duration-200 relative flex items-center gap-1 ${
                    pathname === '/services' ? 'text-rta-gold' : ''
                  }`}
                >
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
                  {pathname === '/services' && (
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-rta-gold"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              </motion.div>
              
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-rta-border py-2 z-50"
                  >
                    {serviceLinks.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="block px-4 py-2 text-body text-rta-text hover:bg-rta-bg-light hover:text-rta-gold transition-colors duration-200"
                      >
                        {service.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* About Us + Contact */}
            {navLinks
              .filter((l) => l.href !== '/')
              .map((link) => (
                <motion.div
                  key={link.href}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className={`text-rta-text hover:text-rta-red px-2 lg:px-3 py-2 text-sm lg:text-body font-medium transition-colors duration-200 relative ${
                      pathname === link.href ? 'text-rta-gold' : ''
                    }`}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <motion.span
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-rta-gold"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-rta-gold"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: pathname === link.href ? 1 : 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </motion.div>
              ))}
            <Button
              asChild
              className="bg-rta-gold-cta text-white hover:bg-rta-gold-cta-hover hover:shadow-lg md:px-3 md:text-sm lg:px-4 lg:text-base"
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
                  className="inline-flex items-center justify-center rounded-md p-2 text-rta-text hover:text-rta-gold hover:bg-gray-100 transition-colors"
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
                          className="text-rta-text hover:text-rta-gold h-9 w-9"
                          aria-label="Close menu"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </Drawer.Close>
                    </div>

                    {/* Navigation links - compact spacing */}
                    <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
                      {mobileNavLinks.map((link, index) => (
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
                              className="block px-3 py-2.5 text-base font-medium text-rta-text hover:text-rta-gold hover:bg-rta-bg-light rounded-lg transition-all duration-200"
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
                            className="bg-rta-gold-cta text-white w-full hover:bg-rta-gold-cta-hover hover:shadow-lg h-11"
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
