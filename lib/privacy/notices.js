// Single source of truth for consent wording. Safe to import from client code.
// Changing any wording in this file requires a new NOTICE_VERSION, because the
// version is stored against every consent record as proof of what was shown.
export const NOTICE_VERSION = '2026-11-v4';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
];

export const PURPOSES = {
  ENQUIRY: 'enquiry_response',
  APPLICATION: 'recruitment',
  COMMENT: 'blog_comment',
  MARKETING: 'marketing_communications',
  NEWSLETTER: 'newsletter',
  MEDIA: 'third_party_media',
  ANALYTICS: 'analytics_cookies',
  ADVERTISING: 'remarketing_cookies',
};

const CONTROLLER = {
  en: 'Technoculture Building Centre Private Limited (Vastu Vihar)',
  hi: 'टेक्नोकल्चर बिल्डिंग सेंटर प्राइवेट लिमिटेड (वास्तु विहार)',
};

const RIGHTS = {
  en: 'You can withdraw consent or ask us to access, correct or erase your data, or raise a grievance, on our Your Data Rights page. You may also complain to the Data Protection Board of India.',
  hi: 'आप अपनी सहमति वापस ले सकते हैं, अपने डेटा की जानकारी, सुधार या मिटाने का अनुरोध कर सकते हैं, या शिकायत दर्ज कर सकते हैं। इसके लिए "आपके डेटा अधिकार" पृष्ठ देखें। आप भारतीय डेटा संरक्षण बोर्ड से भी शिकायत कर सकते हैं।',
};

export const FORM_NOTICES = {
  enquiry: {
    purpose: PURPOSES.ENQUIRY,
    en: {
      notice: `${CONTROLLER.en} will use the details in this form only to respond to your enquiry: to contact you and share the project, price or site visit information you asked for. Items marked * are needed to do this. The rest are optional. ${RIGHTS.en}`,
      consent: 'I am 18 or older and I consent to Vastu Vihar using these details to respond to my enquiry. *',
    },
    hi: {
      notice: `${CONTROLLER.hi} इस फ़ॉर्म के विवरण का उपयोग केवल आपकी पूछताछ का उत्तर देने के लिए करेगा: आपसे संपर्क करने और आपके द्वारा मांगी गई परियोजना, मूल्य या साइट विज़िट की जानकारी देने के लिए। * से चिह्नित जानकारी इसके लिए आवश्यक है। शेष वैकल्पिक है। ${RIGHTS.hi}`,
      consent: 'मेरी आयु 18 वर्ष या उससे अधिक है और मैं वास्तु विहार को मेरी पूछताछ का उत्तर देने के लिए इन विवरणों का उपयोग करने की सहमति देता/देती हूँ। *',
    },
  },
  application: {
    purpose: PURPOSES.APPLICATION,
    en: {
      notice: `${CONTROLLER.en} will use your details, resume and any note you add only to assess this application and contact you about it. Your resume is stored privately and only authorised HR staff can open it. Items marked * are needed to do this. ${RIGHTS.en}`,
      consent: 'I am 18 or older and I consent to Vastu Vihar using this information to assess my job application. *',
    },
    hi: {
      notice: `${CONTROLLER.hi} आपके विवरण, रिज़्यूमे और आपके द्वारा जोड़े गए नोट का उपयोग केवल इस आवेदन के मूल्यांकन और इसके बारे में आपसे संपर्क करने के लिए करेगा। आपका रिज़्यूमे निजी रूप से रखा जाता है और केवल अधिकृत एचआर कर्मचारी ही इसे खोल सकते हैं। * से चिह्नित जानकारी इसके लिए आवश्यक है। ${RIGHTS.hi}`,
      consent: 'मेरी आयु 18 वर्ष या उससे अधिक है और मैं वास्तु विहार को मेरे नौकरी आवेदन के मूल्यांकन के लिए इस जानकारी का उपयोग करने की सहमति देता/देती हूँ। *',
    },
  },
  comment: {
    purpose: PURPOSES.COMMENT,
    en: {
      notice: `${CONTROLLER.en} will review your comment and, if approved, publish it with the name you enter, where anyone can read it. Your email is optional, is never published, and is used only if we need to contact you about this comment or a request you make. ${RIGHTS.en}`,
      consent: 'I am 18 or older and I consent to Vastu Vihar publishing my name and comment on this page. *',
    },
    hi: {
      notice: `${CONTROLLER.hi} आपकी टिप्पणी की समीक्षा करेगा और स्वीकृत होने पर उसे आपके द्वारा दर्ज नाम के साथ प्रकाशित करेगा, जहाँ कोई भी उसे पढ़ सकता है। आपका ईमेल वैकल्पिक है, कभी प्रकाशित नहीं होता, और इसका उपयोग केवल तब होता है जब हमें इस टिप्पणी या आपके किसी अनुरोध के बारे में आपसे संपर्क करना हो। ${RIGHTS.hi}`,
      consent: 'मेरी आयु 18 वर्ष या उससे अधिक है और मैं वास्तु विहार को इस पृष्ठ पर मेरा नाम और टिप्पणी प्रकाशित करने की सहमति देता/देती हूँ। *',
    },
  },
};

export const MARKETING_CONSENT = {
  en: 'Optional: send me Vastu Vihar offers and new project updates by call, SMS, WhatsApp or email. You can still submit this form without ticking this, and you can opt out at any time.',
  hi: 'वैकल्पिक: मुझे कॉल, एसएमएस, व्हाट्सएप या ईमेल से वास्तु विहार के ऑफ़र और नई परियोजनाओं की जानकारी भेजें। इसे चुने बिना भी आप यह फ़ॉर्म जमा कर सकते हैं, और किसी भी समय इससे बाहर हो सकते हैं।',
};

export const NOTICE_LABELS = {
  en: { policy: 'Privacy Policy', rights: 'Your Data Rights', other: 'Need this notice in another language? Write to privacy@vastuvihar.org.' },
  hi: { policy: 'गोपनीयता नीति', rights: 'आपके डेटा अधिकार', other: 'क्या आपको यह सूचना किसी अन्य भाषा में चाहिए? privacy@vastuvihar.org पर लिखें।' },
};

export const COOKIE_NOTICE = {
  en: 'Optional cookies and third-party services stay off until you allow them. You can adjust your preferences below anytime.',
  hi: 'वैकल्पिक कुकीज़ और सेवाएँ आपकी अनुमति तक बंद रहती हैं। आप नीचे कभी भी अपनी पसंद बदल सकते हैं।',
};

// `advertisers` is filled in with the platforms actually switched on for this site.
export const COOKIE_CATEGORY_TEXT = {
  necessary: {
    en: {
      name: 'Strictly Necessary',
      description: 'Remembers your preferences and keeps staff signed in. Always on.',
    },
    hi: {
      name: 'अत्यंत आवश्यक',
      description: 'आपकी पसंद याद रखता है और कर्मचारियों को साइन इन रखता है। हमेशा चालू।',
    },
  },
  media: {
    en: {
      name: 'Third-Party Videos & Maps',
      description: () => 'YouTube, Vimeo and Google Maps. These services may set cookies to display interactive media.',
    },
    hi: {
      name: 'तृतीय-पक्ष वीडियो और मानचित्र',
      description: () => 'YouTube, Vimeo और Google Maps। मीडिया लोड करने के लिए कुकीज़ सेट कर सकते हैं।',
    },
  },
  analytics: {
    en: {
      name: 'Analytics',
      description: () => 'Counts visits and helps improve site performance. Data is aggregated and anonymised.',
    },
    hi: {
      name: 'एनालिटिक्स',
      description: () => 'विज़िट गिनता है और अनुभव बेहतर बनाने में मदद करता है। डेटा अज्ञात रहता है।',
    },
  },
  advertising: {
    en: {
      name: 'Advertising & Remarketing',
      description: (advertisers) => `${advertisers} help measure campaigns and show relevant adverts. Personal form details are never shared.`,
    },
    hi: {
      name: 'विज्ञापन और रीमार्केटिंग',
      description: (advertisers) => `${advertisers} अभियानों को मापने और प्रासंगिक विज्ञापन दिखाने में मदद करते हैं। फ़ॉर्म जानकारी साझा नहीं की जाती।`,
    },
  },
};
