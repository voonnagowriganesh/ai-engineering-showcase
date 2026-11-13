import type { ReactNode } from 'react';
import type { IconComponent } from '@/domain/models';
import { usePointerSpotlight } from '@/hooks/useInteractions';
import { cn } from '@/lib/utils';

/* ── Icon ────────────────────────────────────────────────────────────────── */

export interface IconProps {
  readonly icon: IconComponent | undefined;
  readonly className?: string;
  readonly size?: number;
}

/**
 * Renders either a lucide icon or a react-icons brand mark behind one API.
 * `size` maps to width/height, which both libraries accept, so callers never
 * need to know which library an icon came from.
 */
export function Icon({ icon: Glyph, className, size = 18 }: IconProps): React.JSX.Element | null {
  if (!Glyph) return null;
  return <Glyph aria-hidden="true" className={className} size={size} />;
}

/* ── Tag / Pill ──────────────────────────────────────────────────────────── */

export interface TagProps {
  readonly children: ReactNode;
  readonly icon?: IconComponent;
  readonly className?: string;
  readonly tone?: 'neutral' | 'accent';
}

export function Tag({ children, icon, className, tone = 'neutral' }: TagProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-2xs tracking-wide whitespace-nowrap',
        tone === 'neutral'
          ? 'border-line bg-surface-2 text-ink-muted'
          : 'border-accent-2/40 bg-[linear-gradient(110deg,color-mix(in_oklab,var(--color-accent)_18%,transparent),color-mix(in_oklab,var(--color-accent-3)_18%,transparent))] text-accent-2',
        className,
      )}
    >
      <Icon icon={icon} size={12} />
      {children}
    </span>
  );
}

/* ── Eyebrow ─────────────────────────────────────────────────────────────── */

export function Eyebrow({
  children,
  className,
}: {
  readonly children: ReactNode;
  readonly className?: string;
}): React.JSX.Element {
  return (
    <span
      className={cn(
        'font-mono text-2xs tracking-[0.3em] text-ink-subtle uppercase',
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── Spotlight card ──────────────────────────────────────────────────────── */

export interface SpotlightCardProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** Adds the animated gradient hairline on hover. */
  readonly ring?: boolean;
}

/**
 * Glass card with a cursor-following radial highlight.
 *
 * The highlight is pure CSS driven by `--mx`/`--my` custom properties that the
 * pointer hook writes directly to the node — no React state, so moving the
 * cursor over a grid of these costs zero re-renders.
 *
 * Always a <div>: callers own the surrounding semantics (wrap it in an <li>
 * inside a list, an <article> where it stands alone). Making the tag a prop
 * only buys a polymorphic ref type that no caller actually needs.
 */
export function SpotlightCard({
  children,
  className,
  ring = true,
}: SpotlightCardProps): React.JSX.Element {
  const ref = usePointerSpotlight<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        'group/card edge-gradient relative overflow-hidden rounded-card border border-line bg-surface',
        'transition-[transform,border-color,box-shadow] duration-500 [transition-timing-function:var(--ease-out-expo)]',
        // Hover shadow is tinted with the section's accent, not neutral black.
        'hover:-translate-y-1 hover:border-line-strong',
        'hover:shadow-[0_26px_70px_-30px_color-mix(in_oklab,var(--color-accent-2)_55%,transparent)]',
        ring && 'ring-gradient',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{
          background:
            'radial-gradient(460px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--color-accent-2) 22%, transparent), transparent 72%)',
        }}
      />
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}

/* ── Ambient background ──────────────────────────────────────────────────── */

/**
 * Page-wide atmosphere: two slow-drifting colour blooms plus an SVG grain
 * overlay. Grain is what stops large flat gradients from banding on cheap
 * panels, and it is why the dark theme reads as "filmic" rather than "flat".
 */
export function AmbientBackdrop(): React.JSX.Element {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-[22rem] -left-[16rem] h-[42rem] w-[42rem] rounded-full blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--color-accent) calc(var(--glow-strength) * 55%), transparent), transparent 68%)',
          animation: 'float 13s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -right-[18rem] top-[28rem] h-[46rem] w-[46rem] rounded-full blur-[130px]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--color-accent-2) calc(var(--glow-strength) * 50%), transparent), transparent 68%)',
          animation: 'float 17s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          opacity: 'var(--grain-opacity)',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
}

/* ── Decorative divider ──────────────────────────────────────────────────── */

export function GradientRule({ className }: { readonly className?: string }): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'h-px w-full bg-[linear-gradient(90deg,transparent,var(--color-line-strong)_18%,var(--color-accent-2)_50%,var(--color-line-strong)_82%,transparent)] opacity-60',
        className,
      )}
    />
  );
}
