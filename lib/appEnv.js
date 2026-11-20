// Which deployment this build is for. Read at build time, so each environment is built
// separately (scripts/cf.mjs sets it). Unset means production, so existing builds that
// do not know about it keep behaving as before.
export const APP_ENV = (process.env.NEXT_PUBLIC_APP_ENV || 'production').trim().toLowerCase();

export const IS_PRODUCTION = APP_ENV === 'production';
