// What this deployment actually has switched on. A category is only offered, and the
// policy only mentions it, when its tag ID is set. Safe to import from client code.
import { COOKIE_CATEGORY_TEXT, PURPOSES } from './notices';

// A malformed ID is treated as unset, because these values end up in script URLs.
const tagId = (value, pattern) => {
  const id = (value || '').trim();
  return pattern.test(id) ? id : null;
};

// Next.js only inlines NEXT_PUBLIC_ values written out in full like this.
export const TAG_IDS = {
  ga4: tagId(process.env.NEXT_PUBLIC_GA4_ID, /^G-[A-Z0-9]{4,20}$/),
  googleAds: tagId(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID, /^AW-\d{5,20}$/),
  googleAdsLeadLabel: tagId(process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL, /^[\w-]{4,40}$/),
  metaPixel: tagId(process.env.NEXT_PUBLIC_META_PIXEL_ID || '4516919088573710', /^\d{5,20}$/),
};

export const CATEGORY_PURPOSES = {
  media: PURPOSES.MEDIA,
  analytics: PURPOSES.ANALYTICS,
  advertising: PURPOSES.ADVERTISING,
};

export const COOKIE_PURPOSES = Object.values(CATEGORY_PURPOSES);

// The tag cookies this site knows about, by category. Only their names are ever logged.
export const TRACKED_COOKIES = {
  analytics: /^(_ga|_ga_.*|_gid|_gat.*)$/,
  advertising: /^(_gcl_.*|_fbp|_fbc)$/,
};

export const AD_CHANNELS = ['google_ads', 'meta', 'campaign'];

// What the visitor activity log accepts from each tag, and the categories it can run under.
export const TAG_EVENTS = {
  google_tag: { categories: ['analytics', 'advertising'], events: ['script_loaded', 'script_failed'] },
  google_analytics: { categories: ['analytics'], events: ['configured', 'generate_lead'] },
  google_ads: { categories: ['advertising'], events: ['configured', 'page_view', 'conversion'] },
  meta_pixel: { categories: ['advertising'], events: ['script_loaded', 'script_failed', 'initialised', 'PageView', 'Lead'] },
};

export const OFFERED_CATEGORIES = [
  'media',
  ...(TAG_IDS.ga4 ? ['analytics'] : []),
  ...(TAG_IDS.googleAds || TAG_IDS.metaPixel ? ['advertising'] : []),
];

const advertiserNames = (language) => {
  const names = [TAG_IDS.googleAds && 'Google Ads', TAG_IDS.metaPixel && 'Meta (Facebook, Instagram)'].filter(Boolean);
  return names.join(language === 'hi' ? ' और ' : ' and ');
};

export function categoryText(category, language = 'en') {
  const { name, description } = COOKIE_CATEGORY_TEXT[category][language];
  return { name, description: typeof description === 'function' ? description(advertiserNames(language)) : description };
}

// Every cookie or storage item the site or its enabled tags are known to use. Providers
// can change theirs, so re-check this list against the live site before relying on it.
const COOKIES = [
  { name: 'vastu_dpdp_cookie_consent_v1', provider: 'Vastu Vihar', category: 'necessary', type: 'Browser storage', purpose: 'Remembers your cookie choices and a random consent ID', duration: 'Until you clear it' },
  { name: 'vv_admin_session', provider: 'Vastu Vihar', category: 'necessary', type: 'Cookie', purpose: 'Keeps authorised staff signed in. Not set for visitors', duration: '10 hours' },
  { name: 'YouTube, Vimeo and Google Maps cookies', provider: 'Google, Vimeo', category: 'media', type: 'Third-party cookies', purpose: 'Set by these services when their content loads', duration: 'Set by the provider' },
  ...(TAG_IDS.googleAds || TAG_IDS.metaPixel
    ? [{ name: 'vastu_ad_source_v1', provider: 'Vastu Vihar', category: 'advertising', type: 'Browser storage', purpose: 'Remembers the advert or campaign that brought you here during this visit', duration: 'Until you close the tab' }]
    : []),
  ...(TAG_IDS.ga4
    ? [
        { name: '_ga', provider: 'Google', category: 'analytics', type: 'Cookie', purpose: 'Tells visitors apart in Google Analytics', duration: 'Up to 2 years' },
        { name: '_ga_*', provider: 'Google', category: 'analytics', type: 'Cookie', purpose: 'Keeps track of the current visit in Google Analytics', duration: 'Up to 2 years' },
      ]
    : []),
  ...(TAG_IDS.googleAds
    ? [
        { name: '_gcl_au', provider: 'Google', category: 'advertising', type: 'Cookie', purpose: 'Measures advert conversions', duration: 'Up to 90 days' },
        { name: 'Google Ads cookies (such as IDE)', provider: 'Google', category: 'advertising', type: 'Third-party cookies', purpose: 'Remarketing and advert measurement, on Google domains', duration: 'Set by the provider' },
      ]
    : []),
  ...(TAG_IDS.metaPixel
    ? [
        { name: '_fbp', provider: 'Meta', category: 'advertising', type: 'Cookie', purpose: 'Remarketing and advert measurement', duration: 'Up to 90 days' },
        { name: '_fbc', provider: 'Meta', category: 'advertising', type: 'Cookie', purpose: 'Records that you arrived from a Meta advert', duration: 'Up to 90 days' },
        { name: 'Meta cookies (such as fr)', provider: 'Meta', category: 'advertising', type: 'Third-party cookies', purpose: 'Remarketing and advert measurement, on Meta domains', duration: 'Set by the provider' },
      ]
    : []),
];

export const COOKIE_INVENTORY = COOKIES;
