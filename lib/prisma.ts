import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// A Worker cannot reuse a database client across requests, so each request gets its own.
const clients = new WeakMap<object, PrismaClient>();
let fallbackClient: PrismaClient | null = null;

function requestClient(): PrismaClient {
  // 1. Try Cloudflare Worker D1 binding if present
  try {
    // Dynamic import/require so Node.js environments (like AWS Lightsail) do not fail
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const cf = getCloudflareContext();
    const env = cf?.env;
    const ctx = cf?.ctx as object | undefined;

    if (env?.DB) {
      if (ctx && typeof ctx === 'object') {
        let client = clients.get(ctx);
        if (!client) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { PrismaD1 } = require('@prisma/adapter-d1');
          client = new PrismaClient({
            adapter: new PrismaD1(env.DB),
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
          });
          clients.set(ctx, client);
        }
        return client;
      }

      if (!fallbackClient) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { PrismaD1 } = require('@prisma/adapter-d1');
        fallbackClient = new PrismaClient({
          adapter: new PrismaD1(env.DB),
          log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });
      }
      return fallbackClient;
    }
  } catch {
    // If outside Cloudflare context (AWS Lightsail, Docker, local dev, or standard Node.js server)
  }

  // 2. Standard Node.js / AWS Lightsail environment (Singleton PrismaClient)
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return globalForPrisma.prisma;
}

/** Resolves to the active Prisma client on each use, so callers can import it normally. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = requestClient();
    const value = Reflect.get(client, property);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export default prisma;

/**
 * What a cached public page does when the database is unavailable.
 *
 * In production the error is rethrown: Next.js then keeps serving the last good copy
 * of the page (ISR) instead of caching an empty one, and a page never cached returns a
 * 500, which search engines retry, rather than a 404 or an empty page they may index.
 * During `next build` and in development it falls back to `value`, so an outage never
 * blocks a deploy; the page then refreshes on its next revalidation.
 */
export function databaseFallback<T>(where: string, value: T) {
  return (error: unknown): T => {
    const tolerate =
      process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV !== 'production';
    console.error(`${where}: database unavailable.`, error);
    if (!tolerate) throw error;
    return value;
  };
}

// Use as .catch(orEmpty('page')).
export const orEmpty = (where: string) => databaseFallback(where, [] as never[]);
export const orNull = (where: string) => databaseFallback(where, null);
