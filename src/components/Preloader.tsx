import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/** Status lines, each shown once the counter passes its threshold. */
const STAGES: readonly { at: number; label: string }[] = [
  { at: 0, label: 'Setting type' },
  { at: 24, label: 'Inking the cover' },
  { at: 46, label: 'Binding projects' },
  { at: 66, label: 'Pressing certificates' },
  { at: 86, label: 'Final proof' },
  { at: 100, label: 'Ready' },
];

const RING_RADIUS = 46;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
/** Delay before the sheet starts lifting, so the content fades first. */
const LIFT_DELAY_MS = 260;
const LIFT_DURATION_S = 1.0;
const EASE_CURTAIN = [0.83, 0, 0.17, 1] as const;

function usePrefersReducedMotion() {
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  return reduced;
}

/**
 * Tracks real page readiness (document load, web fonts, and every eager
 * <img> such as the hero portrait), eased so the number never jumps, and
 * floored by elapsed time so a cached load still shows a deliberate sequence.
 * Lazy images are skipped on purpose: the browser won't fetch them until they
 * near the viewport, so waiting on them would stall toward the timeout.
 */
export function usePageLoad(minimumDurationMs = 1700, maximumDurationMs = 7000) {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const startedAt = useRef(performance.now());

  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    let documentReady = document.readyState === 'complete';
    let fontsReady = !('fonts' in document);
    let imagesReady = false;

    const onLoad = () => {
      documentReady = true;
    };
    if (!documentReady) window.addEventListener('load', onLoad, { once: true });
    if (!fontsReady) {
      void document.fonts.ready.then(() => {
        fontsReady = true;
      });
    }

    const images = Array.from(document.images).filter((img) => img.loading !== 'lazy');
    if (images.length === 0) imagesReady = true;
    else {
      let settled = 0;
      const onSettled = () => {
        settled += 1;
        if (settled >= images.length) imagesReady = true;
      };
      for (const img of images) {
        if (img.complete) onSettled();
        else {
          img.addEventListener('load', onSettled, { once: true });
          // A broken image must not hold the whole site hostage.
          img.addEventListener('error', onSettled, { once: true });
        }
      }
    }

    let eased = 0;
    let last = performance.now();
    const tick = () => {
      if (cancelled) return;
      const now = performance.now();
      const dt = Math.min(100, now - last);
      last = now;
      const elapsed = now - startedAt.current;
      const ready = documentReady && fontsReady && imagesReady;
      const finishing = ready && elapsed >= minimumDurationMs;
      const resolved = [documentReady, fontsReady, imagesReady].filter(Boolean).length / 3;
      // Before finishing, follow whichever is slower: real readiness (with a
      // slow creep so a slow network never looks frozen) or elapsed time (so
      // a cached load climbs evenly instead of racing to 99 and waiting).
      const timeCap = 0.97 * Math.min(1, elapsed / minimumDurationMs);
      const real = Math.max(resolved, Math.min(0.9, elapsed / maximumDurationMs));
      const target = finishing ? 1 : Math.min(timeCap, real);
      // Time-based easing, so a slow or throttled device counts up just as
      // smoothly instead of lagging and then jumping straight to 100.
      eased += (target - eased) * (1 - (1 - (finishing ? 0.28 : 0.08)) ** (dt / (1000 / 60)));

      if ((finishing && eased >= 0.985) || elapsed >= maximumDurationMs) {
        setProgress(100);
        // Hold 100 for a beat so it's actually read before the exit.
        window.setTimeout(() => {
          if (!cancelled) setComplete(true);
        }, 220);
        return;
      }
      setProgress(Math.min(99, Math.round(eased * 100)));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('load', onLoad);
    };
  }, [minimumDurationMs, maximumDurationMs]);

  return { progress, complete };
}

/** Tells the rest of the page (e.g. the hero's text animation) that it is now visible. */
function announceReveal() {
  if (document.documentElement.dataset.revealed === 'true') return;
  document.documentElement.dataset.revealed = 'true';
  window.dispatchEvent(new Event('app:revealed'));
}

interface PreloaderProps {
  progress: number;
  complete: boolean;
}

/**
 * Editorial boot screen: a "VG" monogram set in Fraunces inside a hairline
 * ring that inks itself as the page loads, corner furniture in mono like a
 * magazine cover, and a large folio-style counter. On completion the content
 * fades and the whole sheet lifts away to reveal the hero. Reduced motion gets
 * a plain fade with the same information.
 */
export function Preloader({ progress, complete }: PreloaderProps) {
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(true);
  const year = useMemo(() => new Date().getFullYear(), []);
  const stage = useMemo(() => [...STAGES].reverse().find((s) => progress >= s.at) ?? STAGES[0], [progress]);
  const pct = Math.min(100, Math.round(progress));

  useEffect(() => {
    if (!complete) return undefined;
    const reveal = window.setTimeout(announceReveal, reduced ? 0 : LIFT_DELAY_MS);
    const unmount = window.setTimeout(() => setMounted(false), reduced ? 400 : LIFT_DELAY_MS + LIFT_DURATION_S * 1000 + 80);
    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(unmount);
    };
  }, [complete, reduced]);

  if (!mounted) return null;

  const sheetAnimate = complete ? (reduced ? { opacity: 0 } : { y: '-100%' }) : { y: 0, opacity: 1 };
  const sheetTransition = reduced
    ? { duration: 0.35 }
    : { duration: LIFT_DURATION_S, ease: EASE_CURTAIN, delay: LIFT_DELAY_MS / 1000 };

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-busy={!complete}
      aria-label={complete ? 'Portfolio loaded' : `Loading portfolio, ${pct}%`}
      className={`fixed inset-0 z-[300] ${complete ? 'pointer-events-none' : ''}`}
      initial={false}
      animate={sheetAnimate}
      transition={sheetTransition}
    >
      {/* The sheet */}
      <div className="absolute inset-0 bg-paper">
        <div className="grain-overlay" />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(67,56,202,0.10),rgba(232,121,60,0.06)_45%,transparent_70%)] blur-2xl"
        />
      </div>

      {/* Leading edge of the lifting sheet: a signal→amber hairline. */}
      {!reduced ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-signal via-signal-light to-amber"
          style={{ opacity: complete ? 1 : 0, transition: 'opacity 0.2s' }}
        />
      ) : null}

      <motion.div
        className="relative flex h-full w-full flex-col"
        animate={complete && !reduced ? { opacity: 0, y: -14 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Top corners */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 sm:px-10 sm:pt-8">
          <span className="label-mono text-[10px] text-ink-soft sm:text-[11px]">Voonna Gowri Ganesh</span>
          <span className="label-mono text-right text-[10px] text-ink-faint sm:text-[11px]">
            AI Developer · {year}
          </span>
        </div>

        {/* Monogram in an inking ring */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative grid h-40 w-40 place-items-center sm:h-48 sm:w-48">
            {/* Progress is already eased in usePageLoad, so the ring and rule
                take the value directly: a CSS transition here restarts every
                frame and lags far behind the counter. */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
              <defs>
                <linearGradient id="preloader-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4338CA" />
                  <stop offset="55%" stopColor="#6E62E8" />
                  <stop offset="100%" stopColor="#E8793C" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r={RING_RADIUS} fill="none" stroke="rgba(27,23,18,0.08)" strokeWidth="0.6" />
              <circle
                cx="50"
                cy="50"
                r={RING_RADIUS}
                fill="none"
                stroke="url(#preloader-ring)"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeDasharray={RING_LENGTH}
                strokeDashoffset={RING_LENGTH * (1 - pct / 100)}
              />
            </svg>
            <div className="flex font-display text-6xl font-medium leading-none text-ink sm:text-7xl" aria-hidden="true">
              {['V', 'G'].map((letter, i) => (
                <span key={letter} className="inline-block overflow-hidden pb-2">
                  <motion.span
                    className={`inline-block ${i === 1 ? 'italic text-gradient-signal' : ''}`}
                    initial={reduced ? false : { y: '105%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {letter}
                  </motion.span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Folio: status, hairline, counter */}
        <div className="px-6 pb-6 sm:px-10 sm:pb-8">
          <div className="relative h-px w-full bg-ink/10">
            <div
              className="absolute -top-px left-0 h-[3px] rounded-full bg-gradient-to-r from-signal via-signal-light to-amber"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div className="flex h-5 items-center gap-2 text-[11px] text-ink-soft">
              <span className="text-signal">›</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={stage.label}
                  className="label-mono"
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {stage.label}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="font-display text-5xl font-medium leading-none tabular-nums text-ink sm:text-7xl">
              {String(pct).padStart(3, '0')}
              <span className="ml-1 align-top text-base text-amber sm:text-xl">%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
