import { prisma } from '@/lib/prisma';

// Defaults only. Each is editable in the admin panel, so a change in the rules or
// a decision by the organisation does not need a code change.
export const SETTING_DEFAULTS = {
  grievanceResponseDays: { value: 30, label: 'Grievance response deadline (days)' },
  requestResponseDays: { value: 30, label: 'Access, correction and erasure response deadline (days)' },
  breachBoardReportHours: { value: 72, label: 'Detailed breach report to the Board (hours from detection)' },
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;

export async function getSettings(): Promise<Record<SettingKey, number>> {
  const rows = await prisma.privacySetting.findMany();
  const result = {} as Record<SettingKey, number>;
  for (const key of Object.keys(SETTING_DEFAULTS) as SettingKey[]) {
    const stored = rows.find((row) => row.key === key);
    const parsed = stored ? Number(stored.value) : NaN;
    result[key] = Number.isFinite(parsed) && parsed > 0 ? parsed : SETTING_DEFAULTS[key].value;
  }
  return result;
}
