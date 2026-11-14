import { Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Download, Sparkles, Brain, Layers, Bot, Code } from 'lucide-react';
import { heroFeaturePills, identity, socials } from '@/data/profile';
import { useScrollTo } from '@/hooks/useScroll';
import { NeuralFieldCanvas } from '@/components/canvas/NeuralFieldCanvas';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/primitives';

const AuroraField = lazy(() =>
  import('@/components/canvas/AuroraField').then((module) => ({ default: module.AuroraField })),
);

export function Hero(): React.JSX.Element {
  const scrollTo = useScrollTo();

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gradient-to-b from-[#04120a] via-[#071f13] to-[#05160d] pt-28 pb-16 text-white"
    >
      {/* ── Visual Ambient Canvas Backdrops ─────────────────────────────── */}
      <Suspense fallback={null}>
        <AuroraField />
      </Suspense>
      <NeuralFieldCanvas />

      {/* Bioluminescent emerald ambient glow spots */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -left-20 size-[32rem] rounded-full bg-emerald-500/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-20 size-[36rem] rounded-full bg-emerald-400/15 blur-[140px]"
      />

      <div className="relative mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ── Left Content Column (7 cols) ──────────────────────────────── */}
          <div className="lg:col-span-7">
            {/* Pill: AI Developer @ Techgene Solutions */}
            <Reveal direction="down" distance={14}>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-md">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <Sparkles size={12} className="animate-pulse" />
                </span>
                <span className="text-xs font-semibold tracking-wide text-emerald-300">
                  AI Developer @ Techgene Solutions
                </span>
              </div>
            </Reveal>

            {/* Headline */}
            <div className="mt-5">
              <Reveal direction="up" delay={0.1}>
                <h1 className="font-display tracking-tight text-white">
                  <span className="block text-2xl font-light text-slate-300 sm:text-3xl">
                    Hi, I'm
                  </span>
                  <span className="mt-1 block text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
                    <span className="bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(52,211,153,0.35)]">
                      {identity.fullName}
                    </span>
                  </span>
                  <span className="mt-2 block text-2xl font-bold text-emerald-400 sm:text-3xl lg:text-4xl">
                    Building Intelligent Products with AI.
                  </span>
                </h1>
              </Reveal>

              <Reveal direction="up" delay={0.2}>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                  {identity.supportingStatement[0]}
                </p>
              </Reveal>
            </div>

            {/* Buttons: Explore My Work & Download Resume */}
            <Reveal direction="up" delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => scrollTo('projects', -20)}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-green-400 px-7 py-3.5 text-sm font-bold text-[#031c0e] shadow-[0_0_25px_rgba(52,211,153,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(52,211,153,0.6)]"
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
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-6 py-3.5 text-sm font-semibold text-emerald-300 backdrop-blur-sm transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-500/20 hover:text-white"
                >
                  <Download size={16} />
                  <span>Download Resume</span>
                </a>
              </div>
            </Reveal>

            {/* Social Icons Row */}
            <Reveal direction="up" delay={0.4}>
              <div className="mt-8 flex items-center gap-3">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-950/50 text-slate-300 shadow-[0_0_12px_rgba(16,185,129,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
                  >
                    <Icon icon={social.icon} size={16} />
                  </a>
                ))}
              </div>
            </Reveal>

            {/* 3 Feature Badges below buttons */}
            <Reveal direction="up" delay={0.5}>
              <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-emerald-500/20">
                {heroFeaturePills.map((badge) => (
                  <div
                    key={badge.title}
                    className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-[#061e12]/80 px-3.5 py-1.5 text-xs font-medium text-emerald-200/90 shadow-[0_0_10px_rgba(16,185,129,0.08)] backdrop-blur-sm"
                  >
                    <Icon icon={badge.icon} size={14} className="text-emerald-400" />
                    <span>{badge.title}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* ── Right Visual Column (5 cols) ──────────────────────────────── */}
          <div className="relative flex justify-center lg:col-span-5">
            <Reveal direction="left" delay={0.2}>
              {/* w-fit, not max-w-lg: the wrapper must shrink to the photo's
                  actual width, or the floating badges below (anchored to
                  this wrapper's edge, not the photo's) drift away from it. */}
              <div className="relative mx-auto flex w-fit items-center justify-center">
                {/* Outer Glow Ring */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -m-6 rounded-full bg-gradient-to-tr from-emerald-500/20 via-emerald-400/30 to-green-300/10 blur-2xl"
                />

                {/* Portrait — the user's own composite (face + laptop + AI
                    brain graphic), supplied to replace the plain passport
                    photo. No UI chrome is baked into it, so it composites
                    cleanly with the live floating badges below without the
                    duplication the earlier generated image caused. Served as
                    a resized, compressed JPEG (142KB) rather than the
                    original 2MB PNG — the preloader's image-wait fix only
                    helps if the one eager image left still loads fast. */}
                <div className="relative aspect-[11/10] w-full max-w-[460px] overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/60 to-[#04140b] p-2 shadow-[0_0_50px_rgba(16,185,129,0.25)] backdrop-blur-md">
                  <img
                    src="/images/hero-portrait.jpg"
                    alt={`${identity.fullName} — AI Developer`}
                    className="h-full w-full rounded-2xl object-cover"
                    loading="eager"
                  />

                  {/* Radiating subtle circuit overlay */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-[#04140b]/80 via-transparent to-transparent" />
                </div>

                {/* Floating Interactive Badges with Spring Motion */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-3 -right-2 sm:-right-4 flex items-center gap-2 rounded-2xl border border-emerald-400/40 bg-[#051f13]/90 px-3.5 py-2 shadow-[0_8px_25px_rgba(0,0,0,0.5)] backdrop-blur-md"
                >
                  <Brain size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold text-white">LLMs</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute top-20 -right-4 sm:-right-6 flex items-center gap-2 rounded-2xl border border-emerald-400/40 bg-[#051f13]/90 px-3.5 py-2 shadow-[0_8px_25px_rgba(0,0,0,0.5)] backdrop-blur-md"
                >
                  <Layers size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold text-white">RAG</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute top-44 -right-2 sm:-right-4 flex items-center gap-2 rounded-2xl border border-emerald-400/40 bg-[#051f13]/90 px-3.5 py-2 shadow-[0_8px_25px_rgba(0,0,0,0.5)] backdrop-blur-md"
                >
                  <Bot size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold text-white">AI Agents</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  className="absolute bottom-6 -right-2 sm:-right-4 flex items-center gap-2 rounded-2xl border border-emerald-400/40 bg-[#051f13]/90 px-3.5 py-2 shadow-[0_8px_25px_rgba(0,0,0,0.5)] backdrop-blur-md"
                >
                  <Code size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold text-white">Product Development</span>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
