import { getCloudflareContext } from '@opennextjs/cloudflare';
import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client';

// A Worker cannot reuse a database client across requests, so each request gets its own.
// Keyed on the request's execution context, which also covers route handlers, where
// React's cache() does not apply.
const clients = new WeakMap<object, PrismaClient>();
let fallbackClient: PrismaClient | null = null;

function requestClient(): PrismaClient {
  try {
    const cf = getCloudflareContext();
    const env = cf?.env;
    const ctx = cf?.ctx as object | undefined;

    if (env?.DB) {
      if (ctx && typeof ctx === 'object') {
        let client = clients.get(ctx);
        if (!client) {
          client = new PrismaClient({
            adapter: new PrismaD1(env.DB),
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
          });
          clients.set(ctx, client);
        }
        return client;
      }

      if (!fallbackClient) {
        fallbackClient = new PrismaClient({
          adapter: new PrismaD1(env.DB),
          log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });
      }
      return fallbackClient;
    }
  } catch {
    // If outside Cloudflare context (e.g. standalone scripts or build)
  }

  if (!fallbackClient) {
    fallbackClient = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return fallbackClient;
}

/** Resolves to the current request's client on each use, so callers can import it normally. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = requestClient();
    const value = Reflect.get(client, property);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export default prisma;

// Public pages render without their database content when the database is unavailable.
// Use as .catch(orEmpty('page')).
export const orEmpty = (where: string) => (error: unknown) => {
  console.error(`${where}: database unavailable.`, error);
  return [] as never[];
};
export const orNull = (where: string) => (error: unknown) => {
  console.error(`${where}: database unavailable.`, error);
  return null;
};
