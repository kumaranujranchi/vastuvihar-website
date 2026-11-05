'use client';

import { useCallback, useEffect, useState } from 'react';

export const when = (value?: string | null) =>
  value ? new Date(value).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export async function api(url: string, method = 'GET', body?: unknown) {
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The request failed.');
  return data;
}

export function useLoad<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    try {
      setError('');
      setData(await api(url));
    } catch (err) {
      setError((err as Error).message);
    }
  }, [url]);
  useEffect(() => {
    reload();
  }, [reload]);
  return { data, error, reload };
}
