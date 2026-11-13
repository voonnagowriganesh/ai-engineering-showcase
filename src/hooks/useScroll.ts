import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { scrollService, type ScrollState } from '@/services/ScrollService';

/**
 * Mounts the shared smooth-scroll driver for the lifetime of the app.
 * Call this exactly once, at the application root.
 */
export function useSmoothScrollRoot(): void {
  useEffect(() => {
    scrollService.start();
    document.documentElement.classList.add('lenis');

    return () => {
      scrollService.stop();
      document.documentElement.classList.remove('lenis');
    };
  }, []);
}

/** Live scroll state. Updates every frame while scrolling. */
export function useScrollState(): ScrollState {
  return useSyncExternalStore(
    scrollService.state.subscribeTo,
    scrollService.state.getSnapshot,
    () => scrollService.state.value,
  );
}

/** Imperative scroll-to, routed through the smooth driver when available. */
export function useScrollTo(): (target: string | number, offsetPx?: number) => void {
  return useCallback((target: string | number, offsetPx = 0) => {
    scrollService.scrollTo(target, offsetPx);
  }, []);
}

/** Locks page scrolling while `locked` is true (preloader, modals, mobile nav). */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return undefined;
    scrollService.lock();
    return () => scrollService.unlock();
  }, [locked]);
}

/**
 * Tracks which section currently owns the viewport.
 *
 * Uses a rootMargin that biases toward the upper third of the screen: a section
 * should read as "active" once its heading area is in view, not only when it
 * happens to be dead-centre.
 */
export function useActiveSection(sectionIds: readonly string[], fallback: string): string {
  const [activeId, setActiveId] = useState(fallback);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestId = '';
        let bestRatio = 0;
        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestId && bestRatio > 0) setActiveId(bestId);
      },
      {
        rootMargin: '-20% 0px -45% 0px',
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      },
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    for (const element of elements) observer.observe(element);

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
