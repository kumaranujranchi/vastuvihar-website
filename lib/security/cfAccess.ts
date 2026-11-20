// Cloudflare Access gate for the admin area.
//
// The admin login keeps a built-in master account (app/api/admin/auth/route.ts), so the
// login form must never be reachable by the public. When REQUIRE_CF_ACCESS=1, every
// /admin and /api/admin request must carry a valid Cloudflare Access token. The token is
// verified here, in the app, so the gate also holds on routes Access does not cover,
// such as a workers.dev or preview URL.
//
// Dependency-free on purpose: proxy.ts imports it, and scripts/tests runs it directly.

export interface AccessConfig {
  /** For example vastuvihar.cloudflareaccess.com */
  teamDomain: string;
  /** The Application Audience (AUD) tag of the Access application. */
  audience: string;
}

export type AccessSetting =
  | { required: false }
  | { required: true; config: AccessConfig }
  | { required: true; config: null };

type Env = Record<string, string | undefined>;

const PLACEHOLDER = /^(|REPLACE_.*|TODO.*|CHANGE_ME.*)$/i;

/** Reads REQUIRE_CF_ACCESS, CF_ACCESS_TEAM_DOMAIN and CF_ACCESS_AUD. */
export function accessSetting(env: Env = process.env): AccessSetting {
  if ((env.REQUIRE_CF_ACCESS || '').trim() !== '1') return { required: false };
  const teamDomain = (env.CF_ACCESS_TEAM_DOMAIN || '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '')
    .toLowerCase();
  const audience = (env.CF_ACCESS_AUD || '').trim();
  if (PLACEHOLDER.test(teamDomain) || PLACEHOLDER.test(audience) || !/^[a-z0-9.-]+$/.test(teamDomain)) {
    return { required: true, config: null };
  }
  return { required: true, config: { teamDomain, audience } };
}

/** The Access token from the header Access adds, or from its cookie. */
export function accessToken(headers: Headers): string | null {
  const header = headers.get('cf-access-jwt-assertion');
  if (header) return header.trim();
  const cookie = headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)CF_Authorization=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

type Jwk = JsonWebKey & { kid?: string };

const KEY_CACHE_MS = 10 * 60 * 1000;
const CLOCK_SKEW_S = 60;
const keyCache = new Map<string, { at: number; keys: Jwk[] }>();

function base64UrlBytes(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function decodeJson(segment: string): any {
  return JSON.parse(new TextDecoder().decode(base64UrlBytes(segment)));
}

async function signingKeys(
  teamDomain: string,
  fetchImpl: typeof fetch,
  now: number,
  refresh = false,
): Promise<Jwk[]> {
  const cached = keyCache.get(teamDomain);
  if (!refresh && cached && now - cached.at < KEY_CACHE_MS) return cached.keys;
  const response = await fetchImpl(`https://${teamDomain}/cdn-cgi/access/certs`);
  if (!response.ok) throw new Error(`Access certs request failed: ${response.status}`);
  const body = (await response.json()) as { keys?: Jwk[] };
  const keys = Array.isArray(body.keys) ? body.keys : [];
  keyCache.set(teamDomain, { at: now, keys });
  return keys;
}

/** True only for an unexpired RS256 token signed by the team's Access keys, for this app. */
export async function verifyAccessToken(
  token: string | null,
  config: AccessConfig,
  fetchImpl: typeof fetch = fetch,
  now: number = Date.now(),
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  try {
    const header = decodeJson(parts[0]);
    const payload = decodeJson(parts[1]);
    if (header?.alg !== 'RS256' || typeof header.kid !== 'string') return false;

    const seconds = now / 1000;
    if (payload?.iss !== `https://${config.teamDomain}`) return false;
    const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!audiences.includes(config.audience)) return false;
    if (typeof payload.exp !== 'number' || payload.exp + CLOCK_SKEW_S < seconds) return false;
    if (typeof payload.nbf === 'number' && payload.nbf - CLOCK_SKEW_S > seconds) return false;

    let jwk = (await signingKeys(config.teamDomain, fetchImpl, now)).find((key) => key.kid === header.kid);
    // Access rotates its keys, so an unknown key ID refreshes the cache once.
    if (!jwk) jwk = (await signingKeys(config.teamDomain, fetchImpl, now, true)).find((key) => key.kid === header.kid);
    if (!jwk) return false;

    const key = await crypto.subtle.importKey(
      'jwk',
      { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    return await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      base64UrlBytes(parts[2]),
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
    );
  } catch {
    return false;
  }
}

/** Test hook: forget cached signing keys. */
export function clearAccessKeyCache(): void {
  keyCache.clear();
}
