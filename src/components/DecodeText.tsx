import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

// Glyphs follow the case of the letter they stand in for, so a scrambled word
// stays close to its final width and never runs into the next one.
const UPPER = 'ABCDEFGHJKLMNPQRSTUVXYZ';
const LOWER = 'abcdeghknopqrsuvxyz';
const OTHER = '0123456789#%&*+=';
const FRAME_MS = 40;
/** Frames a letter keeps scrambling before it may settle. */
const SCRAMBLE_FRAMES = 6;
/** Gap between words in sequence mode. */
const WORD_GAP_FRAMES = 3;
/** Start anyway if no preloader ever announces the reveal. */
const REVEAL_FALLBACK_MS = 8000;

export interface DecodeWord {
  text: string;
  className?: string;
}

interface DecodeTextProps {
  words: readonly DecodeWord[];
  /**
   * `sequence`: each word scrambles in and settles left to right before the
   * next one starts. `center`: every letter scrambles at once and they settle
   * from the middle of the whole string outward.
   */
  mode: 'sequence' | 'center';
  /** Milliseconds after the page reveal before decoding starts. */
  delay?: number;
  className?: string;
  /** Applied to unsettled glyphs (ignored on gradient text, which paints its own fill). */
  glyphClassName?: string;
  /**
   * For `background-clip: text` gradients: slice one gradient across all the
   * words instead of restarting it on each word.
   */
  continuousGradient?: boolean;
}

const pick = (ch: string) => {
  const set = /[a-z]/.test(ch) ? LOWER : /[A-Z]/.test(ch) ? UPPER : OTHER;
  return set[Math.floor(Math.random() * set.length)] ?? '#';
};
const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Calls `start` once the preloader starts revealing the page. */
function onPageReveal(start: () => void) {
  if (document.documentElement.dataset.revealed === 'true') {
    start();
    return () => undefined;
  }
  let fired = false;
  const run = () => {
    if (fired) return;
    fired = true;
    start();
  };
  window.addEventListener('app:revealed', run, { once: true });
  const fallback = window.setTimeout(run, REVEAL_FALLBACK_MS);
  return () => {
    window.removeEventListener('app:revealed', run);
    window.clearTimeout(fallback);
  };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/**
 * Text that arrives as scrambled glyphs and resolves into the real words.
 *
 * Each word renders its final text invisibly to fix its size, with the
 * scramble painted in an overlay on top, so nothing around it shifts while it
 * decodes. The real text stays in the DOM throughout for screen readers; the
 * overlay is aria-hidden. Reduced motion shows the final text immediately.
 */
export function DecodeText({
  words,
  mode,
  delay = 0,
  className,
  glyphClassName,
  continuousGradient = false,
}: DecodeTextProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<'wait' | 'run' | 'done'>(reduceMotion ? 'done' : 'wait');
  const rootRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const plan = useMemo(() => {
    const total = words.reduce((n, w) => n + w.text.length, 0);
    const mid = (total - 1) / 2;
    const order = Array.from({ length: total }, (_, i) => i).sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid));
    const rank = new Map(order.map((g, r) => [g, r]));
    let global = 0;
    let frame = 0;
    return words.map((word) => {
      const appearAt = mode === 'sequence' ? frame : 0;
      const settleAt = Array.from(word.text, (_, i) =>
        mode === 'sequence' ? appearAt + SCRAMBLE_FRAMES + i : SCRAMBLE_FRAMES + (rank.get(global + i) ?? 0),
      );
      global += word.text.length;
      frame = appearAt + SCRAMBLE_FRAMES + word.text.length + WORD_GAP_FRAMES;
      return { appearAt, settleAt };
    });
  }, [words, mode]);

  useEffect(() => {
    if (reduceMotion) {
      setPhase('done');
      return undefined;
    }
    setPhase('wait');
    let interval = 0;
    let delayTimer = 0;
    const lastFrame = Math.max(...plan.flatMap((p) => p.settleAt), 0);

    const cancelReveal = onPageReveal(() => {
      delayTimer = window.setTimeout(() => {
        setPhase('run');
        const startedAt = performance.now();
        interval = window.setInterval(() => {
          // Frame index from elapsed time, not tick count, so a busy main
          // thread can't stretch the decode out.
          const frame = Math.floor((performance.now() - startedAt) / FRAME_MS);
          words.forEach((word, w) => {
            const el = overlayRefs.current[w];
            const step = plan[w];
            if (!el || !step) return;
            if (frame < step.appearAt) {
              el.textContent = '';
              return;
            }
            let html = '';
            Array.from(word.text).forEach((ch, i) => {
              if (ch === ' ' || frame >= (step.settleAt[i] ?? 0)) html += escapeHtml(ch);
              else if (glyphClassName) html += `<span class="${glyphClassName}">${escapeHtml(pick(ch))}</span>`;
              else html += escapeHtml(pick(ch));
            });
            el.innerHTML = html;
          });
          if (frame >= lastFrame) {
            window.clearInterval(interval);
            setPhase('done');
          }
        }, FRAME_MS);
      }, delay);
    });

    return () => {
      cancelReveal();
      window.clearTimeout(delayTimer);
      window.clearInterval(interval);
    };
  }, [reduceMotion, plan, words, delay, glyphClassName]);

  // One gradient across the whole name: each word shows its own slice of it.
  useLayoutEffect(() => {
    if (!continuousGradient) return undefined;
    const apply = () => {
      const root = rootRef.current;
      if (!root) return;
      const box = root.getBoundingClientRect();
      wordRefs.current.forEach((wrap) => {
        if (!wrap) return;
        const r = wrap.getBoundingClientRect();
        wrap.querySelectorAll<HTMLElement>('[data-gradient]').forEach((el) => {
          el.style.backgroundSize = `${box.width}px ${box.height}px`;
          el.style.backgroundPosition = `${box.left - r.left}px ${box.top - r.top}px`;
        });
      });
    };
    apply();
    const observer = new ResizeObserver(apply);
    if (rootRef.current) observer.observe(rootRef.current);
    void document.fonts?.ready.then(apply);
    return () => observer.disconnect();
  }, [continuousGradient, phase]);

  const decoding = phase !== 'done';

  return (
    <span ref={rootRef} className={className}>
      {words.map((word, w) => (
        <span key={`${word.text}-${w}`}>
          {w > 0 ? ' ' : null}
          <span
            ref={(el) => {
              wordRefs.current[w] = el;
            }}
            className="relative inline-block whitespace-nowrap"
          >
            <span data-gradient className={`${word.className ?? ''} ${decoding ? 'opacity-0' : ''}`}>
              {word.text}
            </span>
            {decoding ? (
              <span
                aria-hidden="true"
                data-gradient
                ref={(el) => {
                  overlayRefs.current[w] = el;
                }}
                className={`absolute inset-0 overflow-hidden whitespace-nowrap ${word.className ?? ''}`}
              />
            ) : null}
          </span>
        </span>
      ))}
    </span>
  );
}
