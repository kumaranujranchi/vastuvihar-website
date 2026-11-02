import { audit } from '@/lib/audit';
import { logError } from '@/lib/security/request';

export type PropagationEvent = 'marketing_withdrawn' | 'correction' | 'erasure';

export interface ContactRef {
  phone?: string | null;
  email?: string | null;
}

/**
 * The website currently sends lead data to no CRM, email or WhatsApp platform, so
 * this list is empty. Any future integration must be registered here so opt-outs,
 * corrections and erasure reach it, and added to data/privacy/processors.js.
 */
export interface Connector {
  name: string;
  handle(event: PropagationEvent, contact: ContactRef, changes?: Record<string, unknown>): Promise<void>;
}

const connectors: Connector[] = [];

export async function propagate(
  event: PropagationEvent,
  contact: ContactRef,
  changes?: Record<string, unknown>,
): Promise<{ notified: string[]; failed: string[] }> {
  const notified: string[] = [];
  const failed: string[] = [];
  for (const connector of connectors) {
    try {
      await connector.handle(event, contact, changes);
      notified.push(connector.name);
    } catch (error) {
      failed.push(connector.name);
      logError(`connector:${connector.name}`, error);
    }
  }
  if (connectors.length) await audit(null, `propagation.${event}`, 'connector', undefined, { notified, failed });
  return { notified, failed };
}
