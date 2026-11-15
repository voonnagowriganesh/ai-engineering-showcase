import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight, Download, Sparkles, Brain, Layers, Bot, Code } from 'lucide-react';
import { headlineMetrics, heroFeaturePills, identity, socials } from '@/data/profile';
import type { Metric } from '@/domain/models';
import { useScrollTo } from '@/hooks/useScroll';
import { useReducedMotion } from '@/hooks/useInteractions';
import { usePageRevealed } from '@/hooks/usePageRevealed';
import { NeuralFieldCanvas } from '@/components/canvas/NeuralFieldCanvas';
import { Reveal } from '@/components/ui/Reveal';
import { DecodeText, type DecodeWord } from '@/components/ui/DecodeText';
import { TypeText } from '@/components/ui/TypeText';
import { DrawShimmerText } from '@/components/ui/DrawShimmerText';
import { Icon } from '@/components/ui/primitives';
import { track } from '@/lib/analytics';

const AuroraField = lazy(() =>
  import('@/components/canvas/AuroraField').then((module) => ({ default: module.AuroraField })),
);

/** Max tilt in degrees for the portrait's mouse-driven 3D effect. */
const TILT_RANGE = 12;

const ROLE_WORDS: readonly DecodeWord[] = [
  { text: 'AI' },
  { text: 'Developer' },
  { text: '@', className: 'text-[#7C5DFA]' },
  { text: 'Techgene Solutions', className: 'font-semibold text-[#1B1F3B] dark:text-white' },
];

// Name: one ink → indigo → violet ramp (lighter in dark mode), drawn in by a
// glowing violet outline first.
const NAME_FILL =
  'bg-gradient-to-r from-[#1B1F3B] via-[#4A3E8C] to-[#7C5DFA] bg-clip-text text-transparent dark:from-[#F4F5F8] dark:via-[#C4B5FD] dark:to-[#7C5DFA]';
const NAME_STROKE =
  'text-transparent [-webkit-text-stroke:1.5px_#7C5DFA] [filter:drop-shadow(0_0_10px_rgba(124,93,250,0.55))] dark:[-webkit-text-stroke:1.5px_#A78BFA] dark:[filter:drop-shadow(0_0_14px_rgba(167,139,250,0.7))]';

// Unsettled role glyphs glow in the accent so the decode is unmistakable.
const ROLE_GLYPH =
  'text-[#7C5DFA] [text-shadow:0_0_10px_rgba(124,93,250,0.6)] dark:text-[#A78BFA]';

/**
 * A headline stat that counts up from 0 once the page is revealed and the
 * number is on screen (ease-out cubic, ~1.4s). Reduced motion shows the value.
 */
function StatCounter({ metric, start }: { readonly metric: Metric; readonly start: boolean }): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const target = metric.countTo ?? 0;
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setValue(target);
      return undefined;
    }
    const el = ref.current;
    if (!start || !el) return undefined;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const begin = performance.now();
        const tick = (now: number): void => {
          const t = Math.min(1, (now - begin) / 1400);
          setValue(Math.round((1 - (1 - t) ** 3) * target));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [start, reduceMotion, target]);

  return (
    // Dividers only between stats in the same row: 2×2 on phones, 1×4 above.
    <div className="border-l border-[#E2E4EB] pl-4 max-sm:odd:border-l-0 max-sm:odd:pl-0 sm:first:border-l-0 sm:first:pl-0 dark:border-[#2A305A]">
      <div className="font-display text-3xl font-extrabold tabular-nums text-[#1B1F3B] sm:text-4xl dark:text-white">
        <span ref={ref}>
          {metric.prefix ?? ''}
          {value}
        </span>
        <span className="text-[#7C5DFA] dark:text-[#9277FF]">{metric.suffix ?? ''}</span>
      </div>
      <div className="mt-1 text-xs leading-snug text-[#374151] sm:text-sm dark:text-[#9EA5C0]">{metric.label}</div>
    </div>
  );
}

export function Hero(): React.JSX.Element {
  const scrollTo = useScrollTo();
  const reduceMotion = useReducedMotion();
  const revealed = usePageRevealed();
  const tiltRef = useRef<HTMLDivElement>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 150, damping: 20, mass: 0.5 });
  const springY = useSpring(pointerY, { stiffness: 150, damping: 20, mass: 0.5 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [TILT_RANGE, -TILT_RANGE]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-TILT_RANGE, TILT_RANGE]);

  const glowX = useTransform(springX, [-0.5, 0.5], ['20%', '80%']);
  const glowY = useTransform(springY, [-0.5, 0.5], ['20%', '80%']);
  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(124, 93, 250, 0.15), transparent 60%)`,
  );

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (reduceMotion || !tiltRef.current) return;
    const rect = tiltRef.current.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = (): void => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#F4F5F8] pt-28 pb-16 text-[#1B1F3B] transition-colors dark:bg-[#0B0E1E] dark:text-white"
    >
      {/* ── Visual Ambient Canvas Backdrops ─────────────────────────────── */}
      {revealed ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        >
          <Suspense fallback={null}>
            <AuroraField />
          </Suspense>
          <NeuralFieldCanvas />
        </motion.div>
      ) : null}

      {/* Gentle royal blue & indigo ambient glow spots */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -left-20 size-[32rem] rounded-full bg-[#7C5DFA]/10 blur-[130px] dark:bg-[#7C5DFA]/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-20 size-[36rem] rounded-full bg-[#E2E4FA]/60 blur-[140px] dark:bg-[#4A3E8C]/20"
      />

      <div className="relative mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ── Left Content Column (7 cols) ──────────────────────────────── */}
          <div className="lg:col-span-7">
            {/* Pill: AI Developer @ Techgene Solutions */}
            <Reveal afterReveal direction="down" distance={14}>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#E2E4EB] bg-[#FFFFFF] px-4 py-1.5 shadow-[0_2px_12px_rgba(27,31,59,0.04)] backdrop-blur-md dark:border-[#2A305A] dark:bg-[#151934]">
                <span className="flex size-5 items-center justify-center rounded-full bg-[#E2E4FA] text-[#7C5DFA] dark:bg-[#7C5DFA]/20 dark:text-[#9277FF]">
                  <Sparkles size={12} className="animate-pulse" />
                </span>
                <DecodeText
                  mode="sequence"
                  words={ROLE_WORDS}
                  delay={150}
                  glyphClassName={ROLE_GLYPH}
                  className="text-xs font-semibold tracking-wide text-[#1B1F3B] dark:text-[#E2E4FA]"
                />
              </div>
            </Reveal>

            {/* Headline */}
            <div className="mt-5">
              <Reveal afterReveal direction="up" delay={0.1}>
                <h1 className="font-display tracking-tight">
                  <TypeText
                    text="Hi, I'm"
                    start={revealed}
                    delay={200}
                    className="block text-2xl font-bold text-[#1B1F3B] sm:text-3xl dark:text-[#F4F5F8]"
                    caretClassName="bg-[#7C5DFA] dark:bg-[#A78BFA]"
                  />
                  <DrawShimmerText
                    text={identity.fullName}
                    start={revealed}
                    delay={0.75}
                    className="mt-1 pb-1 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
                    fillClassName={NAME_FILL}
                    strokeClassName={NAME_STROKE}
                  />
                  <span className="mt-2 block text-2xl font-bold text-[#4A3E8C] sm:text-3xl lg:text-4xl dark:text-[#9277FF]">
                    Building Intelligent Products with AI.
                  </span>
                </h1>
              </Reveal>

              <Reveal afterReveal direction="up" delay={0.2}>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#374151] sm:text-lg dark:text-[#D1D5DB]">
                  {identity.supportingStatement[0]}
                </p>
              </Reveal>
            </div>

            {/* Buttons: Explore My Work & Download Resume */}
            <Reveal afterReveal direction="up" delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => scrollTo('projects', -20)}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-[#7C5DFA] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_-6px_rgba(124,93,250,0.5)] transition-all duration-300 hover:scale-105 hover:bg-[#4A3E8C] hover:shadow-[0_12px_28px_-6px_rgba(124,93,250,0.6)]"
                >
                  <span>Explore My Work</span>
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>

                <a
                  href={identity.resumeUrl}
                  download={identity.resumeFileName}
                  onClick={() => track('resume-download', { from: 'hero' })}
                  className="inline-flex items-center gap-2 rounded-full border border-[#E2E4EB] bg-[#FFFFFF] px-6 py-3.5 text-sm font-semibold text-[#1B1F3B] shadow-[0_2px_10px_rgba(27,31,59,0.04)] backdrop-blur-sm transition-all duration-300 hover:border-[#7C5DFA] hover:text-[#7C5DFA] dark:border-[#2A305A] dark:bg-[#151934] dark:text-white dark:hover:border-[#7C5DFA]"
                >
                  <Download size={16} />
                  <span>Download Resume</span>
                </a>

                {/* Socials share the CTA row so the stats fit above the fold. */}
                <div className="flex items-center gap-2.5 sm:border-l sm:border-[#E2E4EB] sm:pl-4 dark:sm:border-[#2A305A]">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    onClick={() => track('social-click', { network: social.id, from: 'hero' })}
                    className="flex size-10 items-center justify-center rounded-full border border-[#E2E4EB] bg-[#FFFFFF] text-[#1B1F3B] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7C5DFA] hover:bg-[#E2E4FA] hover:text-[#7C5DFA] dark:border-[#2A305A] dark:bg-[#151934] dark:text-slate-300 dark:hover:bg-[#7C5DFA]/20 dark:hover:text-white"
                  >
                    <Icon icon={social.icon} size={16} />
                  </a>
                ))}
                </div>
              </div>
            </Reveal>

            {/* Headline stats: count up from 0 once revealed and in view */}
            <Reveal afterReveal direction="up" delay={0.4}>
              <div className="mt-9 grid max-w-xl grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
                {headlineMetrics.map((metric) => (
                  <StatCounter key={metric.label} metric={metric} start={revealed} />
                ))}
              </div>
            </Reveal>

            {/* 3 Feature Badges below buttons */}
            <Reveal afterReveal direction="up" delay={0.5}>
              <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-[#E2E4EB] dark:border-[#2A305A]">
                {heroFeaturePills.map((badge) => (
                  <div
                    key={badge.title}
                    className="flex items-center gap-2 rounded-full border border-[#E2E4EB] bg-[#FFFFFF] px-3.5 py-1.5 text-xs font-medium text-[#1B1F3B] shadow-sm backdrop-blur-sm dark:border-[#2A305A] dark:bg-[#151934] dark:text-[#E2E4FA]"
                  >
                    <Icon icon={badge.icon} size={14} className="text-[#7C5DFA]" />
                    <span>{badge.title}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* ── Right Visual Column (5 cols) ──────────────────────────────── */}
          <div className="relative flex justify-center lg:col-span-5 lg:self-start lg:pt-2">
            <Reveal afterReveal direction="left" delay={0.2}>
              <motion.div
                ref={tiltRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                style={{
                  rotateX: reduceMotion ? 0 : rotateX,
                  rotateY: reduceMotion ? 0 : rotateY,
                  transformPerspective: 1000,
                }}
                className="relative mx-auto flex w-fit items-center justify-center"
              >
                {/* Outer Glow Ring */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -m-6 rounded-3xl bg-gradient-to-tr from-[#7C5DFA]/20 via-[#4A3E8C]/15 to-[#E2E4FA]/40 blur-2xl dark:from-[#7C5DFA]/25 dark:via-[#4A3E8C]/25 dark:to-transparent"
                />

                {/* Pointer-following glass highlight */}
                {!reduceMotion ? (
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 rounded-3xl opacity-60 mix-blend-soft-light"
                    style={{ background: glowBackground }}
                  />
                ) : null}

                {/* Portrait Card */}
                <div className="relative aspect-square w-[min(84vw,440px)] overflow-hidden rounded-3xl border border-[#E2E4EB] bg-[#FFFFFF] p-2 shadow-[0_20px_50px_-15px_rgba(27,31,59,0.12)] backdrop-blur-md dark:border-[#2A305A] dark:bg-[#151934] dark:shadow-[0_20px_60px_-15px_rgba(124,93,250,0.35)]">
                  <img
                    src="/images/hero-portrait-960.webp"
                    srcSet="/images/hero-portrait-480.webp 480w, /images/hero-portrait-960.webp 960w"
                    sizes="(min-width: 640px) 440px, 84vw"
                    width={960}
                    height={960}
                    alt={`${identity.fullName} — AI Developer`}
                    className="h-full w-full rounded-2xl object-cover"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>

                {/* Floating badges sit on the four corners: the portrait has its
                    own "AI" (left-middle) and "</>" (right-upper) icons. */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-3 -right-2 sm:-right-4 flex items-center gap-2 rounded-2xl border border-[#E2E4EB] bg-[#FFFFFF] px-3.5 py-2 shadow-[0_8px_24px_rgba(27,31,59,0.08)] backdrop-blur-md dark:border-[#2A305A] dark:bg-[#151934]"
                >
                  <Brain size={16} className="text-[#7C5DFA]" />
                  <span className="text-xs font-bold text-[#1B1F3B] dark:text-white">LLMs</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -top-3 -left-2 sm:-left-4 flex items-center gap-2 rounded-2xl border border-[#E2E4EB] bg-[#FFFFFF] px-3.5 py-2 shadow-[0_8px_24px_rgba(27,31,59,0.08)] backdrop-blur-md dark:border-[#2A305A] dark:bg-[#151934]"
                >
                  <Layers size={16} className="text-[#7C5DFA]" />
                  <span className="text-xs font-bold text-[#1B1F3B] dark:text-white">RAG</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-6 -left-2 sm:-left-4 flex items-center gap-2 rounded-2xl border border-[#E2E4EB] bg-[#FFFFFF] px-3.5 py-2 shadow-[0_8px_24px_rgba(27,31,59,0.08)] backdrop-blur-md dark:border-[#2A305A] dark:bg-[#151934]"
                >
                  <Bot size={16} className="text-[#7C5DFA]" />
                  <span className="text-xs font-bold text-[#1B1F3B] dark:text-white">AI Agents</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  className="absolute bottom-6 -right-2 sm:-right-4 flex items-center gap-2 rounded-2xl border border-[#E2E4EB] bg-[#FFFFFF] px-3.5 py-2 shadow-[0_8px_24px_rgba(27,31,59,0.08)] backdrop-blur-md dark:border-[#2A305A] dark:bg-[#151934]"
                >
                  <Code size={16} className="text-[#7C5DFA]" />
                  <span className="text-xs font-bold text-[#1B1F3B] dark:text-white">Product Development</span>
                </motion.div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
