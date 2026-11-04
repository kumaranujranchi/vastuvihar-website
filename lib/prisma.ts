import { getCloudflareContext } from '@opennextjs/cloudflare';
import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client';

// A Worker cannot reuse a database client across requests, so each request gets its own.
// Keyed on the request's execution context, which also covers route handlers, where
// React's cache() does not apply.
const clients = new WeakMap<object, PrismaClient>();

function requestClient(): PrismaClient {
  const { env, ctx } = getCloudflareContext();
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
