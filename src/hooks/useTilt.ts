import { useRef, useState, type PointerEvent } from 'react';

interface TiltState {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
}

const REST: TiltState = { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 };

/**
 * Pointer-driven 3D tilt. Pure CSS transform math — no WebGL, no external
 * library — so it stays reliable across devices and reduced-motion users
 * just get a static card (see prefers-reduced-motion guard in consumers).
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(maxDeg = 10) {
  const ref = useRef<T | null>(null);
  const [tilt, setTilt] = useState<TiltState>(REST);

  const onPointerMove = (e: PointerEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateX: (0.5 - py) * maxDeg * 2,
      rotateY: (px - 0.5) * maxDeg * 2,
      glareX: px * 100,
      glareY: py * 100,
    });
  };

  const onPointerLeave = () => setTilt(REST);

  return { ref, tilt, onPointerMove, onPointerLeave };
}
