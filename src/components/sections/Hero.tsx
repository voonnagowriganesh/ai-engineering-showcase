import { Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Download, MapPin } from 'lucide-react';
import { headlineMetrics, identity, socials, techMarquee } from '@/data/profile';
import { useCountUp, useMagnetic, useReducedMotion } from '@/hooks/useInteractions';
import { useScrollTo } from '@/hooks/useScroll';
import { NeuralFieldCanvas } from '@/components/canvas/NeuralFieldCanvas';
import { ButtonLink } from '@/components/ui/Button';
import { Marquee } from '@/components/ui/Marquee';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { Icon } from '@/components/ui/primitives';
import type { Metric } from '@/domain/models';

// three.js is ~180KB gzipped; keep it out of the critical path so first paint
// never waits on the decorative layer.
const AuroraField = lazy(() =>
  import('@/components/canvas/AuroraField').then((module) => ({ default: module.AuroraField })),
);

export function Hero(): React.JSX.Element {
  const scrollTo = useScrollTo();
  const reduceMotion = useReducedMotion();
  const magneticRef = useMagnetic<HTMLAnchorElement>(0.22);
  const lastLineIndex = identity.headline.length - 1;

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-12"
    >
      {/* ── Backdrop layers ─────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <AuroraField />
      </Suspense>
      <NeuralFieldCanvas />

      {/* Fades the field out behind the lower content so text keeps contrast. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(to_top,var(--color-canvas),transparent)]"
      />

      <div className="relative mx-auto w-full max-w-[82rem] px-5 sm:px-8">
        {/* ── Availability pill ─────────────────────────────────────────── */}
        <Reveal direction="down" distance={14}>
          <div className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-2">
            <span className="relative grid size-5 place-items-center">
              <span className="size-2 rounded-full bg-emerald-500" />
              {!reduceMotion ? (
                <span className="animate-pulse-ring absolute size-2 rounded-full bg-emerald-500" />
              ) : null}
            </span>
            <span className="text-[0.8125rem] font-medium text-ink-muted">
              {identity.availability}
            </span>
          </div>
        </Reveal>

        {/* ── Headline ──────────────────────────────────────────────────── */}
        <h1 className="mt-6 flex flex-col text-hero font-bold text-ink">
          {identity.headline.map((line, index) => (
            <SplitText
              key={line}
              as="span"
              text={line}
              // The gradient line animates as one unit so the colour ramp runs
              // across the whole phrase rather than restarting per character.
              by={index === lastLineIndex ? 'line' : 'char'}
              animateOnMount
              stagger={0.028}
              delay={0.22 + index * 0.13}
              {...(index === lastLineIndex ? { unitClassName: 'text-gradient' } : {})}
            />
          ))}
        </h1>

        {/* ── Role + summary ────────────────────────────────────────────── */}
        <div className="mt-8 grid gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:items-end">
          <div>
            <Reveal direction="up" delay={0.75} distance={18}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-2xs tracking-[0.2em] text-ink-muted uppercase">
                {identity.positioning.map((item, index) => (
                  <span key={item} className="flex items-center gap-3">
                    {index > 0 ? (
                      <span aria-hidden="true" className="size-1 rounded-full bg-accent-2" />
                    ) : null}
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.85} distance={18}>
              <p className="text-lede mt-4 max-w-2xl text-ink-muted">
                {identity.supportingStatement[0]}
              </p>
            </Reveal>

            {/* ── Actions ───────────────────────────────────────────────── */}
            <Reveal direction="up" delay={0.95} distance={18}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ButtonLink
                  ref={magneticRef}
                  href="#projects"
                  size="lg"
                  variant="primary"
                  iconRight={<ArrowUpRight size={17} />}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollTo('projects', -16);
                  }}
                >
                  View selected work
                </ButtonLink>

                <ButtonLink
                  href={identity.resumeUrl}
                  download={identity.resumeFileName}
                  size="lg"
                  variant="outline"
                  iconLeft={<Download size={17} />}
                >
                  Résumé
                </ButtonLink>

                <div className="ml-1 flex items-center gap-2">
                  {socials.map((social) => (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} — ${social.handle}`}
                      className="grid size-11 place-items-center rounded-full border border-line bg-surface/60 text-ink-muted backdrop-blur transition-[color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent-2 hover:text-accent-2"
                    >
                      <Icon icon={social.icon} size={17} />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal direction="up" delay={1.05} distance={14}>
              <p className="mt-6 flex items-center gap-2 text-sm text-ink-subtle">
                <MapPin size={14} />
                {identity.location}
              </p>
            </Reveal>
          </div>

          {/* ── Metrics ───────────────────────────────────────────────────── */}
          <Reveal direction="left" delay={1} distance={24}>
            <dl className="ring-gradient grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line">
              {headlineMetrics.map((metric) => (
                <MetricTile key={metric.label} metric={metric} />
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      {/* ── Tech marquee ────────────────────────────────────────────────── */}
      <Reveal direction="up" delay={1.15} className="relative mt-12 sm:mt-14">
        <Marquee durationSeconds={46}>
          {techMarquee.map((tech) => (
            <span
              key={tech.name}
              className="group/tech mx-3 flex items-center gap-2.5 rounded-full border border-line bg-surface/50 px-4 py-2 backdrop-blur-sm transition-colors duration-300 hover:border-accent-2/40"
            >
              <Icon
                icon={tech.icon}
                size={16}
                className="text-ink-subtle transition-colors duration-300 group-hover/tech:text-accent-2"
              />
              <span className="font-mono text-2xs tracking-wide whitespace-nowrap text-ink-muted">
                {tech.name}
              </span>
            </span>
          ))}
        </Marquee>
      </Reveal>

      {/* ── Scroll cue ──────────────────────────────────────────────────── */}
      <motion.button
        type="button"
        onClick={() => scrollTo('about', -16)}
        aria-label="Scroll to about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-ink-subtle transition-colors duration-300 hover:text-ink sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        <span className="font-mono text-2xs tracking-[0.25em] uppercase">Scroll</span>
        <motion.span
          animate={reduceMotion ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={15} />
        </motion.span>
      </motion.button>
    </section>
  );
}

/** Single metric cell with a count-up that fires when it scrolls into view. */
function MetricTile({ metric }: { readonly metric: Metric }): React.JSX.Element {
  const { ref, value } = useCountUp(metric.countTo ?? 0);

  return (
    <div className="bg-surface/80 p-5 backdrop-blur-sm transition-colors duration-300 hover:bg-elevated">
      <dt className="sr-only">{metric.label}</dt>
      <dd>
        <span
          ref={ref}
          className="font-display block text-3xl leading-none font-bold tabular-nums text-gradient"
        >
          {metric.countTo !== undefined ? value : metric.value}
          {metric.suffix ?? ''}
        </span>
        <span className="mt-2 block text-[0.8125rem] leading-snug text-ink-subtle">
          {metric.label}
        </span>
      </dd>
    </div>
  );
}
