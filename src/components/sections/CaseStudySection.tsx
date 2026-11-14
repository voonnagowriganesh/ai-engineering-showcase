import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Mic, Sparkles, X } from 'lucide-react';
import { featuredCaseStudy } from '@/data/profile';
import { Reveal } from '@/components/ui/Reveal';

export function CaseStudySection(): React.JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#f7f6f0] pb-24 text-[#071910] transition-colors dark:bg-[#06180f] dark:text-white">
      <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* ══════════════════════════════════════════════════════════════════
              LEFT SIDE: INFO & ACTIONS (3.5 cols)
              ══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4">
            <Reveal direction="down" distance={10}>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>PROJECT CASE STUDY</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.1}>
              <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-[#0a1e12] dark:text-white sm:text-3xl">
                {featuredCaseStudy.title}
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.15}>
              <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-emerald-100/70">
                {featuredCaseStudy.subtitle}
              </p>
            </Reveal>

            {/* CTA Button */}
            <Reveal direction="up" delay={0.2}>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#071910] px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                >
                  <span>View Case Study</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </Reveal>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              CENTER: DEVICE MOCKUP — a drawn UI, not a real screenshot, so it
              never risks baking in a claim this product doesn't make (5 cols)
              ══════════════════════════════════════════════════════════════════ */}
          <div className="relative flex justify-center lg:col-span-5">
            <Reveal direction="up" delay={0.2}>
              <div className="relative mx-auto w-full max-w-md sm:max-w-lg">
                <div className="relative overflow-hidden rounded-2xl border border-stone-300/80 bg-[#05160d] p-5 shadow-2xl transition-transform duration-500 hover:scale-[1.02] dark:border-emerald-500/30">
                  <div className="flex gap-1.5 pb-4">
                    <span className="size-2 rounded-full bg-emerald-800" />
                    <span className="size-2 rounded-full bg-emerald-800" />
                    <span className="size-2 rounded-full bg-emerald-800" />
                  </div>
                  <div className="rounded-xl bg-[#0b2115] p-5">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-emerald-500/40 bg-emerald-500/10">
                        <Mic size={18} className="text-emerald-400" />
                      </span>
                      <div>
                        <p className="font-mono text-xs font-semibold text-emerald-400">
                          ● LISTENING
                        </p>
                        <p className="mt-0.5 text-[0.6875rem] text-slate-400">
                          Agent session active
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex h-9 items-end gap-1" aria-hidden="true">
                      {[40, 70, 30, 90, 50, 75, 35, 60, 45, 80, 25].map((height, i) => (
                        <span
                          key={i}
                          className="w-1 flex-1 rounded-full bg-emerald-400/70"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              RIGHT: KEY HIGHLIGHTS & ISOMETRIC CUBE (3 cols)
              ══════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <Reveal direction="left" delay={0.25}>
              <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm dark:border-emerald-500/20 dark:bg-[#0b2115]">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-emerald-500/15">
                  <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-display text-sm font-bold text-[#0a1e12] dark:text-white">
                    Key Highlights
                  </h3>
                </div>

                <ul className="mt-3.5 space-y-2.5">
                  {featuredCaseStudy.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2 text-xs leading-snug text-stone-700 dark:text-emerald-100/80">
                      <CheckCircle2
                        size={15}
                        className="mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0"
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* 3D Isometric Server / Data Cube Graphic */}
            <Reveal direction="up" delay={0.35}>
              <div className="flex justify-end">
                <img
                  src={featuredCaseStudy.cubeImage}
                  alt="Architecture node"
                  className="h-20 w-auto object-contain drop-shadow-[0_10px_20px_rgba(16,185,129,0.3)] transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Case Study In-Depth Modal */}
      <AnimatePresence>
        {modalOpen ? (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-emerald-500/30 bg-[#071910] p-6 text-white shadow-2xl sm:p-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">
                      Case Study: {featuredCaseStudy.title}
                    </h3>
                    <p className="text-xs text-emerald-400">Production Architecture & Implementation</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-emerald-900/40 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Metrics Row */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {featuredCaseStudy.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-2xl border border-emerald-500/20 bg-emerald-950/40 p-4 text-center"
                  >
                    <span className="font-display block text-2xl font-bold text-emerald-400">
                      {m.value}
                    </span>
                    <span className="mt-1 block text-xs text-slate-300">{m.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                    System Architecture
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    A multi-agent system built on FastAPI, LangGraph and Gemini. Speech comes in through
                    Whisper, routes through specialised agents that ground their reasoning in a
                    PostgreSQL and pgvector RAG pipeline, and comes back out through Edge TTS — with
                    Redis caching and Celery handling the asynchronous work in between.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                    Key Implementation Details
                  </h4>
                  <ul className="mt-2.5 space-y-2">
                    {featuredCaseStudy.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <CheckCircle2 size={15} className="mt-0.5 text-emerald-400 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
