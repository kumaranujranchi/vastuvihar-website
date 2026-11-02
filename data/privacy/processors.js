// Inventory of everything that receives personal data from this website. Keep this
// in step with lib/privacy/connectors.ts. It feeds the admin panel and access summaries.
import { TAG_IDS } from '@/lib/privacy/cookieConfig';

export const PRIVACY_CONTACT = {
  company: 'Technoculture Building Centre Private Limited (Vastu Vihar)',
  officerTitle: 'Data Protection & Grievance Redressal Officer',
  // Set the officer's name once the organisation has appointed one.
  officerName: null,
  email: 'privacy@vastuvihar.org',
  escalationEmail: 'complaint.officer@vastuvihar.org',
  phone: '+91 95340 95340',
  phoneHref: 'tel:+919534095340',
  address: '417, 419, 4th Floor, Aashiana Tower, Exhibition Road, Old Jakkanpur, Lodipur, Patna, Bihar - 800001, India',
  grievanceResponseDays: 30,
};

export const PROCESSORS = [
  {
    name: 'Website hosting provider (to be confirmed before launch)',
    role: 'Data Processor',
    purpose: 'Hosting the website, database and private resume storage',
    data: 'All data submitted through website forms',
    receivesPersonalData: true,
    trigger: 'Every form submission',
    legalBasis: 'Same basis as the underlying form',
    contract: 'Pending: sign a data processing contract with the chosen host',
    location: 'To be confirmed',
  },
  {
    name: 'Google (YouTube, Google Maps)',
    role: 'Independent third party',
    purpose: 'Showing videos and maps',
    data: 'IP address, browser details and cookies set by Google',
    receivesPersonalData: false,
    trigger: 'Only after the visitor allows third-party media, or clicks to play a video',
    legalBasis: 'Consent',
    contract: 'Google standard terms',
    location: 'Outside India (review against government transfer restrictions)',
  },
  {
    name: 'Vimeo',
    role: 'Independent third party',
    purpose: 'Showing videos opened in the on-page video player',
    data: 'IP address, browser details and cookies set by Vimeo',
    receivesPersonalData: false,
    trigger: 'Only when the visitor clicks to play a Vimeo video',
    legalBasis: 'Consent',
    contract: 'Vimeo standard terms',
    location: 'Outside India (review against government transfer restrictions)',
  },
  {
    name: 'WhatsApp (Meta)',
    role: 'Independent third party',
    purpose: 'Sales staff replying to an enquirer through the WhatsApp button in the admin panel',
    data: 'Enquirer name and phone number, entered into the staff member\'s own WhatsApp',
    receivesPersonalData: true,
    trigger: 'Only when an authorised staff member clicks the button',
    legalBasis: 'Same basis as the enquiry',
    contract: 'Pending: decide whether staff may use WhatsApp for enquiry replies',
    location: 'Outside India (review against government transfer restrictions)',
  },
  // These tags hold no form data, so a contact's access summary cannot link them to a person.
  ...(TAG_IDS.ga4
    ? [{
        name: 'Google Analytics',
        role: 'Pending: confirm under Google\'s terms',
        purpose: 'Counting visits and page use',
        data: 'IP address, browser details, pages viewed, cookies, and the fact that an enquiry was sent',
        receivesPersonalData: false,
        trigger: 'Only after the visitor allows Analytics',
        legalBasis: 'Consent',
        contract: 'Pending: accept and review Google\'s data processing terms',
        location: 'Outside India (review against government transfer restrictions)',
      }]
    : []),
  ...(TAG_IDS.googleAds
    ? [{
        name: 'Google Ads',
        role: 'Pending: confirm under Google\'s terms',
        purpose: 'Remarketing and measuring adverts',
        data: 'IP address, browser details, pages viewed, cookies, and the fact that an enquiry was sent',
        receivesPersonalData: false,
        trigger: 'Only after the visitor allows Advertising & Remarketing',
        legalBasis: 'Consent',
        contract: 'Pending: accept and review Google\'s advertising terms',
        location: 'Outside India (review against government transfer restrictions)',
      }]
    : []),
  ...(TAG_IDS.metaPixel
    ? [{
        name: 'Meta Pixel (Facebook, Instagram)',
        role: 'Pending: confirm under Meta\'s terms',
        purpose: 'Remarketing and measuring adverts',
        data: 'IP address, browser details, pages viewed, cookies, and the fact that an enquiry was sent',
        receivesPersonalData: false,
        trigger: 'Only after the visitor allows Advertising & Remarketing',
        legalBasis: 'Consent',
        contract: 'Pending: accept and review Meta\'s business terms',
        location: 'Outside India (review against government transfer restrictions)',
      }]
    : []),
];

export const REMOVED_INTEGRATIONS = [
  { name: 'ip-api.com', change: 'Removed. Visitor IP addresses were sent over plain HTTP for a country lookup on every enquiry.' },
  { name: 'Google Gemini (via /api/chat)', change: 'Removed. No page used this endpoint, but it was publicly reachable and stored messages.' },
];
