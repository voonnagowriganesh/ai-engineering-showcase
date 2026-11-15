import { useEffect, useRef } from 'react';
import { NeuralField, type NeuralFieldPalette } from '@/engine/NeuralField';
import { useReducedMotion } from '@/hooks/useInteractions';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

/**
 * Palettes are expressed as bare `r, g, b` triples because the renderer
 * composes alpha per node and per link; a full rgba() string would force a
 * string rebuild for every one of them, every frame.
 */
const PALETTES: Record<'light' | 'dark', NeuralFieldPalette> = {
  dark: { node: '146, 119, 255', link: '74, 62, 140', accent: '124, 93, 250' },
  light: { node: '124, 93, 250', link: '180, 162, 255', accent: '74, 62, 140' },
};

export interface NeuralFieldCanvasProps {
  readonly className?: string;
  readonly density?: number;
  readonly maxNodes?: number;
}

/**
 * Mounts the NeuralField renderer onto a canvas and keeps it in sync with the
 * theme and the cursor.
 *
 * Pointer tracking listens on `window` rather than the canvas: the canvas is
 * `pointer-events: none` so it never steals clicks from the hero content above
 * it, which means it would otherwise receive no pointer events at all.
 */
export function NeuralFieldCanvas({
  className,
  density,
  maxNodes,
}: NeuralFieldCanvasProps): React.JSX.Element | null {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<NeuralField | null>(null);
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduceMotion) return undefined;

    let field: NeuralField;
    try {
      field = new NeuralField(canvas, {
        palette: PALETTES[theme],
        ...(density !== undefined ? { density } : {}),
        ...(maxNodes !== undefined ? { maxNodes } : {}),
      });
    } catch {
      // No 2D context (very old or locked-down browser) — the section still
      // renders, just without the field.
      return undefined;
    }

    fieldRef.current = field;
    field.start();

    const handleMove = (event: PointerEvent): void => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Only feed the field while the cursor is actually over it, with a small
      // margin so the halo fades at the edges instead of cutting off.
      if (x < -60 || y < -60 || x > rect.width + 60 || y > rect.height + 60) {
        field.clearPointer();
        return;
      }
      field.setPointer(x, y);
    };

    const handleLeave = (): void => field.clearPointer();

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerleave', handleLeave);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerleave', handleLeave);
      field.stop();
      fieldRef.current = null;
    };
    // `theme` is intentionally absent: re-colouring is handled below without
    // rebuilding the whole field.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, density, maxNodes]);

  useEffect(() => {
    fieldRef.current?.setPalette(PALETTES[theme]);
  }, [theme]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    />
  );
}
