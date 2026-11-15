import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Bot, Brain, Code2, Download, Layers } from 'lucide-react';
import { identity, headlineMetrics } from '../data/content';
import { BackgroundArt } from './BackgroundArt';
import { DecodeText, type DecodeWord } from './DecodeText';
import { track } from '../lib/analytics';
import { useTilt } from '../hooks/useTilt';
import { useCountUp } from '../hooks/useCountUp';
import { usePageRevealed } from '../hooks/usePageRevealed';

// Corners only: the portrait carries its own "AI" and "</>" badges at the
// left-middle and right-middle edges, so these stay clear of them.
const floatingBadges = [
  { label: 'LLMs', icon: Brain, pos: 'top-3 -left-2 sm:top-4 sm:-left-4', delay: 0 },
  { label: 'RAG', icon: Layers, pos: 'top-3 -right-2 sm:top-4 sm:-right-4', delay: 0.4 },
  { label: 'AI Agents', icon: Bot, pos: 'bottom-3 -left-2 sm:bottom-4 sm:-left-4', delay: 0.8 },
  { label: 'Product Dev', icon: Code2, pos: 'bottom-3 -right-2 sm:bottom-4 sm:-right-4', delay: 1.2 },
];

// Module-level so DecodeText gets stable arrays and doesn't restart on re-render.
const ROLE_WORDS: readonly DecodeWord[] = identity.availability
  .split(' ')
  .map((text) => (text === '@' ? { text, className: 'text-amber' } : { text }));
const NAME_WORDS: readonly DecodeWord[] = identity.name
  .split(' ')
  .map((text) => ({ text, className: 'text-gradient-signal' }));

function Metric({ countTo, suffix, label, revealed }: (typeof headlineMetrics)[number] & { revealed: boolean }) {
  const { ref, value: animated } = useCountUp(countTo, 1400, revealed);
  return (
    <div className="border-l border-ink/10 pl-4 first:border-l-0 first:pl-0">
      <div className="font-display text-3xl font-semibold text-ink sm:text-4xl">
        <span ref={ref}>
          {animated}
          {suffix ?? ''}
        </span>
      </div>
      <div className="mt-1 text-xs leading-snug text-ink-soft sm:text-sm">{label}</div>
    </div>
  );
}

export function Hero() {
  const tilt = useTilt(8);
  // Entrances wait for the preloader's reveal so they play in view, not behind it.
  const revealed = usePageRevealed();

  return (
    <section id="hero" className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20">
      <BackgroundArt variant="hero" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-16 px-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={revealed ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-signal/20 bg-signal/5 px-4 py-1.5 text-xs font-semibold text-signal"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-signal" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <DecodeText
              mode="sequence"
              words={ROLE_WORDS}
              delay={150}
              glyphClassName="text-signal/50"
              className="label-mono"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={revealed ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-[2.6rem] font-medium leading-[1.05] text-ink sm:text-6xl lg:text-[4.2rem]"
          >
            Hi, I&rsquo;m{' '}
            <DecodeText mode="center" words={NAME_WORDS} delay={250} continuousGradient className="block" />
            <span className="block">building intelligent products.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={revealed ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            {identity.tagline} Based in {identity.location} — I work across AI integration, backend
            systems and product-grade frontends.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={revealed ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper shadow-lift transition hover:-translate-y-0.5"
            >
              View my work
              <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-signal hover:text-signal"
            >
              Get in touch
            </a>
            <a
              href={identity.resumeUrl}
              download={identity.resumeFileName}
              onClick={() => track('resume-download', { from: 'hero' })}
              className="group inline-flex items-center gap-2 px-2 py-3.5 text-sm font-semibold text-ink-soft transition hover:text-signal"
            >
              <Download size={15} className="transition group-hover:translate-y-0.5" />
              Résumé
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={revealed ? { opacity: 1 } : undefined}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 grid max-w-xl grid-cols-4 gap-4"
          >
            {headlineMetrics.map((m) => (
              <Metric key={m.label} {...m} revealed={revealed} />
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={revealed ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.2 }}
          // self-start: the text column is far taller than the portrait, so
          // centring left an empty band above the photo on landing. Top-aligned
          // it lines up with the role pill and sits fully in the first screen.
          className="relative mx-auto aspect-square w-full max-w-[20rem] [perspective:1200px] sm:h-[26rem] sm:w-[26rem] sm:max-w-full lg:mt-1 lg:h-[30rem] lg:w-[30rem] lg:self-start"
        >
          <div
            ref={tilt.ref}
            onPointerMove={tilt.onPointerMove}
            onPointerLeave={tilt.onPointerLeave}
            style={{
              transform: `rotateX(${tilt.tilt.rotateX}deg) rotateY(${tilt.tilt.rotateY}deg)`,
              transformStyle: 'preserve-3d',
            }}
            className="relative h-full w-full rounded-[2.5rem] border border-white/40 bg-gradient-to-br from-white/70 to-white/20 shadow-card backdrop-blur-sm transition-transform duration-150 ease-out"
          >
            <div
              className="absolute inset-4 overflow-hidden rounded-[1.75rem] sm:inset-6 sm:rounded-[2rem]"
              style={{ transform: 'translateZ(30px)' }}
            >
              <img
                src="/images/profile-960.webp"
                srcSet="/images/profile-480.webp 480w, /images/profile-960.webp 960w"
                sizes="(min-width: 1024px) 27rem, (min-width: 640px) 23rem, 18rem"
                width={960}
                height={960}
                alt={identity.name}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>

            {floatingBadges.map((badge) => (
              <motion.div
                key={badge.label}
                className={`absolute ${badge.pos} flex items-center gap-2 rounded-2xl border border-white/60 bg-paper/95 px-3 py-2 text-xs font-semibold text-ink shadow-card`}
                style={{ transform: 'translateZ(70px)' }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: badge.delay, ease: 'easeInOut' }}
              >
                <badge.icon size={14} className="text-signal" />
                {badge.label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.button
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ink-faint"
        aria-label="Scroll to About"
      >
        <span className="label-mono text-[11px]">Scroll</span>
        <ArrowDown size={16} />
      </motion.button>
    </section>
  );
}
