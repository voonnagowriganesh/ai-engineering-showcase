import { type ReactNode, useMemo } from 'react';
import { motion, type Variants } from 'motion/react';
import { useReducedMotion } from '@/hooks/useInteractions';
import { usePageRevealed } from '@/hooks/usePageRevealed';
import { cn } from '@/lib/utils';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface RevealProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly direction?: RevealDirection;
  /** Seconds to wait before animating. */
  readonly delay?: number;
  readonly duration?: number;
  /** Travel distance in pixels. */
  readonly distance?: number;
  /** Replay the animation every time it re-enters the viewport. */
  readonly repeat?: boolean;
  /**
   * For above-the-fold content: animate when the preloader reveals the page
   * instead of on viewport entry (which fires while it's still covered).
   */
  readonly afterReveal?: boolean;
  readonly as?: 'div' | 'section' | 'li' | 'span' | 'article';
}

const OFFSETS: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Scroll-triggered entrance. The workhorse wrapper used across every section.
 *
 * Reduced-motion visitors get the content immediately with no transform — the
 * element is never left invisible, which is the usual failure mode of
 * scroll-reveal implementations.
 */
export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 0.75,
  distance = 26,
  repeat = false,
  afterReveal = false,
  as = 'div',
}: RevealProps): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const revealed = usePageRevealed();
  const MotionTag = motion[as];

  const variants = useMemo<Variants>(() => {
    const offset = OFFSETS[direction];
    return {
      hidden: {
        opacity: 0,
        x: offset.x * distance,
        y: offset.y * distance,
        filter: 'blur(6px)',
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        filter: 'blur(0px)',
        transition: {
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    };
  }, [direction, distance, duration, delay]);

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  if (afterReveal) {
    return (
      <MotionTag
        className={cn(className)}
        variants={variants}
        initial="hidden"
        animate={revealed ? 'visible' : 'hidden'}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, amount: 0.2, margin: '0px 0px -10% 0px' }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Staggers direct children on entry. Pair with `RevealItem` for the children.
 * Cheaper than giving each child its own IntersectionObserver.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  as = 'div',
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly stagger?: number;
  readonly delay?: number;
  readonly as?: 'div' | 'ul' | 'section';
}): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -8% 0px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </MotionTag>
  );
}

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(5px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly as?: 'div' | 'li' | 'article' | 'span';
}): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag className={className} variants={ITEM_VARIANTS}>
      {children}
    </MotionTag>
  );
}
