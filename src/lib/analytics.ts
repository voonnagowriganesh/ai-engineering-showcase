/**
 * Privacy-first visit analytics via Umami (cookie-free, no personal data).
 *
 * Nothing loads unless VITE_UMAMI_WEBSITE_ID is set at build time, so the
 * site works identically with analytics switched off. `track()` is always
 * safe to call: it's a no-op when the script is missing or blocked.
 */

type EventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (event: string, data?: EventData) => void };
  }
}

const WEBSITE_ID: string = import.meta.env['VITE_UMAMI_WEBSITE_ID'] ?? '';
const SCRIPT_URL: string = import.meta.env['VITE_UMAMI_SCRIPT_URL'] || 'https://cloud.umami.is/script.js';
/** Comma-separated hostnames Umami should count; anything else is ignored. */
const DOMAINS: string = import.meta.env['VITE_UMAMI_DOMAINS'] ?? '';

export const analyticsEnabled = WEBSITE_ID !== '';

export function initAnalytics(): void {
  if (!analyticsEnabled || document.querySelector('script[data-website-id]')) return;
  const script = document.createElement('script');
  script.defer = true;
  script.src = SCRIPT_URL;
  script.dataset['websiteId'] = WEBSITE_ID;
  if (DOMAINS) script.dataset['domains'] = DOMAINS;
  document.head.appendChild(script);
}

export function track(event: string, data?: EventData): void {
  try {
    window.umami?.track(event, data);
  } catch {
    // Analytics must never break the page.
  }
}
