'use client';

import { currentAdSource } from './adSource';
import { readChoice, whenChoiceLogged } from './cookieChoices';
import { OFFERED_CATEGORIES, TRACKED_COOKIES } from './cookieConfig';

// Tags set their cookies a moment after loading, so events wait before cookies are read.
const FLUSH_DELAY_MS = 3000;
const MAX_BATCH = 25;

const isAllowed = (category, choice = readChoice()) =>
  OFFERED_CATEGORIES.includes(category) && choice?.[category] === true;

let queue = [];
let timer = null;
let listening = false;
const lastPath = {};

/** Names only. A cookie's value is never read into the log. */
function cookieNames(category) {
  return document.cookie
    .split(';')
    .map((entry) => entry.split('=')[0].trim())
    .filter((name) => TRACKED_COOKIES[category].test(name));
}

function flush() {
  if (timer) clearTimeout(timer);
  timer = null;
  const choice = readChoice();
  // A choice changed since these were queued is honoured here.
  const events = queue.filter((event) => isAllowed(event.category, choice)).slice(0, MAX_BATCH);
  queue = [];
  if (!events.length) return;
  const body = JSON.stringify({
    browserId: choice.browserId,
    events: events.map((event) =>
      event.kind === 'page_view'
        ? {
            ...event,
            cookies: cookieNames(event.category),
            ...(event.category === 'advertising' ? { adSource: currentAdSource() } : {}),
          }
        : event,
    ),
  });
  // The server checks the consent ledger, so a choice just made has to reach it first.
  whenChoiceLogged()
    .then(() =>
      fetch('/api/privacy/visitor-activity/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }),
    )
    .catch(() => {});
}

function enqueue(event) {
  if (!isAllowed(event.category)) return;
  if (!listening) {
    listening = true;
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush();
    });
  }
  queue.push(event);
  if (queue.length >= MAX_BATCH) flush();
  else if (!timer) timer = setTimeout(flush, FLUSH_DELAY_MS);
}

/** Logs one row for each allowed category, once per page change. */
export function logPageView(path) {
  for (const category of ['analytics', 'advertising']) {
    if (!isAllowed(category)) {
      lastPath[category] = null;
    } else if (lastPath[category] !== path) {
      lastPath[category] = path;
      enqueue({ kind: 'page_view', category, path });
    }
  }
}

export function logTagEvent(provider, category, eventName) {
  enqueue({ kind: 'tag_event', category, provider, eventName, path: window.location.pathname });
}
