import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

// Prerendered pages are served from the build output. The site has no time-based
// revalidation, so it needs no R2 cache, queue or tag cache.
export default {
  ...defineCloudflareConfig({
    incrementalCache: staticAssetsIncrementalCache,
  }),
  // `npm run build` runs OpenNext, so OpenNext must not call it back.
  buildCommand: 'npm run build:next',
};
