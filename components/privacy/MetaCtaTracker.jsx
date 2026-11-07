'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * MetaCtaTracker
 * Global Automatic CTA & Interaction Tracker for Meta Pixel.
 * Automatically tracks:
 * - Phone clicks (tel:) -> fbq('track', 'Contact') + fbq('trackCustom', 'PhoneCall_Click')
 * - WhatsApp clicks (wa.me) -> fbq('track', 'Contact') + fbq('trackCustom', 'WhatsApp_Click')
 * - Email clicks (mailto:) -> fbq('track', 'Contact') + fbq('trackCustom', 'Email_Click')
 * - Price lists & Brochures -> fbq('track', 'ViewContent') + fbq('trackCustom', 'PriceList_Brochure_Click')
 * - Site Visits / Bookings -> fbq('track', 'Schedule') + fbq('trackCustom', 'SiteVisit_Click')
 * - Enquiry Buttons -> fbq('track', 'Contact') + fbq('trackCustom', 'Enquiry_CTA_Click')
 * - Career Apply Clicks -> fbq('trackCustom', 'Job_Apply_Click')
 * - All other buttons & CTAs -> fbq('trackCustom', 'CTA_Click')
 * - Next.js SPA Page transitions -> fbq('track', 'PageView') + contextual ViewContent/FindLocation
 */
export default function MetaCtaTracker() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // 1. SPA Route changes: PageView and contextual page events
  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;

    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      // Don't duplicate initial PageView on first mount (layout.jsx already tracks it)
      if (!isFirstRender.current) {
        window.fbq('track', 'PageView');
      }

      // Track ViewContent for project models
      if (pathname.startsWith('/projects/') && pathname.length > 10) {
        const slug = pathname.replace(/^\/projects\//, '').replace(/\/$/, '');
        window.fbq('track', 'ViewContent', {
          content_name: slug,
          content_category: 'Project Model',
          content_type: 'product',
        });
      }

      // Track ViewContent for price lists
      if (pathname.startsWith('/price-list/') && pathname.length > 12) {
        const slug = pathname.replace(/^\/price-list\//, '').replace(/\/$/, '');
        window.fbq('track', 'ViewContent', {
          content_name: `Price List: ${slug}`,
          content_category: 'Price List',
          content_type: 'price_list',
        });
      }

      // Track FindLocation for city townships
      if (pathname.startsWith('/cities/') && pathname.length > 8) {
        const slug = pathname.replace(/^\/cities\//, '').replace(/\/$/, '');
        window.fbq('track', 'FindLocation', {
          content_name: `City: ${slug}`,
          content_category: 'City Township',
        });
      }

      // Track Contact page visit
      if (pathname === '/contact' || pathname === '/contact/') {
        window.fbq('track', 'Contact', {
          content_name: 'Contact Page View',
          content_category: 'Contact',
        });
      }
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [pathname]);

  // 2. Global CTA Click Event Listener
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pathname?.startsWith('/admin')) return;

    let lastClickTime = 0;
    let lastTarget = null;

    function handleClick(event) {
      try {
        const target = event.target?.closest?.(
          'a, button, [role="button"], input[type="submit"], input[type="button"]'
        );
        if (!target) return;

        // Skip clicks in admin or cookie banner
        if (
          window.location.pathname.startsWith('/admin') ||
          target.closest('[data-privacy-banner]') ||
          target.closest('#cookie-consent-banner') ||
          target.closest('.cookie-consent')
        ) {
          return;
        }

        // Anti-spam debounce (within 400ms on same element)
        const now = Date.now();
        if (lastTarget === target && now - lastClickTime < 400) return;
        lastClickTime = now;
        lastTarget = target;

        const href = (target.getAttribute('href') || target.dataset.href || '').trim();
        const role = target.getAttribute('role') || target.tagName.toLowerCase();
        const rawText = (
          target.innerText ||
          target.textContent ||
          target.getAttribute('aria-label') ||
          target.getAttribute('title') ||
          target.value ||
          ''
        ).trim();
        const text = rawText.replace(/\s+/g, ' ').slice(0, 100);
        const lowerText = text.toLowerCase();
        const lowerHref = href.toLowerCase();
        const currentPath = window.location.pathname;

        const fireClarity = (eventName) => {
          if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
            try {
              window.clarity('event', eventName);
            } catch {}
          }
        };

        const fireFbq = (type, eventName, params = {}) => {
          if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
            window.fbq(type, eventName, { ...params, page_path: currentPath });
            if (process.env.NODE_ENV !== 'production') {
              console.log(`[Meta Pixel ${type}]`, eventName, params);
            }
          }
          if (type === 'trackCustom') {
            fireClarity(eventName);
          }
        };

        // A. Phone calls (tel:...)
        if (lowerHref.startsWith('tel:')) {
          const phone = href.replace(/^tel:/i, '').replace(/[^0-9+]/g, '');
          fireFbq('track', 'Contact', {
            content_name: 'Phone Call',
            content_category: 'Contact',
            phone_number: phone,
          });
          fireFbq('trackCustom', 'PhoneCall_Click', {
            phone_number: phone,
            cta_text: text || 'Call',
          });
          return;
        }

        // B. WhatsApp
        if (
          lowerHref.includes('wa.me') ||
          lowerHref.includes('whatsapp.com') ||
          lowerText.includes('whatsapp')
        ) {
          fireFbq('track', 'Contact', {
            content_name: 'WhatsApp',
            content_category: 'Contact',
          });
          fireFbq('trackCustom', 'WhatsApp_Click', {
            cta_text: text || 'WhatsApp',
            destination_url: href,
          });
          return;
        }

        // C. Email (mailto:...)
        if (lowerHref.startsWith('mailto:')) {
          const email = href.replace(/^mailto:/i, '').split('?')[0];
          fireFbq('track', 'Contact', {
            content_name: 'Email Enquiry',
            content_category: 'Contact',
            email: email,
          });
          fireFbq('trackCustom', 'Email_Click', {
            email: email,
            cta_text: text || 'Email',
          });
          return;
        }

        // D. Price List / Brochure / Master Plan / PDF
        if (
          lowerHref.includes('/price-list') ||
          lowerHref.endsWith('.pdf') ||
          lowerText.includes('price list') ||
          lowerText.includes('brochure') ||
          lowerText.includes('master plan') ||
          lowerText.includes('download')
        ) {
          fireFbq('track', 'ViewContent', {
            content_name: text || 'Price List / Brochure',
            content_category: 'Documentation',
            content_type: 'document',
          });
          fireFbq('trackCustom', 'PriceList_Brochure_Click', {
            cta_text: text,
            destination_url: href,
          });
          return;
        }

        // E. Site Visit / Schedule
        if (
          lowerText.includes('site visit') ||
          lowerText.includes('book visit') ||
          lowerText.includes('schedule') ||
          lowerText.includes('book now')
        ) {
          fireFbq('track', 'Schedule', {
            content_name: text || 'Site Visit',
            content_category: 'Booking',
          });
          fireFbq('trackCustom', 'SiteVisit_Click', {
            cta_text: text,
            destination_url: href,
          });
          return;
        }

        // F. Enquiry / Contact CTA
        if (
          lowerText.includes('enquire') ||
          lowerText.includes('get in touch') ||
          lowerText.includes('contact us') ||
          lowerText.includes('contact our team') ||
          lowerText.includes('request') ||
          lowerText.includes('call project team')
        ) {
          fireFbq('track', 'Contact', {
            content_name: text || 'Enquiry CTA',
            content_category: 'CTA',
          });
          fireFbq('trackCustom', 'Enquiry_CTA_Click', {
            cta_text: text,
            destination_url: href,
          });
          return;
        }

        // G. Careers / Apply
        if (lowerText.includes('apply now') || lowerHref.includes('/careers/apply')) {
          fireFbq('trackCustom', 'Job_Apply_Click', {
            cta_text: text || 'Apply Now',
            destination_url: href,
          });
          return;
        }

        // H. All other Buttons & Action links
        const isButton =
          target.tagName === 'BUTTON' ||
          target.getAttribute('role') === 'button' ||
          target.type === 'submit';
        const hasButtonClass = /elementor-button|btn|button|pill|cta/i.test(
          target.className || ''
        );

        if (isButton || hasButtonClass) {
          // Ignore menu toggle hamburger, close icons, carousel navigation arrows
          if (
            /hamburger|menu-mobile|close|dismiss|fab|carouselArrow/i.test(
              target.className || ''
            ) ||
            /open navigation|close navigation/i.test(lowerText)
          ) {
            return;
          }
          if (text && text.length >= 2) {
            fireFbq('trackCustom', 'CTA_Click', {
              cta_text: text,
              cta_role: role,
              destination_url: href || '',
            });
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[MetaCtaTracker error]', err);
        }
      }
    }

    document.addEventListener('click', handleClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, [pathname]);

  return null;
}

