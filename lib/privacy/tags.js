'use client';

// The only place analytics and advertising tags are loaded. Nothing here runs until
// applyTagConsent is called with a category the visitor has allowed.
// Google Tag Manager is deliberately not supported: it could add tags from its own
// dashboard, out of reach of this consent logic, the policy and the review process.
import { TAG_IDS } from './cookieConfig.js';

const { ga4, googleAds, googleAdsLeadLabel, metaPixel } = TAG_IDS;

const ANALYTICS_COOKIES = /^(_ga|_ga_.*|_gid|_gat.*)$/;
const ADVERTISING_COOKIES = /^(_gcl_.*|_fbp|_fbc)$/;

let allowed = { analytics: false, advertising: false };
let lastAdPath = null;
const addedScripts = new Set();
const configured = new Set();

function addScript(src) {
  if (addedScripts.has(src)) return;
  addedScripts.add(src);
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function startGoogle(id) {
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // Google's library only reads the arguments object, not an array.
      window.dataLayer.push(arguments); // eslint-disable-line prefer-rest-params
    };
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
    window.gtag('js', new Date());
  }
  addScript(`https://www.googletagmanager.com/gtag/js?id=${id}`);
}

function startMeta() {
  if (window.fbq) return;
  const fbq = function fbq() {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments); // eslint-disable-line prefer-rest-params
    else fbq.queue.push(arguments); // eslint-disable-line prefer-rest-params
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = window._fbq || fbq;
  addScript('https://connect.facebook.net/en_US/fbevents.js');
  // Without this, the pixel reads form fields and buttons on the page by itself,
  // which would break the promise that form details are not sent to Meta.
  fbq('set', 'autoConfig', false, metaPixel);
  fbq('init', metaPixel);
}

function clearCookies(pattern) {
  const parts = window.location.hostname.split('.');
  const domains = [''];
  for (let i = 0; i < parts.length - 1; i += 1) domains.push(`; domain=.${parts.slice(i).join('.')}`);
  for (const entry of document.cookie.split(';')) {
    const name = entry.split('=')[0].trim();
    if (!pattern.test(name)) continue;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
  }
}

/** Starts or stops each tag to match the visitor's choice. Safe to call repeatedly. */
export function applyTagConsent({ analytics, advertising }) {
  const useAnalytics = Boolean(analytics && ga4);
  const useGoogleAds = Boolean(advertising && googleAds);
  allowed = { analytics: useAnalytics, advertising: Boolean(advertising && (googleAds || metaPixel)) };

  if (useAnalytics || useGoogleAds) startGoogle(useAnalytics ? ga4 : googleAds);

  // A library that has already loaded cannot be unloaded, so it is told to stop instead.
  if (ga4) window[`ga-disable-${ga4}`] = !useAnalytics;
  if (googleAds) window[`ga-disable-${googleAds}`] = !useGoogleAds;

  if (window.gtag) {
    const ads = useGoogleAds ? 'granted' : 'denied';
    window.gtag('consent', 'update', {
      analytics_storage: useAnalytics ? 'granted' : 'denied',
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads,
    });
    if (useAnalytics && !configured.has(ga4)) {
      configured.add(ga4);
      window.gtag('config', ga4);
    }
    if (useGoogleAds && !configured.has(googleAds)) {
      configured.add(googleAds);
      window.gtag('config', googleAds, { send_page_view: false });
    }
  }

  if (advertising && metaPixel) {
    startMeta();
    window.fbq('consent', 'grant');
  } else if (window.fbq) {
    window.fbq('consent', 'revoke');
  }

  if (!allowed.analytics) clearCookies(ANALYTICS_COOKIES);
  if (!allowed.advertising) {
    clearCookies(ADVERTISING_COOKIES);
    lastAdPath = null;
  }
}

/** Google Analytics counts page changes itself. The advertising tags are told here. */
export function trackAdPageView(path) {
  if (!allowed.advertising || lastAdPath === path) return;
  lastAdPath = path;
  if (googleAds) window.gtag('event', 'page_view', { send_to: googleAds });
  if (metaPixel) window.fbq('track', 'PageView');
}

/** Reports that an enquiry was sent. Carries no form data, only the fact that it happened. */
export function trackLead() {
  if (allowed.analytics) window.gtag('event', 'generate_lead', { send_to: ga4 });
  if (!allowed.advertising) return;
  if (googleAds && googleAdsLeadLabel) window.gtag('event', 'conversion', { send_to: `${googleAds}/${googleAdsLeadLabel}` });
  if (metaPixel) window.fbq('track', 'Lead');
}
