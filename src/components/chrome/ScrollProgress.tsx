import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useScrollState, useScrollTo } from '@/hooks/useScroll';

/** Thin gradient bar pinned to the top edge, tracking document progress. */
export function ScrollProgressBar(): React.JSX.Element {
  const { progress } = useScrollState();

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[110] h-0.5 bg-transparent"
    >
      <div
        className="h-full origin-left bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-2),var(--color-accent-3))]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

/** Appears once the visitor is well down the page. */
export function BackToTop(): React.JSX.Element {
  const { progress } = useScrollState();
  const scrollTo = useScrollTo();
  const visible = progress > 0.14;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          key="back-to-top"
          type="button"
          onClick={() => scrollTo(0)}
          aria-label="Back to top"
          className="glass fixed bottom-6 left-6 z-[95] grid size-12 place-items-center rounded-full text-ink-muted transition-colors duration-300 hover:text-ink"
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Circular progress ring around the button */}
          <svg
            aria-hidden="true"
            viewBox="0 0 48 48"
            className="absolute inset-0 size-full -rotate-90"
          >
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="var(--color-accent-2)"
              strokeWidth="1.5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - progress}
              className="opacity-80"
            />
          </svg>
          <ArrowUp size={18} className="relative" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
