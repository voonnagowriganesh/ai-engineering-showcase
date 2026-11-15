import { useEffect, useState } from 'react';

/** Start anyway if no preloader ever announces the reveal. */
const FALLBACK_MS = 8000;

/**
 * True once the preloader starts uncovering the page (App.tsx sets
 * `html[data-revealed]` and fires `app:revealed`). Above-the-fold entrance
 * effects wait for this so they play in view instead of behind the loader.
 */
export function usePageRevealed(): boolean {
  const [revealed, setRevealed] = useState(() => document.documentElement.dataset['revealed'] === 'true');

  useEffect(() => {
    if (revealed) return undefined;
    const reveal = (): void => setRevealed(true);
    window.addEventListener('app:revealed', reveal, { once: true });
    const fallback = window.setTimeout(reveal, FALLBACK_MS);
    return () => {
      window.removeEventListener('app:revealed', reveal);
      window.clearTimeout(fallback);
    };
  }, [revealed]);

  return revealed;
}
