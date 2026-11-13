import { useMemo } from 'react';
import { motion, type Variants } from 'motion/react';
import { useReducedMotion } from '@/hooks/useInteractions';
import { cn } from '@/lib/utils';

export interface SplitTextProps {
  readonly text: string;
  readonly className?: string;
  /**
   * Applied to each animated unit rather than the container.
   *
   * Required for anything that paints text via `background-clip: text` (the
   * `.text-gradient` utility). Put on the container, the gradient would clip
   * against the container's own box while the characters live in nested spans —
   * those inherit `-webkit-text-fill-color: transparent` but have no gradient of
   * their own, so the text renders completely invisible. Pair this with
   * `by="line"` so the ramp runs across the whole string instead of restarting
   * on every word.
   */
  readonly unitClassName?: string;
  /** Per-unit stagger in seconds. */
  readonly stagger?: number;
  readonly delay?: number;
  /** Split granularity. `line` animates the string as a single masked unit. */
  readonly by?: 'word' | 'char' | 'line';
  /** Animate on mount instead of waiting for the viewport. */
  readonly animateOnMount?: boolean;
  readonly as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

const UNIT_VARIANTS: Variants = {
  hidden: { y: '115%', opacity: 0, rotateX: -55 },
  visible: {
    y: '0%',
    opacity: 1,
    rotateX: 0,
    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Masked per-word (or per-character) reveal — the units slide up out of a
 * clipped line box, which reads as typography rather than as a generic fade.
 *
 * Accessibility: the full string is exposed once via `aria-label` and the
 * animated units are hidden from assistive tech, so screen readers announce
 * "Building Intelligent Products with AI." rather than letter-by-letter noise.
 */
export function SplitText({
  text,
  className,
  unitClassName,
  stagger = 0.045,
  delay = 0,
  by = 'word',
  animateOnMount = false,
  as = 'span',
}: SplitTextProps): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const Tag = as;
  const MotionTag = motion[as];

  const units = useMemo(() => {
    if (by === 'line') return [text];
    if (by === 'word') return text.split(' ').filter(Boolean);
    return Array.from(text);
  }, [text, by]);

  if (reduceMotion) {
    // Keep `unitClassName` applied so gradient text still paints when motion is off.
    return (
      <Tag className={className}>
        <span className={unitClassName}>{text}</span>
      </Tag>
    );
  }

  const activation = animateOnMount
    ? ({ animate: 'visible' } as const)
    : ({ whileInView: 'visible', viewport: { once: true, amount: 0.5 } } as const);

  return (
    <MotionTag
      className={cn('inline-block', className)}
      aria-label={text}
      initial="hidden"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      {...activation}
    >
      {units.map((unit, index) =>
        // A space in character mode is rendered as a real text node *between*
        // the clipping boxes rather than inside one. Inside, it would either be
        // collapsed away (words run together) or, as a non-breaking space,
        // survive a line wrap and indent the next line.
        unit === ' ' ? (
          <span key={`space-${index}`} aria-hidden="true">
            {' '}
          </span>
        ) : (
          <span
            // Index is in the key because repeated words are legitimate here.
            key={`${unit}-${index}`}
            aria-hidden="true"
            className={cn(
              'inline-block overflow-hidden align-bottom',
              // Word gaps live on the clipping box, for the same reason.
              by === 'word' && index < units.length - 1 && 'mr-[0.26em]',
            )}
            style={{ perspective: '800px' }}
          >
            <motion.span
              className={cn('inline-block will-change-transform', unitClassName)}
              variants={UNIT_VARIANTS}
            >
              {unit}
            </motion.span>
          </span>
        ),
      )}
    </MotionTag>
  );
}
