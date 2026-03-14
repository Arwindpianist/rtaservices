'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export const QUOTE_SERVICE_OPTIONS = [
  { value: 'rta-tpm', label: 'RTA TPM', description: 'Hardware maintenance & extended warranty' },
  { value: 'rta-oss', label: 'RTA OSS', description: 'Open-source software support under SLA' },
  { value: 'rta-ps', label: 'RTA PS', description: 'Professional services & consulting' },
  { value: 'general', label: 'General / Multiple', description: 'More than one service or general inquiry' },
] as const;

export type QuoteServiceValue = (typeof QUOTE_SERVICE_OPTIONS)[number]['value'];

interface QuoteFormData {
  service: QuoteServiceValue;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  requirements: string;
}

interface FormErrors {
  service?: string;
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  requirements?: string;
}

export default function QuoteForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<QuoteFormData>({
    service: 'general',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    requirements: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Pre-fill service from URL (?form=quote&service=oss | tpm | ps | general)
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    const valid = QUOTE_SERVICE_OPTIONS.some((o) => o.value === serviceParam);
    if (serviceParam && valid) {
      setFormData((prev) => ({ ...prev, service: serviceParam as QuoteServiceValue }));
    }
  }, [searchParams]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Requirements are required';
    } else if (formData.requirements.trim().length < 20) {
      newErrors.requirements = 'Please provide more details (at least 20 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          service: formData.service,
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          requirements: '',
        });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="text-body-sm text-rta-text mb-3 block">
          Service you&apos;re looking for *
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUOTE_SERVICE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                formData.service === opt.value
                  ? 'border-rta-blue bg-rta-bg-blue/20'
                  : 'border-rta-border hover:border-rta-blue/50'
              }`}
            >
              <input
                type="radio"
                name="service"
                value={opt.value}
                checked={formData.service === opt.value}
                onChange={() => {
                  setFormData((prev) => ({ ...prev, service: opt.value }));
                  if (errors.service) setErrors((prev) => ({ ...prev, service: undefined }));
                }}
                className="sr-only"
              />
              <span className="font-semibold text-rta-text">{opt.label}</span>
              <span className="text-body-sm text-rta-text-secondary mt-0.5">{opt.description}</span>
            </label>
          ))}
        </div>
        <AnimatePresence>
          {errors.service && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-1 text-body-sm text-red-600"
            >
              {errors.service}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <Label htmlFor="companyName" className="text-body-sm text-rta-text mb-2">
          Company Name *
        </Label>
        <Input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className={errors.companyName ? 'border-red-500' : ''}
          placeholder="Your company name"
        />
        <AnimatePresence>
          {errors.companyName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-1 text-body-sm text-red-600"
            >
              {errors.companyName}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <Label htmlFor="contactPerson" className="text-body-sm text-rta-text mb-2">
          Contact Person *
        </Label>
        <Input
          type="text"
          id="contactPerson"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
          className={errors.contactPerson ? 'border-red-500' : ''}
          placeholder="Your name"
        />
        <AnimatePresence>
          {errors.contactPerson && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-1 text-body-sm text-red-600"
            >
              {errors.contactPerson}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <Label htmlFor="email" className="text-body-sm text-rta-text mb-2">
          Email *
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'border-red-500' : ''}
          placeholder="your.email@example.com"
        />
        <AnimatePresence>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-1 text-body-sm text-red-600"
            >
              {errors.email}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <Label htmlFor="phone" className="text-body-sm text-rta-text mb-2">
          Phone *
        </Label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={errors.phone ? 'border-red-500' : ''}
          placeholder="+65 1234 5678"
        />
        <AnimatePresence>
          {errors.phone && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-1 text-body-sm text-red-600"
            >
              {errors.phone}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <Label htmlFor="requirements" className="text-body-sm text-rta-text mb-2">
          Requirements *
        </Label>
        <Textarea
          id="requirements"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          rows={6}
          className={errors.requirements ? 'border-red-500' : ''}
          placeholder="Please describe your requirements in detail..."
        />
        <AnimatePresence>
          {errors.requirements && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-1 text-body-sm text-red-600"
            >
              {errors.requirements}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="p-4 bg-green-50 border border-green-200 rounded-md"
          >
            <p className="text-green-800 text-body-sm">
              Thank you! Your quote request has been submitted. We'll get back to you soon.
            </p>
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="p-4 bg-red-50 border border-red-200 rounded-md"
          >
            <p className="text-red-800 text-body-sm">Something went wrong. Please try again later.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-rta-gold-cta text-white w-full hover:bg-rta-gold-cta-hover hover:shadow-lg"
        style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
      >
        {isSubmitting ? 'Submitting...' : 'Request Quote'}
      </Button>
    </form>
  );
}
