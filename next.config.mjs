/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.STATIC_EXPORT === '1' ? { output: 'export' } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
