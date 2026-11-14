import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Bot, Brain, Code2, Layers } from 'lucide-react';
import { identity, headlineMetrics } from '../data/content';
import { BackgroundArt } from './BackgroundArt';
import { useTilt } from '../hooks/useTilt';
import { useCountUp } from '../hooks/useCountUp';

const floatingBadges = [
  { label: 'LLMs', icon: Brain, pos: 'top-6 -left-6 sm:left-2', delay: 0 },
  { label: 'RAG', icon: Layers, pos: 'top-24 -right-8 sm:right-0', delay: 0.4 },
  { label: 'AI Agents', icon: Bot, pos: 'bottom-28 -left-10 sm:-left-4', delay: 0.8 },
  { label: 'Product Dev', icon: Code2, pos: 'bottom-4 right-2', delay: 1.2 },
];

function Metric({ countTo, suffix, label }: (typeof headlineMetrics)[number]) {
  const { ref, value: animated } = useCountUp(countTo);
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

  return (
    <section id="hero" className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20">
      <BackgroundArt variant="hero" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-16 px-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-signal/20 bg-signal/5 px-4 py-1.5 text-xs font-semibold text-signal"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-signal" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="label-mono">{identity.availability}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-[2.6rem] font-medium leading-[1.05] text-ink sm:text-6xl lg:text-[4.2rem]"
          >
            Hi, I&rsquo;m{' '}
            <span className="block text-gradient-signal">Voonna Gowri Ganesh</span>
            <span className="block">building intelligent products.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            {identity.tagline} Based in {identity.location} — I work across AI integration, backend
            systems and product-grade frontends.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 grid max-w-xl grid-cols-4 gap-4"
          >
            {headlineMetrics.map((m) => (
              <Metric key={m.label} {...m} />
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto hidden h-[26rem] w-[26rem] max-w-full [perspective:1200px] sm:block lg:h-[30rem] lg:w-[30rem]"
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
              className="absolute inset-6 rounded-[2rem] bg-gradient-to-br from-signal via-signal-light to-amber opacity-90"
              style={{ transform: 'translateZ(20px)' }}
            />
            <div
              className="absolute inset-6 flex flex-col items-center justify-center rounded-[2rem] text-center text-paper"
              style={{ transform: 'translateZ(40px)' }}
            >
              <span className="font-display text-7xl font-semibold">{identity.initials}</span>
              <span className="label-mono mt-3 text-xs text-paper/80">AI DEVELOPER</span>
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
