/**
 * Product range logos. Uses public CDN (Simple Icons via jsDelivr) where available;
 * fallback paths under /images/logos/ for any not on the CDN.
 * Add local files to public/images/logos/oss/ or public/images/logos/tpm/ when needed.
 */

const SI = (slug: string) =>
  `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${slug}.svg`;

export type ProductWithLogo = { name: string; logo: string };

/** OSS technologies – logos from Simple Icons CDN (source: simpleicons.org) */
export const OSS_PRODUCT_LOGO: ProductWithLogo[] = [
  { name: 'Kubernetes', logo: SI('kubernetes') },
  { name: 'Prometheus', logo: SI('prometheus') },
  { name: 'Angular', logo: SI('angular') },
  { name: 'Apache Tomcat', logo: SI('apachetomcat') },
  { name: 'Apache ActiveMQ', logo: SI('apache') },
  { name: 'Apache Cassandra', logo: SI('apachecassandra') },
  { name: 'Apache Spark', logo: SI('apachespark') },
  { name: 'Kafka', logo: SI('apachekafka') },
  { name: 'CentOS', logo: SI('centos') },
  { name: 'Hadoop', logo: SI('apachehadoop') },
  { name: 'Docker', logo: SI('docker') },
  { name: 'Rocky Linux', logo: SI('rockylinux') },
  { name: 'PostgreSQL', logo: SI('postgresql') },
  { name: 'Python', logo: SI('python') },
  { name: 'Puppet', logo: SI('puppet') },
];

/** TPM hardware brands – all from Simple Icons CDN for reliable display */
export const TPM_PRODUCT_LOGO: ProductWithLogo[] = [
  { name: 'Dell EMC', logo: SI('dell') },
  { name: 'IBM', logo: SI('ibm') },
  { name: 'HPE', logo: '/images/logos/tpm/hpe.svg' },
  { name: 'Sun Oracle', logo: SI('oracle') },
  { name: 'NetApp', logo: SI('netapp') },
  { name: 'Cisco', logo: SI('cisco') },
  { name: 'Huawei', logo: SI('huawei') },
  { name: 'Fujitsu', logo: SI('fujitsu') },
];

/** RTA PS (Professional Services) – range of services (no logos) */
export type PSServiceItem = { title: string; description?: string };

export const PS_SERVICES: PSServiceItem[] = [
  { title: 'L1–L3 engineering & support', description: 'Escalation and resolution from helpdesk to senior engineers.' },
  { title: 'IMAC services', description: 'Install, Move, Add & Change for servers, storage and networking.' },
  { title: 'OS installation, configuration & upgrades', description: 'Operating system deployment and lifecycle management.' },
  { title: 'Project management', description: 'Complex enterprise computing and infrastructure projects.' },
  { title: 'Migrations & architecture reviews', description: 'Implementation support and deployment of your stack.' },
  { title: 'ITAD & secure data erasure', description: 'IT Asset Disposition with compliance and certified erasure.' },
];
