import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.rtaservices.net';

/** Public routes only (no dashboard – behind auth). */
const PUBLIC_PATHS = [
  { path: '', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/services/oss', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/support/request', priority: 0.85, changeFrequency: 'monthly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BASE_URL.replace(/\/$/, '');

  return PUBLIC_PATHS.map(({ path, priority, changeFrequency }) => ({
    url: path ? `${baseUrl}${path}` : baseUrl,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
