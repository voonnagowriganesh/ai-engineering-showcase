import Lenis from 'lenis';
import { Observable } from '@/lib/Observable';
import { clamp, prefersReducedMotion } from '@/lib/utils';

export interface ScrollState {
  /** Pixels scrolled from the top. */
  readonly offset: number;
  /** 0..1 progress through the whole document. */
  readonly progress: number;
  /** Signed scroll velocity; useful for skew/stretch effects. */
  readonly velocity: number;
  readonly direction: 'up' | 'down';
}

const INITIAL_STATE: ScrollState = { offset: 0, progress: 0, velocity: 0, direction: 'down' };

/**
 * Wraps Lenis so the rest of the app depends on a stable interface instead of a
 * third-party instance, and so there is exactly one requestAnimationFrame loop
 * driving smooth scroll for the whole page.
 *
 * Degrades to native scrolling when the visitor prefers reduced motion — in that
 * mode Lenis is never constructed and `scrollTo` falls back to the platform.
 */
export class ScrollService {
  readonly state = new Observable<ScrollState>(INITIAL_STATE);

  #lenis: Lenis | null = null;
  #rafHandle = 0;
  #nativeScrollHandler: (() => void) | null = null;

  get isSmooth(): boolean {
    return this.#lenis !== null;
  }

  /** Construct the driver and start its frame loop. Idempotent. */
  start(): void {
    if (this.#lenis || this.#nativeScrollHandler) return;

    if (prefersReducedMotion()) {
      this.#startNativeTracking();
      return;
    }

    this.#lenis = new Lenis({
      duration: 1.15,
      // Exponential ease-out: fast pickup, long glide, no rubber-banding.
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // Native touch scrolling feels better than an emulated one on mobile.
      syncTouch: false,
      autoResize: true,
    });

    this.#lenis.on('scroll', (instance: Lenis) => {
      this.state.set({
        offset: instance.scroll,
        progress: clamp(instance.progress, 0, 1),
        velocity: instance.velocity,
        direction: instance.direction === -1 ? 'up' : 'down',
      });
    });

    const frame = (time: number): void => {
      this.#lenis?.raf(time);
      this.#rafHandle = requestAnimationFrame(frame);
    };
    this.#rafHandle = requestAnimationFrame(frame);
  }

  /** Tear everything down. Call from an effect cleanup. */
  stop(): void {
    if (this.#rafHandle) cancelAnimationFrame(this.#rafHandle);
    this.#rafHandle = 0;

    this.#lenis?.destroy();
    this.#lenis = null;

    if (this.#nativeScrollHandler) {
      window.removeEventListener('scroll', this.#nativeScrollHandler);
      this.#nativeScrollHandler = null;
    }
  }

  /** Scroll to an element id or absolute offset. */
  scrollTo(target: string | number, offsetPx = 0): void {
    if (this.#lenis) {
      this.#lenis.scrollTo(typeof target === 'string' ? `#${target}` : target, {
        offset: offsetPx,
        duration: 1.3,
      });
      return;
    }

    if (typeof target === 'number') {
      window.scrollTo({ top: target + offsetPx, behavior: 'auto' });
      return;
    }

    const element = document.getElementById(target);
    element?.scrollIntoView({ block: 'start', behavior: 'auto' });
  }

  /** Freeze scrolling — used while the preloader or a modal is open. */
  lock(): void {
    this.#lenis?.stop();
    if (typeof document !== 'undefined') {
      document.documentElement.style.overflow = 'hidden';
    }
  }

  unlock(): void {
    this.#lenis?.start();
    if (typeof document !== 'undefined') {
      document.documentElement.style.removeProperty('overflow');
    }
  }

  /* ── reduced-motion fallback ────────────────────────────────────────── */

  #startNativeTracking(): void {
    let previousOffset = window.scrollY;

    const handler = (): void => {
      const offset = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      this.state.set({
        offset,
        progress: max > 0 ? clamp(offset / max, 0, 1) : 0,
        velocity: offset - previousOffset,
        direction: offset >= previousOffset ? 'down' : 'up',
      });
      previousOffset = offset;
    };

    this.#nativeScrollHandler = handler;
    window.addEventListener('scroll', handler, { passive: true });
    handler();
  }
}

/** Shared instance — one scroll driver per document. */
export const scrollService = new ScrollService();
