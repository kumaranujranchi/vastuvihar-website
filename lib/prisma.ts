import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// One client per Node process, connected to PostgreSQL through DATABASE_URL.
// In development the client is kept on globalThis so hot reloads do not open new pools.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

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
