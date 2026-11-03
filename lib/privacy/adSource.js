'use client';

import { readChoice } from './cookieChoices';

const STORAGE_KEY = 'vastu_ad_source_v1';

// Held in memory only until the visitor allows advertising.
let landing = null;

const utm = (params, name) => (params.get(name) || '').trim().slice(0, 100) || null;

/** Click IDs only tell us the channel. Their values identify a person's click and are never kept. */
function parseSource(search) {
  const params = new URLSearchParams(search);
  const utmSource = utm(params, 'utm_source');
  const utmMedium = utm(params, 'utm_medium');
  const utmCampaign = utm(params, 'utm_campaign');
  let channel = null;
  if (params.has('gclid') || params.has('gbraid') || params.has('wbraid')) channel = 'google_ads';
  // Facebook adds fbclid to ordinary links too, so this means "from Meta", not always an advert.
  else if (params.has('fbclid')) channel = 'meta';
  else if (utmSource || utmMedium || utmCampaign) channel = 'campaign';
  return channel ? { channel, utmSource, utmMedium, utmCampaign } : null;
}

export function noteLanding() {
  const source = parseSource(window.location.search);
  if (source) landing = source;
}

function stored() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

/** Saves the source once advertising is allowed, and forgets it once refused or withdrawn. */
export function syncAdSource(advertising) {
  try {
    if (advertising === false) {
      landing = null;
      sessionStorage.removeItem(STORAGE_KEY);
    } else if (advertising === true && landing) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(landing));
    }
  } catch {
    // Storage can be blocked. The source then lasts for this page view only.
  }
}

/** Null unless the visitor has allowed advertising. */
export function currentAdSource() {
  if (readChoice()?.advertising !== true) return null;
  return landing || stored();
}

/** The fields an enquiry sends so the server can check consent and save the ad source. */
export function adSourceFields() {
  const adSource = currentAdSource();
  return adSource ? { adSource, browserId: readChoice()?.browserId } : {};
}
