// Creates the first administrator on D1, or resets an existing account's password.
//   ADMIN_BOOTSTRAP_PASSWORD='...' node scripts/create-admin-d1.mjs --remote <email> "<name>" [role]
// Use --local for the local development database. The password comes from the environment
// so it never lands in shell history as an argument.
import { spawnSync } from 'node:child_process';
import { randomBytes, randomUUID, scrypt as scryptCallback } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const ROLES = ['SUPER_ADMIN', 'PRIVACY_OFFICER', 'SALES', 'HR', 'CONTENT'];

const [target, email, name, role = 'SUPER_ADMIN'] = process.argv.slice(2);
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD || '';

if (!['--local', '--remote'].includes(target) || !email || !name || !ROLES.includes(role)) {
  console.error(`Usage: node scripts/create-admin-d1.mjs --local|--remote <email> "<name>" [${ROLES.join('|')}]`);
  process.exit(1);
}
if (password.length < 12) {
  console.error('Set ADMIN_BOOTSTRAP_PASSWORD to at least 12 characters.');
  process.exit(1);
}

// Must match lib/security/crypto.ts.
const salt = randomBytes(16);
const derived = await scrypt(password, salt, 64, { N: 2 ** 15, r: 8, p: 1, maxmem: 128 * 1024 * 1024 });
const passwordHash = `scrypt$${salt.toString('base64')}$${derived.toString('base64')}`;

const sql = (value) => `'${String(value).replaceAll("'", "''")}'`;
const normalized = email.trim().toLowerCase();
const now = new Date().toISOString();
const statements = `
INSERT INTO "AdminUser" ("id", "email", "name", "passwordHash", "role", "isActive", "failedLogins", "createdAt", "updatedAt")
VALUES (${sql(randomUUID())}, ${sql(normalized)}, ${sql(name)}, ${sql(passwordHash)}, ${sql(role)}, 1, 0, ${sql(now)}, ${sql(now)})
ON CONFLICT("email") DO UPDATE SET
  "name" = excluded."name", "passwordHash" = excluded."passwordHash", "role" = excluded."role",
  "isActive" = 1, "failedLogins" = 0, "lockedUntil" = NULL, "updatedAt" = excluded."updatedAt";
DELETE FROM "AdminSession" WHERE "userId" = (SELECT "id" FROM "AdminUser" WHERE "email" = ${sql(normalized)});
INSERT INTO "AuditLog" ("id", "action", "entityType", "entityId", "metadata", "createdAt")
SELECT ${sql(randomUUID())}, 'admin_user.bootstrapped', 'admin_user', "id", ${sql(JSON.stringify({ role }))}, ${sql(now)}
FROM "AdminUser" WHERE "email" = ${sql(normalized)};
`;

// The file holds a password hash, so it stays private to this user and is always removed.
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vv-admin-'));
const file = path.join(dir, 'admin.sql');
let status = 1;
try {
  fs.writeFileSync(file, statements, { mode: 0o600 });
  const result = spawnSync(
    process.execPath,
    ['node_modules/wrangler/bin/wrangler.js', 'd1', 'execute', 'DB', target, '--file', file, '--yes'],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  );
  status = result.status ?? 1;
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
if (status === 0) console.log(`Admin account ready: ${normalized} (${role}) on ${target.slice(2)} D1`);
process.exit(status);
