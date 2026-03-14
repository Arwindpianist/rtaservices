import Hero from '@/components/Hero';
import Services from '@/components/Services';
import WhyChooseUs from '@/components/WhyChooseUs';
import PartnerSection from '@/components/PartnerSection';
import BrandLogos from '@/components/BrandLogos';
import OSSProductRange from '@/components/OSSProductRange';
import { getOrganizationSchema, getLocalBusinessSchema } from '@/lib/structured-data';

export const metadata = {
  title: 'Enterprise SLA Grade Maintenance Services & Support Partner | RTA Services',
  description: 'We empower organizations to maintain, migrate and scale, cost effectively. RTA TPM, RTA OSS, RTA PS. 24/7 support, guaranteed SLAs. Your strategic IT maintenance partner in Asia.',
  openGraph: {
    title: 'Enterprise SLA Grade Maintenance Services & Support Partner | RTA Services',
    description: 'We empower organizations to maintain, migrate and scale, cost effectively. RTA TPM, RTA OSS, RTA PS. Serving Asia-Pacific.',
    url: 'https://rta.arwindpianist.com',
  },
};

export default function Home() {
  const organizationSchema = getOrganizationSchema();
  const localBusinessSchema = getLocalBusinessSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Hero />
      <Services />
      <WhyChooseUs />
      <PartnerSection />
      <BrandLogos />
      <OSSProductRange />
    </>
  );
}

