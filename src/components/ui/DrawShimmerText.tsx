import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useInteractions';
import { cn } from '@/lib/utils';

export interface DrawShimmerTextProps {
  readonly text: string;
  /** Plays once this is true (e.g. after the preloader reveal). */
  readonly start: boolean;
  /** Seconds after `start` before the outline begins tracing. */
  readonly delay?: number;
  /** Typography/layout for the whole block. */
  readonly className?: string;
  /** The final fill (e.g. a background-clip gradient). */
  readonly fillClassName?: string;
  /** The traced outline (a -webkit-text-stroke colour plus transparent fill). */
  readonly strokeClassName?: string;
}

const EASE = [0.65, 0, 0.35, 1] as const;

/**
 * "Draw & shimmer": the text is traced in a glowing outline left to right, the
 * fill floods in behind the trace, the outline fades, and one highlight sweeps
 * across. Three copies of the same text are stacked in one grid cell so they
 * wrap identically at every width; only the fill is exposed to screen readers.
 */
export function DrawShimmerText({
  text,
  start,
  delay = 0,
  className,
  fillClassName,
  strokeClassName,
}: DrawShimmerTextProps): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const play = start && !reduceMotion;
  const hidden = 'inset(0 100% 0 0)';
  const shown = 'inset(0 0% 0 0)';

  if (reduceMotion) {
    return (
      <span className={cn('grid', className)}>
        <span className={fillClassName}>{text}</span>
      </span>
    );
  }

  return (
    <span className={cn('grid', className)}>
      {/* 1. Outline trace */}
      <motion.span
        aria-hidden="true"
        className={cn('col-start-1 row-start-1', strokeClassName)}
        initial={{ clipPath: hidden, opacity: 1 }}
        animate={play ? { clipPath: shown, opacity: [1, 1, 0] } : { clipPath: hidden, opacity: 1 }}
        transition={{
          clipPath: { duration: 1.0, delay, ease: EASE },
          opacity: { duration: 2.0, delay, times: [0, 0.75, 1] },
        }}
      >
        {text}
      </motion.span>

      {/* 2. Fill floods in behind the trace */}
      <motion.span
        className={cn('col-start-1 row-start-1', fillClassName)}
        initial={{ clipPath: hidden }}
        animate={{ clipPath: play ? shown : hidden }}
        transition={{ duration: 0.95, delay: delay + 0.7, ease: EASE }}
      >
        {text}
      </motion.span>

      {/* 3. One highlight sweep across the finished name */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none col-start-1 row-start-1 bg-[linear-gradient(100deg,transparent_42%,rgba(255,255,255,0.85)_50%,transparent_58%)] bg-[length:250%_100%] bg-clip-text text-transparent"
        initial={{ backgroundPosition: '120% 0%' }}
        animate={play ? { backgroundPosition: '-20% 0%' } : { backgroundPosition: '120% 0%' }}
        transition={{ duration: 1.3, delay: delay + 1.75, ease: 'easeInOut' }}
      >
        {text}
      </motion.span>
    </span>
  );
}
