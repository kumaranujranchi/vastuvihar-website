const isStaticExport = process.env.STATIC_EXPORT === '1';
const isDev = process.env.NODE_ENV !== 'production';

// A tag's hosts are only allowed when its ID is set, so a site with no tags allows none.
const isSet = (name) => Boolean((process.env[name] || '').trim());
const tagHosts = [
  ...(isSet('NEXT_PUBLIC_GA4_ID')
    ? [{
        script: 'https://www.googletagmanager.com',
        connect: 'https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com',
        img: 'https://*.google-analytics.com https://*.googletagmanager.com',
      }]
    : []),
  ...(isSet('NEXT_PUBLIC_GOOGLE_ADS_ID')
    ? [{
        script: 'https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com',
        connect: 'https://*.g.doubleclick.net https://www.google.com https://www.googleadservices.com',
        img: 'https://*.g.doubleclick.net https://www.google.com https://www.google.co.in https://www.googleadservices.com',
        frame: 'https://td.doubleclick.net https://www.googletagmanager.com',
      }]
    : []),
  ...(isSet('NEXT_PUBLIC_META_PIXEL_ID')
    ? [{
        script: 'https://connect.facebook.net',
        connect: 'https://www.facebook.com https://connect.facebook.net',
        img: 'https://www.facebook.com',
        frame: 'https://www.facebook.com',
      }]
    : []),
];
const hostsFor = (kind) => {
  const hosts = new Set(tagHosts.flatMap((tag) => (tag[kind] || '').split(' ').filter(Boolean)));
  return hosts.size ? ` ${[...hosts].join(' ')}` : '';
};

// Frames are limited to the media providers named in the privacy notice. The site's
// inline hydration scripts need 'unsafe-inline' without a nonce, and a nonce would
// force every page to render dynamically.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}${hostsFor('script')}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${hostsFor('img')}`,
  "font-src 'self' data:",
  "media-src 'self'",
  `connect-src 'self'${isDev ? ' ws:' : ''}${hostsFor('connect')}`,
  `frame-src https://www.youtube-nocookie.com https://player.vimeo.com https://www.google.com https://maps.google.com${hostsFor('frame')}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isStaticExport ? { output: 'export' } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  ...(isStaticExport
    ? {}
    : {
        async headers() {
          return [
            { source: '/:path*', headers: securityHeaders },
            { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
          ];
        },
      }),
};

export default nextConfig;
