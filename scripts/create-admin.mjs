// Creates the first administrator, or resets an existing account's password.
//   ADMIN_BOOTSTRAP_PASSWORD='...' node scripts/create-admin.mjs <email> "<name>" [role]
// The password comes from the environment so it never lands in shell history as an argument.
import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
import { PrismaClient } from '@prisma/client';

// Hosts set variables in the environment, so .env is optional. Existing variables win.
try {
  process.loadEnvFile('.env');
} catch {}

const scrypt = promisify(scryptCallback);
const ROLES = ['SUPER_ADMIN', 'PRIVACY_OFFICER', 'SALES', 'HR', 'CONTENT'];

const [email, name, role = 'SUPER_ADMIN'] = process.argv.slice(2);
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD || '';

if (!email || !name || !ROLES.includes(role)) {
  console.error(`Usage: node scripts/create-admin.mjs <email> "<name>" [${ROLES.join('|')}]`);
  process.exit(1);
}
if (password.length < 12) {
  console.error('Set ADMIN_BOOTSTRAP_PASSWORD to at least 12 characters.');
  process.exit(1);
}

const salt = randomBytes(16);
const derived = await scrypt(password, salt, 64, { N: 2 ** 15, r: 8, p: 1, maxmem: 128 * 1024 * 1024 });
const passwordHash = `scrypt$${salt.toString('base64')}$${derived.toString('base64')}`;

const prisma = new PrismaClient();
const normalized = email.trim().toLowerCase();
const user = await prisma.adminUser.upsert({
  where: { email: normalized },
  update: { name, role, passwordHash, isActive: true, failedLogins: 0, lockedUntil: null },
  create: { email: normalized, name, role, passwordHash },
});
await prisma.adminSession.deleteMany({ where: { userId: user.id } });
await prisma.auditLog.create({
  data: { action: 'admin_user.bootstrapped', entityType: 'admin_user', entityId: user.id, metadata: JSON.stringify({ role }) },
});
await prisma.$disconnect();
console.log(`Admin account ready: ${normalized} (${role})`);
