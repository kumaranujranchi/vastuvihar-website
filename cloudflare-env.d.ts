// Bindings and vars from wrangler.jsonc. Written by hand because the runtime types from
// `wrangler types` replace global ones such as Response, which breaks the browser code.
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

declare global {
  interface CloudflareEnv {
    DB: D1Database;
    PRIVATE_FILES: R2Bucket;
    MEDIA: R2Bucket;
    APP_ENV: 'production' | 'uat' | 'local';
    CLIENT_IP_HEADER: string;
    REQUIRE_CF_ACCESS: string;
    CF_ACCESS_TEAM_DOMAIN: string;
    CF_ACCESS_AUD: string;
    // Secrets (wrangler secret put)
    PRIVACY_HASH_SECRET: string;
    RETENTION_CRON_SECRET: string;
    ADMIN_EMAIL?: string;
    ADMIN_PASSWORD?: string;
  }
}
