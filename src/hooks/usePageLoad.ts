import { useEffect, useRef, useState } from 'react';

export interface PageLoadState {
  /** 0..100, eased toward the real completion figure. */
  readonly progress: number;
  /** True once loading finished *and* the minimum display time has elapsed. */
  readonly complete: boolean;
}

export interface PageLoadOptions {
  /** Hold the preloader at least this long so it reads as intentional. */
  readonly minimumDurationMs?: number;
  /** Give up waiting on a slow network and let the site through. */
  readonly maximumDurationMs?: number;
}

/**
 * Tracks genuine readiness rather than animating a decorative timer.
 *
 * Three real signals are combined:
 *   - `document.readyState` reaching "complete"
 *   - `document.fonts.ready` (otherwise the headline reflows after the reveal)
 *   - decoded state of every <img> already in the document
 *
 * The reported number is eased toward the real figure so it never jumps from
 * 12 to 100, and it is floored by elapsed time so a cached load still shows a
 * brief, deliberate sequence instead of a flash.
 */
export function usePageLoad({
  minimumDurationMs = 1900,
  maximumDurationMs = 7000,
}: PageLoadOptions = {}): PageLoadState {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const startedAtRef = useRef(performance.now());

  useEffect(() => {
    let cancelled = false;
    let frame = 0;

    // Real completion, 0..1, updated as each signal resolves.
    let documentReady = document.readyState === 'complete';
    let fontsReady = false;
    let imagesReady = false;

    const computeTarget = (): number => {
      const signals = [documentReady, fontsReady, imagesReady];
      const resolved = signals.filter(Boolean).length;
      const elapsed = performance.now() - startedAtRef.current;

      // Never let the bar sit still: time contributes a slowly rising floor.
      const timeFloor = Math.min(0.92, elapsed / minimumDurationMs);
      return Math.max(resolved / signals.length, timeFloor);
    };

    /* ── Signal: document ─────────────────────────────────────────────── */
    const handleLoad = (): void => {
      documentReady = true;
    };
    if (!documentReady) window.addEventListener('load', handleLoad, { once: true });

    /* ── Signal: fonts ────────────────────────────────────────────────── */
    if ('fonts' in document) {
      void document.fonts.ready.then(() => {
        fontsReady = true;
      });
    } else {
      fontsReady = true;
    }

    /* ── Signal: images ───────────────────────────────────────────────── */
    // `loading="lazy"` images below the fold are deliberately not fetched by
    // the browser until they near the viewport — counting them here made the
    // preloader wait on images a visitor won't see for a while yet, crawling
    // toward the 7s timeout on any page with more than a screenful of them.
    const images = Array.from(document.images).filter((image) => image.loading !== 'lazy');
    if (images.length === 0) {
      imagesReady = true;
    } else {
      let settled = 0;
      const onSettled = (): void => {
        settled += 1;
        if (settled >= images.length) imagesReady = true;
      };
      for (const image of images) {
        if (image.complete) onSettled();
        else {
          image.addEventListener('load', onSettled, { once: true });
          // A broken image must not hold the whole site hostage.
          image.addEventListener('error', onSettled, { once: true });
        }
      }
    }

    /* ── Easing loop ──────────────────────────────────────────────────── */
    let eased = 0;

    const tick = (): void => {
      if (cancelled) return;

      const elapsed = performance.now() - startedAtRef.current;
      const target = computeTarget();

      eased += (target - eased) * 0.08;

      const timedOut = elapsed >= maximumDurationMs;
      const everythingReady = documentReady && fontsReady && imagesReady;
      const minimumMet = elapsed >= minimumDurationMs;

      if ((everythingReady && minimumMet) || timedOut) {
        setProgress(100);
        // One frame at 100% before handing over, so the number is actually seen.
        window.setTimeout(() => {
          if (!cancelled) setComplete(true);
        }, 260);
        return;
      }

      setProgress(Math.min(99, Math.round(eased * 100)));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('load', handleLoad);
    };
  }, [minimumDurationMs, maximumDurationMs]);

  return { progress, complete };
}
