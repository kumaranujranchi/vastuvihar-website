/** Trims, removes control characters and caps length. Rendering is escaped by React. */
export function cleanText(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(value: unknown): string | null {
  const email = cleanText(value, 254).toLowerCase();
  return EMAIL.test(email) ? email : null;
}

/** Returns digits with an optional leading +, or null when not a plausible number. */
export function normalizePhone(value: unknown): string | null {
  const phone = cleanText(value, 32).replace(/[^\d+]/g, '');
  return /^\+?\d{10,15}$/.test(phone) ? phone : null;
}

/** Comparison form, so +919534095340 and 9534095340 are the same person. */
export function phoneMatchKey(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

export function isTrue(value: unknown): boolean {
  return value === true || value === 'true' || value === 'on' || value === '1';
}

export function oneOf<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  return allowed.includes(value as T) ? (value as T) : null;
}

/** Stops spreadsheet apps executing a cell that starts with a formula character. */
export function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}
