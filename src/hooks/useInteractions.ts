import { useCallback, useEffect, useRef, useState } from 'react';
import { isTouchDevice, prefersReducedMotion } from '@/lib/utils';

/** Reactive media query. Returns false during SSR/prerender. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const media = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent): void => setMatches(event.matches);

    setMatches(media.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** True on coarse-pointer devices, where hover effects should be suppressed. */
export function useIsTouch(): boolean {
  return useMediaQuery('(hover: none), (pointer: coarse)');
}

/**
 * Magnetic hover: the element eases toward the cursor while it is nearby, then
 * springs back on leave. Applied directly to `style.transform` rather than
 * through React state, so it never triggers a re-render.
 *
 * @param strength Fraction of the cursor offset the element travels (0..1).
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.28): React.RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    if (isTouchDevice() || prefersReducedMotion()) return undefined;

    let frame = 0;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const render = (): void => {
      current.x += (target.x - current.x) * 0.16;
      current.y += (target.y - current.y) * 0.16;

      const settled = Math.abs(target.x - current.x) < 0.1 && Math.abs(target.y - current.y) < 0.1;
      if (settled) {
        current.x = target.x;
        current.y = target.y;
      }

      element.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;
      frame = settled ? 0 : requestAnimationFrame(render);
    };

    const ensureRunning = (): void => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const handleMove = (event: PointerEvent): void => {
      const rect = element.getBoundingClientRect();
      target.x = (event.clientX - (rect.left + rect.width / 2)) * strength;
      target.y = (event.clientY - (rect.top + rect.height / 2)) * strength;
      ensureRunning();
    };

    const handleLeave = (): void => {
      target.x = 0;
      target.y = 0;
      ensureRunning();
    };

    element.addEventListener('pointermove', handleMove);
    element.addEventListener('pointerleave', handleLeave);

    return () => {
      element.removeEventListener('pointermove', handleMove);
      element.removeEventListener('pointerleave', handleLeave);
      if (frame) cancelAnimationFrame(frame);
      element.style.removeProperty('transform');
    };
  }, [strength]);

  return ref;
}

/**
 * Writes the cursor's position within an element to CSS custom properties
 * (`--mx`, `--my` as percentages) so spotlight/glow effects can be pure CSS.
 */
export function usePointerSpotlight<T extends HTMLElement>(): React.RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || isTouchDevice()) return undefined;

    const handleMove = (event: PointerEvent): void => {
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      element.style.setProperty('--mx', `${x.toFixed(2)}%`);
      element.style.setProperty('--my', `${y.toFixed(2)}%`);
    };

    element.addEventListener('pointermove', handleMove);
    return () => element.removeEventListener('pointermove', handleMove);
  }, []);

  return ref;
}

/**
 * 3D tilt on hover. Sets rotateX/rotateY from the cursor's position over the
 * element; the caller supplies the perspective on a parent.
 */
export function useTilt<T extends HTMLElement>(maxDegrees = 7): React.RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    if (isTouchDevice() || prefersReducedMotion()) return undefined;

    const handleMove = (event: PointerEvent): void => {
      const rect = element.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.transform =
        `perspective(900px) rotateX(${(-py * maxDegrees * 2).toFixed(2)}deg) ` +
        `rotateY(${(px * maxDegrees * 2).toFixed(2)}deg) translateZ(0)`;
    };

    const handleLeave = (): void => {
      element.style.transform =
        'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    };

    element.addEventListener('pointermove', handleMove);
    element.addEventListener('pointerleave', handleLeave);

    return () => {
      element.removeEventListener('pointermove', handleMove);
      element.removeEventListener('pointerleave', handleLeave);
    };
  }, [maxDegrees]);

  return ref;
}

export interface ClipboardApi {
  readonly copied: string | null;
  readonly copy: (value: string, key?: string) => Promise<boolean>;
}

/** Copy-to-clipboard with a self-clearing "copied" acknowledgement. */
export function useClipboard(resetAfterMs = 2000): ClipboardApi {
  const [copied, setCopied] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const copy = useCallback(
    async (value: string, key?: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        // Clipboard API needs a secure context; fall back to a hidden textarea.
        try {
          const textarea = document.createElement('textarea');
          textarea.value = value;
          textarea.setAttribute('readonly', '');
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        } catch {
          return false;
        }
      }

      setCopied(key ?? value);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(null), resetAfterMs);
      return true;
    },
    [resetAfterMs],
  );

  return { copied, copy };
}

/**
 * Counts from 0 to `target` once the returned ref enters the viewport.
 * Uses an eased curve so the number decelerates into its final value.
 */
export function useCountUp(
  target: number,
  durationMs = 1600,
): { ref: React.RefObject<HTMLSpanElement | null>; value: number } {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const hasRunRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    if (prefersReducedMotion()) {
      setValue(target);
      return undefined;
    }

    let frame = 0;

    const run = (): void => {
      const start = performance.now();
      const step = (now: number): void => {
        const progress = Math.min(1, (now - start) / durationMs);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
        setValue(Math.round(target * eased));
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasRunRef.current) {
          hasRunRef.current = true;
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target, durationMs]);

  return { ref, value };
}

/** Locks body scroll and traps Escape — shared by the palette and mobile nav. */
export function useEscapeKey(enabled: boolean, onEscape: () => void): void {
  useEffect(() => {
    if (!enabled) return undefined;

    const handler = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onEscape();
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled, onEscape]);
}
