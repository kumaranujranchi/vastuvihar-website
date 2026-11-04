'use client';

import { useSyncExternalStore } from 'react';
import { OFFERED_CATEGORIES } from './cookieConfig';
import { NOTICE_VERSION } from './notices';

// Shared by the cookie banner, the embed gates, the tags and the privacy policy controls.
const STORAGE_KEY = 'vastu_dpdp_cookie_consent_v1';
const CHANGE_EVENT = 'cookieConsentUpdate';

let cachedRaw = null;
let cached = null;
// Holds the latest choice for this page view if storage is blocked or full, so a
// withdrawal still takes effect instead of the old stored grant staying live.
let unsaved = null;
let choiceLogged = Promise.resolve();

/** A choice made under an older notice no longer counts, so visitors are asked again. */
export function readChoice() {
  if (unsaved) return unsaved;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cached;
    cachedRaw = raw;
    cached = null;
    const parsed = raw ? JSON.parse(raw) : null;
    cached = parsed && parsed.version === NOTICE_VERSION ? parsed : null;
    return cached;
  } catch {
    return null;
  }
}

/** True until the visitor has answered for every category on offer, including newly added ones. */
export function needsChoice(choice = readChoice()) {
  return !choice || OFFERED_CATEGORIES.some((category) => typeof choice[category] !== 'boolean');
}

function subscribe(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

/** Null on the server and before a choice, so nothing optional ever runs by default. */
export function useCookieChoice() {
  return useSyncExternalStore(subscribe, readChoice, () => null);
}

export function useMediaConsent() {
  return useCookieChoice()?.media === true;
}

function existingBrowserId() {
  if (unsaved) return unsaved.browserId;
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')?.browserId;
  } catch {
    return undefined;
  }
}

function newBrowserId() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Saves the categories given and keeps the rest as they were. Anything not yet answered
 * stays unanswered, so allowing one video neither logs a refusal of the other categories
 * nor stops the banner asking about them. Everything answered is logged each time.
 */
export function saveChoices(changes, source, language = 'en') {
  const current = readChoice();
  const choices = {};
  for (const category of OFFERED_CATEGORIES) {
    const value = changes[category] ?? current?.[category];
    if (typeof value === 'boolean') choices[category] = value;
  }
  const browserId = existingBrowserId() || newBrowserId();
  const choice = {
    necessary: true,
    ...choices,
    timestamp: new Date().toISOString(),
    version: NOTICE_VERSION,
    browserId,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
    unsaved = null;
  } catch {
    // Storage can be blocked. The visitor is then asked again next time.
    unsaved = choice;
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: choice }));
  choiceLogged = fetch('/api/privacy/cookie-consent/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ browserId, choices, source, noticeLanguage: language }),
    keepalive: true,
  }).catch(() => {});
}

/** Settles once the latest choice has been sent to the consent ledger. */
export function whenChoiceLogged() {
  return choiceLogged;
}
