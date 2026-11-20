// Unit tests for the Cloudflare Access gate. Run with: npm run test:unit
import assert from 'node:assert/strict';
import { generateKeyPairSync, createSign } from 'node:crypto';
import test from 'node:test';
import {
  accessSetting,
  accessToken,
  clearAccessKeyCache,
  verifyAccessToken,
} from '../../lib/security/cfAccess.ts';

const TEAM = 'vastuvihar.cloudflareaccess.com';
const AUD = 'a'.repeat(64);
const config = { teamDomain: TEAM, audience: AUD };
const now = Date.UTC(2026, 10, 19, 12, 0, 0);

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const { privateKey: otherKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'key-1', alg: 'RS256', use: 'sig' };

const b64 = (value) => Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)).toString('base64url');

function sign({ header = {}, payload = {}, key = privateKey } = {}) {
  const head = b64({ alg: 'RS256', kid: 'key-1', typ: 'JWT', ...header });
  const body = b64({
    iss: `https://${TEAM}`,
    aud: [AUD],
    email: 'staff@vastuvihar.org',
    exp: now / 1000 + 600,
    nbf: now / 1000 - 10,
    ...payload,
  });
  const signature = createSign('RSA-SHA256').update(`${head}.${body}`).sign(key).toString('base64url');
  return `${head}.${body}.${signature}`;
}

let certRequests = 0;
const fakeFetch = async (url) => {
  certRequests += 1;
  assert.equal(url, `https://${TEAM}/cdn-cgi/access/certs`);
  return new Response(JSON.stringify({ keys: [jwk] }), { status: 200 });
};

test('accessSetting is off unless REQUIRE_CF_ACCESS=1', () => {
  assert.deepEqual(accessSetting({}), { required: false });
  assert.deepEqual(accessSetting({ REQUIRE_CF_ACCESS: '0', CF_ACCESS_TEAM_DOMAIN: TEAM, CF_ACCESS_AUD: AUD }), { required: false });
});

test('accessSetting fails closed on missing or placeholder values', () => {
  assert.deepEqual(accessSetting({ REQUIRE_CF_ACCESS: '1' }), { required: true, config: null });
  assert.deepEqual(
    accessSetting({ REQUIRE_CF_ACCESS: '1', CF_ACCESS_TEAM_DOMAIN: 'REPLACE_WITH_TEAM', CF_ACCESS_AUD: AUD }),
    { required: true, config: null },
  );
  assert.deepEqual(
    accessSetting({ REQUIRE_CF_ACCESS: '1', CF_ACCESS_TEAM_DOMAIN: `https://${TEAM.toUpperCase()}/`, CF_ACCESS_AUD: AUD }),
    { required: true, config },
  );
});

test('accessToken reads the header first, then the cookie', () => {
  assert.equal(accessToken(new Headers({ 'cf-access-jwt-assertion': 'h.t.s' })), 'h.t.s');
  assert.equal(accessToken(new Headers({ cookie: 'a=1; CF_Authorization=c.t.s; b=2' })), 'c.t.s');
  assert.equal(accessToken(new Headers({ cookie: 'vv_admin_session=x' })), null);
});

test('accepts a valid token and caches the signing keys', async () => {
  clearAccessKeyCache();
  certRequests = 0;
  assert.equal(await verifyAccessToken(sign(), config, fakeFetch, now), true);
  assert.equal(await verifyAccessToken(sign(), config, fakeFetch, now), true);
  assert.equal(certRequests, 1);
});

test('accepts a string aud claim', async () => {
  assert.equal(await verifyAccessToken(sign({ payload: { aud: AUD } }), config, fakeFetch, now), true);
});

test('rejects tampered, foreign, expired and wrong-audience tokens', async () => {
  clearAccessKeyCache();
  const good = sign();
  const [h, , s] = good.split('.');
  const forgedBody = b64({ iss: `https://${TEAM}`, aud: [AUD], email: 'attacker@example.com', exp: now / 1000 + 600 });
  const cases = {
    missing: null,
    garbage: 'not-a-jwt',
    tamperedPayload: `${h}.${forgedBody}.${s}`,
    otherSigningKey: sign({ key: otherKey }),
    expired: sign({ payload: { exp: now / 1000 - 3600 } }),
    notYetValid: sign({ payload: { nbf: now / 1000 + 3600 } }),
    wrongAudience: sign({ payload: { aud: ['b'.repeat(64)] } }),
    wrongIssuer: sign({ payload: { iss: 'https://evil.cloudflareaccess.com' } }),
    algNone: `${b64({ alg: 'none', kid: 'key-1' })}.${good.split('.')[1]}.`,
    hs256: sign({ header: { alg: 'HS256' } }),
    unknownKid: sign({ header: { kid: 'key-unknown' } }),
  };
  for (const [name, token] of Object.entries(cases)) {
    assert.equal(await verifyAccessToken(token, config, fakeFetch, now), false, name);
  }
});

test('rejects when the certs endpoint fails', async () => {
  clearAccessKeyCache();
  const failing = async () => new Response('down', { status: 500 });
  assert.equal(await verifyAccessToken(sign(), config, failing, now), false);
});
