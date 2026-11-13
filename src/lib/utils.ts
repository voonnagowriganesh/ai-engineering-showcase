import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge has to be told about the custom font sizes declared in
 * `@theme` (--text-hero, --text-headline, …).
 *
 * Without this it cannot tell `text-headline` (a size) from `text-ink` (a
 * colour) — both match `text-*` — so it assumes colour, decides the two
 * conflict, and silently drops the size. The symptom is section headings
 * rendering at body size, which is exactly what happened before this was added.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['2xs', 'hero', 'display', 'headline', 'lede'] }],
    },
  },
});

/** Conditional class names with Tailwind conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Clamp `value` into the inclusive range [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation. `t` is not clamped — callers that need it should clamp. */
export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/** Map `value` from one range to another. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  if (inMax === inMin) return outMin;
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/** True when the visitor has asked the OS to reduce motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** True for coarse-pointer devices, where hover affordances should be skipped. */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

/**
 * Trailing-edge debounce.
 * Returns the wrapped function with a `cancel` method for cleanup in effects.
 */
export function debounce<TArgs extends readonly unknown[]>(
  fn: (...args: TArgs) => void,
  waitMs: number,
): ((...args: TArgs) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const wrapped = (...args: TArgs): void => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };

  wrapped.cancel = (): void => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };

  return wrapped;
}

/** Hex (#rgb or #rrggbb) to normalised [r, g, b] in 0..1, for shader uniforms. */
export function hexToRgbNormalised(hex: string): [number, number, number] {
  const cleaned = hex.replace('#', '').trim();
  const expanded =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned;

  const int = Number.parseInt(expanded, 16);
  if (Number.isNaN(int) || expanded.length !== 6) return [1, 1, 1];

  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}

/** Read a CSS custom property off an element (defaults to <html>). */
export function readCssVariable(name: string, element?: Element | null): string {
  if (typeof window === 'undefined') return '';
  const target = element ?? document.documentElement;
  return getComputedStyle(target).getPropertyValue(name).trim();
}
