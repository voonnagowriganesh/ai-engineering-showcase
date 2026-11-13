import { useEffect, useRef } from 'react';
import { useIsTouch, useReducedMotion } from '@/hooks/useInteractions';

/** Selector for elements the cursor should expand over. */
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]';

/**
 * Two-part cursor: a small solid dot that tracks the pointer exactly, and a
 * larger ring that lags behind and swells over interactive elements.
 *
 * Implementation notes:
 *  - positions are written straight to `style.transform` inside a single rAF
 *    loop; nothing here touches React state, so the cursor costs no re-renders
 *  - hover detection uses one delegated `pointerover` listener plus `closest()`
 *    rather than per-element listeners, so it also covers nodes added later
 *  - suppressed entirely on touch devices and under reduced-motion, and the
 *    native cursor is only hidden (via `html[data-cursor="custom"]`) while this
 *    component is actually mounted
 */
export function CustomCursor(): React.JSX.Element | null {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const reduceMotion = useReducedMotion();
  const disabled = isTouch || reduceMotion;

  useEffect(() => {
    if (disabled) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    document.documentElement.setAttribute('data-cursor', 'custom');

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPosition = { ...pointer };
    let ringScale = 1;
    let ringScaleTarget = 1;
    let visible = false;
    let frame = 0;

    const render = (): void => {
      // Ring eases toward the pointer; the dot is pinned to it.
      ringPosition.x += (pointer.x - ringPosition.x) * 0.16;
      ringPosition.y += (pointer.y - ringPosition.y) * 0.16;
      ringScale += (ringScaleTarget - ringScale) * 0.14;

      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform =
        `translate3d(${ringPosition.x}px, ${ringPosition.y}px, 0) ` +
        `translate(-50%, -50%) scale(${ringScale.toFixed(3)})`;

      frame = requestAnimationFrame(render);
    };

    const show = (): void => {
      if (visible) return;
      visible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    const handleMove = (event: PointerEvent): void => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      show();
    };

    const handleOver = (event: PointerEvent): void => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      ringScaleTarget = target.closest(INTERACTIVE_SELECTOR) ? 1.75 : 1;
    };

    const handleDown = (): void => {
      ringScaleTarget *= 0.8;
    };
    const handleUp = (): void => {
      ringScaleTarget = ringScaleTarget < 1.2 ? 1 : 1.75;
    };

    const handleLeave = (): void => {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerover', handleOver, { passive: true });
    window.addEventListener('pointerdown', handleDown, { passive: true });
    window.addEventListener('pointerup', handleUp, { passive: true });
    document.addEventListener('pointerleave', handleLeave);

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerover', handleOver);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      document.removeEventListener('pointerleave', handleLeave);
      document.documentElement.removeAttribute('data-cursor');
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[300]">
      <div
        ref={ringRef}
        className="absolute top-0 left-0 size-8 rounded-full border border-accent-2/70 opacity-0 transition-opacity duration-300 will-change-transform"
      />
      <div
        ref={dotRef}
        className="absolute top-0 left-0 size-1.5 rounded-full bg-accent opacity-0 transition-opacity duration-300 will-change-transform"
      />
    </div>
  );
}
