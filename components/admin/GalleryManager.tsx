'use client';

import { useRef, useState } from 'react';
import { compressImageToWebP } from '@/lib/clientImageCompress';
import { useLoad } from './adminApi';
import styles from './GalleryManager.module.css';

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  builtInName: string | null;
  uploadId: string | null;
};

type GalleryAlbum = { slug: string; title: string; images: GalleryImage[] };

const ACCEPT = '.jpg,.jpeg,.png,.gif,.webp';

async function send(url: string, init: RequestInit) {
  const response = await fetch(url, init);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The request failed.');
}

function imageFields(image: GalleryImage): Record<string, string> {
  return image.uploadId ? { uploadId: image.uploadId } : { builtInName: image.builtInName || '' };
}

export default function GalleryManager() {
  const { data, error, reload } = useLoad<{ albums: GalleryAlbum[] }>('/api/admin/gallery');
  const [selected, setSelected] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const addInput = useRef<HTMLInputElement>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const replaceTarget = useRef<GalleryImage | null>(null);

  const albums = data?.albums || [];
  const album = albums.find((item) => item.slug === selected) || albums[0];

  async function upload(file: File, extra: Record<string, string> = {}) {
    const compressed = await compressImageToWebP(file);
    const body = new FormData();
    body.set('album', album.slug);
    body.set('file', compressed);
    Object.entries(extra).forEach(([key, value]) => body.set(key, value));
    await send('/api/admin/gallery', { method: 'POST', body });
  }

  async function addPhotos(files: File[]) {
    setBusy(true);
    setMessage('');
    const failures: string[] = [];
    for (const file of files) {
      try {
        await upload(file);
      } catch (err) {
        failures.push(`${file.name}: ${(err as Error).message}`);
      }
    }
    const added = files.length - failures.length;
    const summary = added ? `Added ${added} ${added === 1 ? 'photo' : 'photos'}.` : '';
    setMessage([summary, ...failures].filter(Boolean).join(' '));
    await reload();
    setBusy(false);
  }

  async function act(fn: () => Promise<void>, done: string) {
    setBusy(true);
    setMessage('');
    try {
      await fn();
      setMessage(done);
      await reload();
    } catch (err) {
      setMessage((err as Error).message);
    }
    setBusy(false);
  }

  function deletePhoto(image: GalleryImage) {
    if (!confirm(`Delete "${image.alt}" from the public gallery? This can't be undone here.`)) return;
    const query = new URLSearchParams({ album: album.slug, ...imageFields(image) });
    act(() => send(`/api/admin/gallery?${query}`, { method: 'DELETE' }), 'Photo deleted.');
  }

  return (
    <div className={styles.manager}>
      <div className={styles.toolbar}>
        <div className={styles.albums} role="group" aria-label="Albums">
          {albums.map((item) => (
            <button
              key={item.slug}
              type="button"
              aria-pressed={item.slug === album?.slug}
              className={`${styles.album} ${item.slug === album?.slug ? styles.albumActive : ''}`}
              onClick={() => {
                setSelected(item.slug);
                setMessage('');
              }}
            >
              {item.title} ({item.images.length})
            </button>
          ))}
        </div>
        <button type="button" className={styles.primary} disabled={busy || !album} onClick={() => addInput.current?.click()}>
          {busy ? 'Working…' : 'Add photos'}
        </button>
      </div>

      <p className={styles.hint}>JPG, PNG, GIF or WebP, up to 8MB each. Changes appear on the public gallery straight away.</p>

      <input
        ref={addInput}
        type="file"
        accept={ACCEPT}
        multiple
        hidden
        onChange={(event) => {
          const files = Array.from(event.target.files || []);
          event.target.value = '';
          if (files.length) addPhotos(files);
        }}
      />
      <input
        ref={replaceInput}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          const target = replaceTarget.current;
          event.target.value = '';
          if (file && target) act(() => upload(file, imageFields(target)), 'Photo replaced.');
        }}
      />

      {(error || message) && <p role="status" className={styles.message}>{error || message}</p>}

      {album && album.images.length === 0 && (
        <p className={styles.empty}>This album has no photos, so it's hidden on the public gallery.</p>
      )}

      <ul className={styles.grid}>
        {album?.images.map((image) => (
          <li key={image.id} className={styles.card}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt={image.alt} loading="lazy" className={styles.image} />
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.action}
                disabled={busy}
                aria-label={`Replace ${image.alt}`}
                onClick={() => {
                  replaceTarget.current = image;
                  replaceInput.current?.click();
                }}
              >
                Replace
              </button>
              <button
                type="button"
                className={`${styles.action} ${styles.danger}`}
                disabled={busy}
                aria-label={`Delete ${image.alt}`}
                onClick={() => deletePhoto(image)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
