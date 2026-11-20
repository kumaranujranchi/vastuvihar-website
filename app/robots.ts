import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/metadata';
import { IS_PRODUCTION } from '@/lib/appEnv';

export default function robots(): MetadataRoute.Robots {
  // UAT and other non-production builds must never be indexed.
  if (!IS_PRODUCTION) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
