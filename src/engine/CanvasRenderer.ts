/**
 * Abstract base for every canvas animation on the site.
 *
 * Handles the cross-cutting concerns that each effect would otherwise reimplement:
 *   - device-pixel-ratio-correct sizing, re-applied on resize
 *   - a single requestAnimationFrame loop with a delta-time clamp
 *   - automatic pause when the canvas scrolls out of view or the tab is hidden,
 *     so an off-screen effect costs nothing
 *
 * Subclasses implement `onResize` and `onFrame`; they never touch the loop.
 */
export abstract class CanvasRenderer {
  protected readonly canvas: HTMLCanvasElement;
  protected readonly context: CanvasRenderingContext2D;

  /** Logical (CSS pixel) size — subclasses should lay out against these. */
  protected width = 0;
  protected height = 0;
  protected pixelRatio = 1;

  #rafHandle = 0;
  #lastTimestamp = 0;
  #running = false;
  /** Tracked separately so neither signal can clobber the other. */
  #inViewport = true;
  #documentVisible = true;

  #resizeObserver: ResizeObserver | null = null;
  #intersectionObserver: IntersectionObserver | null = null;
  #onVisibilityChange: (() => void) | null = null;

  /** Frames longer than this are treated as a single step (tab wake, GC pause). */
  protected static readonly MAX_DELTA_MS = 48;
  /** Caps DPR: beyond 2x the cost is real and the gain is not visible. */
  protected static readonly MAX_PIXEL_RATIO = 2;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) {
      throw new Error('CanvasRenderer: 2D context unavailable on this canvas.');
    }
    this.canvas = canvas;
    this.context = context;
  }

  /** Size the canvas, wire observers and begin animating. Idempotent. */
  start(): void {
    if (this.#running) return;
    this.#running = true;

    this.resize();
    this.#observeResize();
    this.#observeVisibility();

    this.#lastTimestamp = performance.now();
    this.#rafHandle = requestAnimationFrame(this.#tick);
  }

  /** Stop animating and release every observer. Safe to call repeatedly. */
  stop(): void {
    this.#running = false;

    if (this.#rafHandle) cancelAnimationFrame(this.#rafHandle);
    this.#rafHandle = 0;

    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;

    this.#intersectionObserver?.disconnect();
    this.#intersectionObserver = null;

    if (this.#onVisibilityChange) {
      document.removeEventListener('visibilitychange', this.#onVisibilityChange);
      this.#onVisibilityChange = null;
    }

    this.onDispose();
  }

  /** Recompute backing-store size from the element's current CSS box. */
  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, CanvasRenderer.MAX_PIXEL_RATIO);

    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));

    this.width = width;
    this.height = height;
    this.pixelRatio = ratio;

    this.canvas.width = Math.round(width * ratio);
    this.canvas.height = Math.round(height * ratio);

    // Draw in CSS pixels; the transform handles the device scale.
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);

    this.onResize(width, height);
  }

  /* ── Subclass contract ──────────────────────────────────────────────── */

  /** Called after every resize, including the initial one. */
  protected abstract onResize(width: number, height: number): void;

  /**
   * Draw one frame.
   * @param deltaMs Milliseconds since the previous frame, clamped.
   * @param elapsedMs Milliseconds since `start()`.
   */
  protected abstract onFrame(deltaMs: number, elapsedMs: number): void;

  /** Optional hook for subclasses holding extra resources. */
  protected onDispose(): void {
    /* no-op by default */
  }

  /* ── Loop ───────────────────────────────────────────────────────────── */

  readonly #tick = (timestamp: number): void => {
    if (!this.#running) return;

    // Queue the next frame first so a throwing subclass cannot kill the loop.
    this.#rafHandle = requestAnimationFrame(this.#tick);

    if (!this.#inViewport || !this.#documentVisible) {
      // Keep the clock current so the next visible frame gets a sane delta.
      this.#lastTimestamp = timestamp;
      return;
    }

    const rawDelta = timestamp - this.#lastTimestamp;
    this.#lastTimestamp = timestamp;

    this.onFrame(Math.min(rawDelta, CanvasRenderer.MAX_DELTA_MS), timestamp);
  };

  #observeResize(): void {
    if (typeof ResizeObserver === 'undefined') return;
    // Debounced through rAF: ResizeObserver can fire several times per frame.
    let queued = false;
    this.#resizeObserver = new ResizeObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        if (this.#running) this.resize();
      });
    });
    this.#resizeObserver.observe(this.canvas);
  }

  #observeVisibility(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      this.#intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry) this.#inViewport = entry.isIntersecting;
        },
        { threshold: 0 },
      );
      this.#intersectionObserver.observe(this.canvas);
    }

    const handler = (): void => {
      this.#documentVisible = !document.hidden;
    };
    this.#onVisibilityChange = handler;
    document.addEventListener('visibilitychange', handler);
    handler();
  }
}
