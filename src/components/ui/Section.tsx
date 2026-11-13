import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';
import { SplitText } from './SplitText';

/**
 * Per-section colour identity.
 *
 * Applying a tone class re-points `--color-accent{,-2,-3}` for the whole
 * subtree, so gradients, glows, icons and hairlines inside that section all
 * shift hue together. Components stay colour-agnostic — none of them needs to
 * know which section it is rendered in.
 */
export type SectionTone = 'aqua' | 'indigo' | 'magenta' | 'emerald' | 'amber';

const TONE_CLASS: Readonly<Record<SectionTone, string>> = {
  aqua: 'tone-aqua',
  indigo: 'tone-indigo',
  magenta: 'tone-magenta',
  emerald: 'tone-emerald',
  amber: 'tone-amber',
};

export interface SectionProps {
  readonly id: string;
  readonly children: ReactNode;
  readonly className?: string;
  /** Adds the faint blueprint grid behind the section. */
  readonly grid?: boolean;
  readonly tone?: SectionTone;
  readonly containerClassName?: string;
}

/**
 * Standard section shell: consistent vertical rhythm, a scroll-margin that
 * accounts for the floating nav, one shared max-width container, and the
 * section's colour tone.
 */
export function Section({
  id,
  children,
  className,
  grid = false,
  tone = 'aqua',
  containerClassName,
}: SectionProps): React.JSX.Element {
  return (
    <section
      id={id}
      className={cn(
        'relative scroll-mt-28 py-24 sm:py-32 lg:py-40',
        TONE_CLASS[tone],
        className,
      )}
    >
      {grid ? (
        <div
          aria-hidden="true"
          className="grid-field pointer-events-none absolute inset-0 opacity-[0.45] [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_72%)]"
        />
      ) : null}

      {/* Section-tinted bloom, so each section sits in its own pool of colour. */}
      <div
        aria-hidden="true"
        className="animate-glow-drift pointer-events-none absolute top-[8%] -left-[14%] h-[34rem] w-[34rem] rounded-full blur-[130px]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--color-accent-2) calc(var(--glow-strength) * 30%), transparent), transparent 70%)',
        }}
      />

      <div className={cn('relative mx-auto w-full max-w-[82rem] px-5 sm:px-8', containerClassName)}>
        {children}
      </div>
    </section>
  );
}

export interface SectionHeaderProps {
  /** Mono index label, e.g. "04". */
  readonly index: string;
  readonly eyebrow: string;
  readonly title: string;
  /**
   * Trailing portion of the title, painted with the section's gradient.
   * Split as a separate string so the ramp runs across the accent phrase
   * rather than restarting on each word.
   */
  readonly titleAccent?: string;
  readonly description?: string;
  readonly align?: 'left' | 'center';
  readonly className?: string;
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  titleAccent,
  description,
  align = 'left',
  className,
}: SectionHeaderProps): React.JSX.Element {
  const centered = align === 'center';

  return (
    <header
      className={cn(
        'aura relative isolate mb-14 flex flex-col gap-5 sm:mb-20',
        centered && 'items-center text-center',
        className,
      )}
    >
      <Reveal direction="up" distance={16}>
        <div className="flex items-center gap-3 font-mono text-2xs tracking-[0.28em] uppercase">
          <span className="text-gradient-static font-semibold">{index}</span>
          <span
            aria-hidden="true"
            className="h-px w-10 bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-3))]"
          />
          <span className="text-ink-subtle">{eyebrow}</span>
        </div>
      </Reveal>

      <h2 className={cn('text-headline max-w-4xl text-ink', centered && 'mx-auto')}>
        <SplitText as="span" text={title} by="word" stagger={0.05} />
        {titleAccent ? (
          <>{' '}
            <SplitText
              as="span"
              text={titleAccent}
              by="line"
              delay={0.18}
              unitClassName="text-gradient"
            />
          </>
        ) : null}
      </h2>

      {description ? (
        <Reveal direction="up" delay={0.12} distance={14}>
          <p className={cn('text-lede max-w-2xl text-ink-muted', centered && 'mx-auto')}>
            {description}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}
