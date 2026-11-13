import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export interface ThemeToggleProps {
  readonly className?: string;
  /** Renders a wider labelled control, used in the mobile sheet. */
  readonly withLabel?: boolean;
}

/**
 * Light/dark switch.
 *
 * Uses the View Transitions API for a circular wipe from the button when the
 * browser supports it; everywhere else the CSS variable transition on <body>
 * already cross-fades the palette, so the fallback is graceful rather than abrupt.
 */
export function ThemeToggle({ className, withLabel = false }: ThemeToggleProps): React.JSX.Element {
  const { isDark, toggle } = useTheme();

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const startViewTransition = document.startViewTransition?.bind(document);

    if (!startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      toggle();
      return;
    }

    // Anchor the wipe on the button itself.
    const rect = event.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(originX, window.innerWidth - originX),
      Math.max(originY, window.innerHeight - originY),
    );

    const transition = startViewTransition(() => {
      toggle();
    });

    void transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${originX}px ${originY}px)`,
            `circle(${radius}px at ${originX}px ${originY}px)`,
          ],
        },
        {
          duration: 620,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'group relative grid place-items-center overflow-hidden rounded-full border border-line',
        'bg-surface-2 text-ink-muted transition-colors duration-300',
        'hover:border-line-strong hover:text-ink',
        withLabel ? 'h-11 w-full gap-2.5 px-4 [grid-auto-flow:column]' : 'size-10',
        className,
      )}
    >
      <span className="relative grid size-[18px] place-items-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={isDark ? 'moon' : 'sun'}
            className="absolute inset-0 grid place-items-center"
            initial={{ opacity: 0, rotate: -75, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 75, scale: 0.6 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
          </motion.span>
        </AnimatePresence>
      </span>

      {withLabel ? (
        <span className="text-sm font-medium">{isDark ? 'Dark' : 'Light'} theme</span>
      ) : null}
    </button>
  );
}
