/**
 * Privacy-friendly analytics (Umami). Everything here is a no-op until
 * VITE_UMAMI_WEBSITE_ID is set, so the site ships ready for analytics and
 * turning it on is a configuration change, not a code change.
 */

type EventData = Record<string, string | number | boolean>;

const DEFAULT_SCRIPT_URL = 'https://cloud.umami.is/script.js';

export const analyticsEnabled = Boolean(import.meta.env.VITE_UMAMI_WEBSITE_ID);

export function initAnalytics(): void {
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
  if (!websiteId || typeof document === 'undefined') return;
  if (document.querySelector('script[data-website-id]')) return;

  const script = document.createElement('script');
  script.defer = true;
  script.src = import.meta.env.VITE_UMAMI_SCRIPT_URL || DEFAULT_SCRIPT_URL;
  script.dataset.websiteId = websiteId;
  document.head.appendChild(script);
}

/** Records a custom event. Silently does nothing if Umami is absent or blocked. */
export function track(event: string, data?: EventData): void {
  try {
    window.umami?.track(event, data);
  } catch {
    // An analytics failure must never break the page.
  }
}
