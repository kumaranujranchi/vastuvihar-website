import { readSettings } from './dom';

export function mediaSource(value) {
  try {
    const url = new URL(value, window.location.origin);
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtube-nocookie.com'].includes(url.hostname)) {
      const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).at(-1);
      if (id && /^[\w-]{6,20}$/.test(id)) return { kind: 'video', src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` };
    }
    if (['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(url.hostname)) {
      const id = url.pathname.split('/').findLast((part) => /^\d+$/.test(part));
      if (id) return { kind: 'video', src: `https://player.vimeo.com/video/${id}?autoplay=1` };
    }
    if (url.origin === window.location.origin && /\.(mp4|webm|ogg)$/i.test(url.pathname)) return { kind: 'file-video', src: url.href };
    if (url.origin === window.location.origin && /\.(png|jpe?g|webp|gif|svg|avif)$/i.test(url.pathname)) return { kind: 'image', src: url.href };
  } catch { /* Unrecognized links keep their normal browser behavior. */ }
  return null;
}

export function initMedia(context, showDialog) {
  context.listen(document, 'click', (event) => {
    if (!(event.target instanceof Element)) return;
    const target = event.target.closest('a.elementor-video-popup, .elementor-custom-embed-play, a[data-elementor-open-lightbox="yes"]');
    if (!target) return;
    const settings = readSettings(target.closest('.elementor-widget-video'));
    const href = target.getAttribute('href');
    const source = mediaSource((href && href !== '#' ? href : null) || settings.youtube_url || settings.vimeo_url || settings.hosted_url?.url || '');
    if (!source) return;
    event.preventDefault();
    showDialog({ ...source, title: source.kind === 'image' ? 'Image preview' : 'Video' }, target);
  });
}
