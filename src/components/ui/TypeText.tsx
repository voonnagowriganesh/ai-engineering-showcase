import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useInteractions';
import { cn } from '@/lib/utils';

export interface TypeTextProps {
  readonly text: string;
  /** Typing begins once this is true (e.g. after the preloader reveal). */
  readonly start: boolean;
  /** Milliseconds after `start` before the first character. */
  readonly delay?: number;
  /** Milliseconds per character. */
  readonly speed?: number;
  /** How long the caret keeps blinking after the last character. */
  readonly caretHoldMs?: number;
  readonly className?: string;
  readonly caretClassName?: string;
}

/**
 * Typewriter reveal with a blinking caret. Every character is rendered from
 * the start (just transparent until typed), so the line never reflows and
 * screen readers get the full text; the caret has a negative margin equal to
 * its width so it adds no layout either.
 */
export function TypeText({
  text,
  start,
  delay = 0,
  speed = 70,
  caretHoldMs = 900,
  className,
  caretClassName,
}: TypeTextProps): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const chars = Array.from(text);
  const [typed, setTyped] = useState(0);
  const [caret, setCaret] = useState(true);

  useEffect(() => {
    if (reduceMotion) {
      setTyped(chars.length);
      setCaret(false);
      return undefined;
    }
    if (!start) return undefined;
    let interval = 0;
    let hide = 0;
    const begin = window.setTimeout(() => {
      const startedAt = performance.now();
      interval = window.setInterval(() => {
        const n = Math.min(chars.length, Math.floor((performance.now() - startedAt) / speed) + 1);
        setTyped(n);
        if (n >= chars.length) {
          window.clearInterval(interval);
          hide = window.setTimeout(() => setCaret(false), caretHoldMs);
        }
      }, 16);
    }, delay);
    return () => {
      window.clearTimeout(begin);
      window.clearInterval(interval);
      window.clearTimeout(hide);
    };
  }, [start, reduceMotion, chars.length, delay, speed, caretHoldMs]);

  const caretEl = (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block h-[0.95em] w-[3px] -mr-[3px] translate-y-[0.12em] rounded-full transition-opacity duration-300',
        typed >= chars.length ? 'animate-caret' : '',
        caret ? 'opacity-100' : 'opacity-0',
        caretClassName,
      )}
    />
  );

  return (
    <span className={className}>
      {typed === 0 ? caretEl : null}
      {chars.map((ch, i) => (
        <span key={`${ch}-${i}`}>
          <span className={i < typed ? undefined : 'opacity-0'}>{ch}</span>
          {i === typed - 1 ? caretEl : null}
        </span>
      ))}
    </span>
  );
}
