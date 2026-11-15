import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { identity } from '@/data/profile';
import { useReducedMotion } from '@/hooks/useInteractions';
import { cn } from '@/lib/utils';

/** Boot lines, each revealed as the progress bar passes its threshold. */
const BOOT_SEQUENCE: readonly { readonly at: number; readonly label: string }[] = [
  { at: 8, label: 'initialising runtime' },
  { at: 26, label: 'mounting design tokens' },
  { at: 44, label: 'compiling aurora shaders' },
  { at: 62, label: 'seeding neural field' },
  { at: 78, label: 'resolving typography' },
  { at: 92, label: 'calibrating interactions' },
  { at: 100, label: 'ready' },
];

export interface PreloaderProps {
  readonly progress: number;
  readonly complete: boolean;
}

/**
 * Full-screen boot sequence.
 *
 * Stays mounted until `complete`, then leaves with a two-panel curtain split so
 * the hero is revealed rather than merely faded in. Reduced-motion visitors get
 * a plain fade — the information is identical, only the choreography differs.
 */
export function Preloader({ progress, complete }: PreloaderProps): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  // Unmount only after the exit animation has actually played.
  useEffect(() => {
    if (!complete) return undefined;
    const timer = window.setTimeout(() => setVisible(false), reduceMotion ? 180 : 1150);
    return () => window.clearTimeout(timer);
  }, [complete, reduceMotion]);

  const activeLine = useMemo(() => {
    let current = BOOT_SEQUENCE[0];
    for (const entry of BOOT_SEQUENCE) {
      if (progress >= entry.at) current = entry;
    }
    return current;
  }, [progress]);

  const padded = String(Math.min(100, Math.round(progress))).padStart(3, '0');

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="preloader"
          // pointer-events-none once complete: the overlay stays mounted (transparent)
          // while its exit plays, and must not swallow clicks on the revealed page.
          className={cn(
            'fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-canvas',
            complete && 'pointer-events-none',
          )}
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.55 } }}
          aria-live="polite"
          aria-busy={!complete}
        >
          {/* ── Curtain panels: split apart on exit ─────────────────────── */}
          {!reduceMotion ? (
            <>
              <motion.div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1/2 bg-canvas"
                initial={{ y: 0 }}
                animate={complete ? { y: '-101%' } : { y: 0 }}
                transition={{ duration: 1.05, ease: [0.83, 0, 0.17, 1], delay: 0.18 }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/2 bg-canvas"
                initial={{ y: 0 }}
                animate={complete ? { y: '101%' } : { y: 0 }}
                transition={{ duration: 1.05, ease: [0.83, 0, 0.17, 1], delay: 0.18 }}
              />
            </>
          ) : null}

          {/* ── Content ─────────────────────────────────────────────────── */}
          <motion.div
            className="relative z-10 flex w-full max-w-xl flex-col items-center gap-10 px-6"
            animate={complete ? { opacity: 0, y: -18 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Monogram */}
            <div className="relative">
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-2),var(--color-accent-3))] blur-xl"
                animate={reduceMotion ? {} : { opacity: [0.35, 0.75, 0.35] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="ring-gradient relative grid size-16 place-items-center rounded-2xl border border-line bg-surface" data-active="true">
                <span className="font-display text-xl font-bold text-gradient-static">
                  {identity.initials}
                </span>
              </div>
            </div>

            {/* Counter */}
            <div className="flex w-full flex-col gap-4">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-2xs tracking-[0.3em] text-ink-subtle uppercase">
                  {identity.fullName}
                </span>
                <span className="font-display text-4xl leading-none font-bold tabular-nums text-ink sm:text-5xl">
                  {padded}
                  <span className="ml-1 align-super text-base text-ink-subtle">%</span>
                </span>
              </div>

              {/* Progress rail */}
              <div className="relative h-px w-full overflow-hidden bg-line">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-2),var(--color-accent-3))]"
                  animate={{ width: `${Math.min(100, progress)}%` }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
                {/* Leading glow that rides the end of the bar */}
                <motion.div
                  aria-hidden="true"
                  className="absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-2 blur-md"
                  animate={{ left: `${Math.min(100, progress)}%`, opacity: complete ? 0 : 0.85 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </div>

              {/* Boot log */}
              <div className="flex h-5 items-center gap-2 font-mono text-2xs text-ink-subtle">
                <span className="text-accent">&gt;</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeLine?.label ?? 'boot'}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                  >
                    {activeLine?.label}
                  </motion.span>
                </AnimatePresence>
                <span
                  aria-hidden="true"
                  className={cn('inline-block h-3 w-1.5 bg-accent', !complete && 'animate-caret')}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
