import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { navSections } from '@/data/profile';
import { useActiveSection, useScrollState, useScrollTo } from '@/hooks/useScroll';
import { cn } from '@/lib/utils';

const SECTION_IDS = navSections.map((section) => section.id);

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

/**
 * Vertical section rail (desktop only).
 *
 * Shows where the visitor is in the document and lets them jump. Labels are
 * revealed on hover so the rail stays quiet at rest.
 */
export function SectionRail(): React.JSX.Element {
  const activeSection = useActiveSection(SECTION_IDS, 'hero');
  const scrollTo = useScrollTo();

  return (
    <nav
      aria-label="Section navigation"
      className="fixed top-1/2 right-6 z-[90] hidden -translate-y-1/2 xl:block"
    >
      <ul className="flex flex-col items-end gap-1">
        {navSections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => scrollTo(section.id, -16)}
                aria-label={`Go to ${section.label}`}
                aria-current={isActive ? 'true' : undefined}
                className="group flex items-center justify-end gap-3 py-1.5"
              >
                <span
                  className={cn(
                    'font-mono text-2xs tracking-wider whitespace-nowrap transition-all duration-300',
                    isActive
                      ? 'text-ink opacity-100'
                      : 'text-ink-subtle opacity-0 group-hover:opacity-100',
                  )}
                >
                  {section.label}
                </span>
                <span
                  className={cn(
                    'block h-px transition-all duration-500 [transition-timing-function:var(--ease-out-expo)]',
                    isActive
                      ? 'w-8 bg-accent-2'
                      : 'w-4 bg-line-strong group-hover:w-6 group-hover:bg-ink-subtle',
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
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
