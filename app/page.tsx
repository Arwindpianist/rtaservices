import Hero from '@/components/Hero';
import Services from '@/components/Services';
import WhyChooseUs from '@/components/WhyChooseUs';
import PartnerSection from '@/components/PartnerSection';
import BrandLogos from '@/components/BrandLogos';
import { getOrganizationSchema, getLocalBusinessSchema } from '@/lib/structured-data';

export const metadata = {
  title: 'Enterprise IT Support Services Singapore | RTA Services - 40% Cost Savings',
  description: 'Multi-vendor IT maintenance, asset management & professional services for enterprise systems. 24/7 support, guaranteed uptime SLAs. Serving Asia-Pacific. Request free consultation.',
  openGraph: {
    title: 'Enterprise IT Support Services Singapore | RTA Services - 40% Cost Savings',
    description: 'Multi-vendor IT maintenance, asset management & professional services for enterprise systems. 24/7 support, guaranteed uptime SLAs. Serving Asia-Pacific.',
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
    </>
  );
}

