// Bindings from wrangler.jsonc. Written by hand because the runtime types from `wrangler types`
// replace global ones such as Response, which breaks the browser code in this project.
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

declare global {
  interface CloudflareEnv {
    DB: D1Database;
    PRIVATE_FILES: R2Bucket;
    MEDIA: R2Bucket;
  }
}
