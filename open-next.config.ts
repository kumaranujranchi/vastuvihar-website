import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

// Pages without database content are prerendered and served from the build output, which
// is read-only. Every page that reads the database sets `dynamic = 'force-dynamic'` and
// renders on each request, so the site needs no R2 page cache, tag cache or queue.
// Do not add `revalidate` to a page: with this cache it would never refresh.
export default {
  ...defineCloudflareConfig({
    incrementalCache: staticAssetsIncrementalCache,
  }),
  // `npm run cf:build` runs OpenNext, so OpenNext must not call it back.
  buildCommand: 'npm run build:next',
};
