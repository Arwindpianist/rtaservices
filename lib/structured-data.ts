export interface OrganizationSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    "@type": string;
    streetAddress: string;
    addressLocality: string;
    addressCountry: string;
    postalCode: string;
  };
  contactPoint: Array<{
    "@type": string;
    telephone: string;
    contactType: string;
    email?: string;
  }>;
  sameAs: string[];
}

export interface ServiceSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  provider: {
    "@type": string;
    name: string;
  };
  areaServed: string | {
    "@type": string;
    geoMidpoint: {
      "@type": string;
      latitude: string;
      longitude: string;
    };
    geoRadius: {
      "@type": string;
      name: string;
    };
  };
  serviceType: string;
}

export interface LocalBusinessSchema {
  "@context": string;
  "@type": string;
  name: string;
  image: string;
  "@id": string;
  url: string;
  telephone: string;
  priceRange: string;
  address: {
    "@type": string;
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    "@type": string;
    latitude: string;
    longitude: string;
  };
  openingHoursSpecification: {
    "@type": string;
    dayOfWeek: string[];
    opens: string;
    closes: string;
  };
}

export function getOrganizationSchema(): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RTA Services",
    url: "https://rta.arwindpianist.com",
    logo: "https://rta.arwindpianist.com/assets/original/logo.png",
    description: "RTA Services provides enterprise IT solutions including maintenance, asset management, and professional services across Asia-Pacific.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "20 UPPER CIRCULAR ROAD #03-01/05, THE RIVERWALK",
      addressLocality: "Singapore",
      addressCountry: "SG",
      postalCode: "058416",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+65-9644-4147",
        contactType: "Sales",
        email: "sales@rtaservices.net",
      },
      {
        "@type": "ContactPoint",
        telephone: "+65-9644-4147",
        contactType: "Customer Service",
        email: "support@rtaservices.net",
      },
    ],
    sameAs: [
      "https://www.linkedin.com/company/rta-services",
      "https://www.youtube.com/@rtaservices",
      "https://www.facebook.com/rtaservices",
    ],
  };
}

export function getServiceSchema(serviceName: string, description: string): ServiceSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description: description,
    provider: {
      "@type": "Organization",
      name: "RTA Services",
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: "1.3521",
        longitude: "103.8198",
      },
      geoRadius: {
        "@type": "Distance",
        name: "Asia-Pacific Region",
      },
    },
    serviceType: "IT Services",
  };
}

export function getLocalBusinessSchema(): LocalBusinessSchema {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "RTA Services",
    image: "https://rta.arwindpianist.com/assets/original/logo.png",
    "@id": "https://rta.arwindpianist.com",
    url: "https://rta.arwindpianist.com",
    telephone: "+65-9644-4147",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "20 UPPER CIRCULAR ROAD #03-01/05, THE RIVERWALK",
      addressLocality: "Singapore",
      addressRegion: "Singapore",
      postalCode: "058416",
      addressCountry: "SG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "1.290270",
      longitude: "103.851959",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; item: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}
