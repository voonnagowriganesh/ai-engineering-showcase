import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Brain,
  Code,
  GraduationCap,
  Layers,
  Sparkles,
  X,
  CheckCircle2,
} from 'lucide-react';
import { education, experiences, identity, strengths } from '@/data/profile';
import { useScrollLock } from '@/hooks/useScroll';
import { Reveal } from '@/components/ui/Reveal';

export function AboutAndExperience(): React.JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);

  // Same fix as the project modal: this site scrolls via Lenis, which runs
  // its own rAF loop independent of CSS overflow, so plain `overflow-y-auto`
  // on the modal isn't enough once its content (now 3 education entries
  // instead of 1) outgrows max-h-[85vh] and actually needs to scroll.
  useScrollLock(modalOpen);

  return (
    <section className="relative overflow-hidden bg-[#f7f6f0] py-20 text-[#071910] transition-colors dark:bg-[#07180f] dark:text-white">
      {/* Target anchors for navigation */}
      <div id="about" className="absolute -top-24" />
      <div id="experience" className="absolute -top-24" />

      <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* ══════════════════════════════════════════════════════════════════
              LEFT CARD: ABOUT ME (6 cols)
              ══════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-7 shadow-sm transition-all dark:border-emerald-500/20 dark:bg-[#0b2115] sm:p-9 lg:col-span-6">
            <div>
              {/* Pill badge */}
              <Reveal direction="down" distance={10}>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  <span>ABOUT ME</span>
                </div>
              </Reveal>

              {/* Desk / Workspace Picture & Title */}
              <div className="mt-5 grid gap-6 sm:grid-cols-[140px_1fr] sm:items-center">
                <div className="relative overflow-hidden rounded-2xl border border-stone-200 dark:border-emerald-500/30">
                  <img
                    src="/images/about-me.jpg"
                    alt="Writing code at a laptop"
                    className="h-36 w-full object-cover transition-transform duration-500 hover:scale-105"
                    style={{ objectPosition: '25% 50%' }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                <div>
                  <Reveal direction="up" delay={0.1}>
                    <h2 className="font-display text-2xl font-bold tracking-tight text-[#0a1e12] dark:text-white sm:text-3xl">
                      Turning Ideas into Intelligent Products.
                    </h2>
                  </Reveal>
                </div>
              </div>

              {/* Bio description */}
              <Reveal direction="up" delay={0.15}>
                <p className="mt-6 text-[0.9375rem] leading-relaxed text-stone-600 dark:text-emerald-100/80">
                  I'm an AI Developer currently at{' '}
                  <strong className="font-semibold text-emerald-700 dark:text-emerald-300">
                    Techgene Solutions
                  </strong>
                  , focused on building AI-powered products, scalable backend systems and practical
                  applications using LLMs, RAG and modern software technologies.
                </p>
              </Reveal>

              {/* 3 Badges */}
              <Reveal direction="up" delay={0.2}>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <Brain size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span>AI & LLM Applications</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <Code size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Backend Development</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <Layers size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Product Engineering</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Button: Know More About Me */}
            <Reveal direction="up" delay={0.25} className="mt-8">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="group inline-flex items-center gap-2 rounded-full bg-[#071910] px-6 py-3 text-xs font-bold text-white shadow-md transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg dark:bg-emerald-500 dark:text-[#04140b] dark:hover:bg-emerald-400"
              >
                <span>Know More About Me</span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </Reveal>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              RIGHT CARD: PROFESSIONAL EXPERIENCE (6 cols)
              ══════════════════════════════════════════════════════════════════ */}
          <div className="rounded-3xl border border-stone-200/80 bg-white p-7 shadow-sm transition-all dark:border-emerald-500/20 dark:bg-[#0b2115] sm:p-9 lg:col-span-6">
            {/* Pill badge */}
            <Reveal direction="down" distance={10}>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>MY JOURNEY</span>
              </div>
            </Reveal>

            {/* Title */}
            <Reveal direction="up" delay={0.1}>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#0a1e12] dark:text-white sm:text-3xl">
                Professional Experience
              </h2>
            </Reveal>

            {/* Timeline List */}
            <div className="relative mt-8 space-y-7 before:absolute before:top-3 before:bottom-3 before:left-5 before:w-0.5 before:bg-emerald-200 dark:before:bg-emerald-800/60">
              {experiences.map((exp, index) => (
                <Reveal key={exp.id} direction="up" delay={0.1 + index * 0.08}>
                  <div className="relative flex items-start gap-4 pl-1">
                    {/* Company Logo in Squircle */}
                    <div className="relative z-10 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-stone-200 bg-white p-1.5 shadow-sm dark:border-emerald-500/30 dark:bg-[#06180f]">
                      {exp.logo ? (
                        <img
                          src={exp.logo}
                          alt={exp.company}
                          className="size-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="font-bold text-xs text-emerald-600">
                          {exp.company[0]}
                        </span>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                        <h3 className="font-display text-base font-bold text-[#0a1e12] dark:text-white">
                          {exp.company}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[0.6875rem] font-bold ${
                            exp.status === 'current'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                              : exp.company.includes('Zennial')
                                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {exp.badgeText ?? exp.period}
                        </span>
                      </div>

                      <p className="mt-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        {exp.role}
                      </p>

                      <p className="mt-1.5 text-xs leading-relaxed text-stone-600 dark:text-emerald-100/70">
                        {exp.summary}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ABOUT ME MODAL (Detailed profile, education, strengths)
          ══════════════════════════════════════════════════════════════════════ */}
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
              // See FeaturedProjects.tsx's modal for why this is required:
              // without it, Lenis blocks the modal's own scroll too while
              // the page behind it is locked.
              data-lenis-prevent
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-emerald-500/30 bg-[#071910] p-6 text-white shadow-2xl sm:p-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">
                      About {identity.fullName}
                    </h3>
                    <p className="text-xs text-emerald-400">{identity.role} · {identity.location}</p>
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

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                    Professional Summary
                  </h4>
                  <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-300">
                    {identity.supportingStatement.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                    Education
                  </h4>
                  <div className="mt-2 space-y-2.5">
                    {education.map((entry) => (
                      <div
                        key={entry.degree}
                        className="rounded-2xl border border-emerald-500/20 bg-emerald-950/40 p-4"
                      >
                        <div className="flex items-start gap-3">
                          <GraduationCap size={20} className="mt-0.5 text-emerald-400 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                              <p className="font-bold text-sm text-white">{entry.degree}</p>
                              <span className="font-mono text-2xs text-slate-400">{entry.period}</span>
                            </div>
                            {entry.specialisation ? (
                              <p className="text-xs text-emerald-300">{entry.specialisation}</p>
                            ) : null}
                            <p className="mt-1 text-xs text-slate-400">
                              {entry.institution}
                              {entry.university ? ` — ${entry.university}` : ''}
                              {', '}
                              {entry.location}
                            </p>
                            {entry.cgpa ? (
                              <p className="mt-1 text-xs font-semibold text-emerald-400">
                                CGPA: {entry.cgpa}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                    Core Capabilities & Strengths
                  </h4>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {strengths.map((str) => (
                      <div
                        key={str.title}
                        className="flex items-center gap-2.5 rounded-xl border border-emerald-500/15 bg-emerald-950/30 px-3 py-2 text-xs text-slate-200"
                      >
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        <span>{str.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
