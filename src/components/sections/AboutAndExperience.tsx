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
import { Reveal } from '@/components/ui/Reveal';

export function AboutAndExperience(): React.JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#F4F5F8] py-20 text-[#1B1F3B] transition-colors dark:bg-[#0B0E1E] dark:text-white">
      {/* Target anchors for navigation */}
      <div id="about" className="absolute -top-24" />
      <div id="experience" className="absolute -top-24" />

      <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* ══════════════════════════════════════════════════════════════════
              LEFT CARD: ABOUT ME (6 cols)
              ══════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#E2E4EB] bg-[#FFFFFF] p-7 shadow-[0_10px_30px_-10px_rgba(27,31,59,0.06)] transition-all dark:border-[#2A305A] dark:bg-[#151934] sm:p-9 lg:col-span-6">
            <div>
              {/* Pill badge */}
              <Reveal direction="down" distance={10}>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#E2E4FA] px-3.5 py-1 text-xs font-bold text-[#1B1F3B] dark:bg-[#7C5DFA]/20 dark:text-[#E2E4FA]">
                  <span className="size-1.5 rounded-full bg-[#7C5DFA]" />
                  <span>ABOUT ME</span>
                </div>
              </Reveal>

              {/* Desk / Workspace Picture & Title */}
              <div className="mt-5 grid gap-6 sm:grid-cols-[140px_1fr] sm:items-center">
                <div className="relative overflow-hidden rounded-2xl border border-[#E2E4EB] dark:border-[#2A305A]">
                  <img
                    src="/images/about_desk.png"
                    alt="Developer workspace"
                    className="h-36 w-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                <div>
                  <Reveal direction="up" delay={0.1}>
                    <h2 className="font-display text-2xl font-bold tracking-tight text-[#1B1F3B] sm:text-3xl dark:text-white">
                      Turning Ideas into Intelligent Products.
                    </h2>
                  </Reveal>
                </div>
              </div>

              {/* Bio description */}
              <Reveal direction="up" delay={0.15}>
                <p className="mt-6 text-[0.9375rem] leading-relaxed text-[#374151] dark:text-[#D1D5DB]">
                  I'm an AI Developer currently at{' '}
                  <strong className="font-semibold text-[#4A3E8C] dark:text-[#9277FF]">
                    Techgene Solutions
                  </strong>
                  , focused on building AI-powered products, scalable backend systems and practical
                  applications using LLMs, RAG and modern software technologies.
                </p>
              </Reveal>

              {/* 3 Badges */}
              <Reveal direction="up" delay={0.2}>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <div className="flex items-center gap-2 rounded-xl border border-[#E2E4EB] bg-[#F4F5F8] px-3 py-1.5 text-xs font-semibold text-[#1B1F3B] dark:border-[#2A305A] dark:bg-[#1D2245] dark:text-[#E2E4FA]">
                    <Brain size={14} className="text-[#7C5DFA]" />
                    <span>AI & LLM Applications</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-[#E2E4EB] bg-[#F4F5F8] px-3 py-1.5 text-xs font-semibold text-[#1B1F3B] dark:border-[#2A305A] dark:bg-[#1D2245] dark:text-[#E2E4FA]">
                    <Code size={14} className="text-[#7C5DFA]" />
                    <span>Backend Development</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-[#E2E4EB] bg-[#F4F5F8] px-3 py-1.5 text-xs font-semibold text-[#1B1F3B] dark:border-[#2A305A] dark:bg-[#1D2245] dark:text-[#E2E4FA]">
                    <Layers size={14} className="text-[#7C5DFA]" />
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
                className="group inline-flex items-center gap-2 rounded-full bg-[#1B1F3B] px-6 py-3 text-xs font-bold text-white shadow-md transition-all duration-300 hover:bg-[#4A3E8C] hover:shadow-lg dark:bg-[#7C5DFA] dark:hover:bg-[#9277FF]"
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
          <div className="rounded-3xl border border-[#E2E4EB] bg-[#FFFFFF] p-7 shadow-[0_10px_30px_-10px_rgba(27,31,59,0.06)] transition-all dark:border-[#2A305A] dark:bg-[#151934] sm:p-9 lg:col-span-6">
            {/* Pill badge */}
            <Reveal direction="down" distance={10}>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E2E4FA] px-3.5 py-1 text-xs font-bold text-[#1B1F3B] dark:bg-[#7C5DFA]/20 dark:text-[#E2E4FA]">
                <span className="size-1.5 rounded-full bg-[#7C5DFA]" />
                <span>MY JOURNEY</span>
              </div>
            </Reveal>

            {/* Title */}
            <Reveal direction="up" delay={0.1}>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#1B1F3B] sm:text-3xl dark:text-white">
                Professional Experience
              </h2>
            </Reveal>

            {/* Timeline List */}
            <div className="relative mt-8 space-y-7 before:absolute before:top-3 before:bottom-3 before:left-5 before:w-0.5 before:bg-[#E2E4EB] dark:before:bg-[#2A305A]">
              {experiences.map((exp, index) => (
                <Reveal key={exp.id} direction="up" delay={0.1 + index * 0.08}>
                  <div className="relative flex items-start gap-4 pl-1">
                    {/* Company Logo in Squircle */}
                    <div className="relative z-10 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E2E4EB] bg-[#FFFFFF] p-1.5 shadow-sm dark:border-[#2A305A] dark:bg-[#0B0E1E]">
                      {exp.logo ? (
                        <img
                          src={exp.logo}
                          alt={exp.company}
                          className="size-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-xs font-bold text-[#7C5DFA]">
                          {exp.company[0]}
                        </span>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                        <h3 className="font-display text-base font-bold text-[#1B1F3B] dark:text-white">
                          {exp.company}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[0.6875rem] font-bold ${
                            exp.status === 'current'
                              ? 'bg-[#E2E4FA] text-[#1B1F3B] dark:bg-[#7C5DFA]/25 dark:text-white'
                              : 'bg-[#F4F5F8] text-[#4A3E8C] border border-[#E2E4EB] dark:border-[#2A305A] dark:bg-[#1D2245] dark:text-[#D1D5DB]'
                          }`}
                        >
                          {exp.badgeText ?? exp.period}
                        </span>
                      </div>

                      <p className="mt-0.5 text-xs font-semibold text-[#4A3E8C] dark:text-[#9277FF]">
                        {exp.role}
                      </p>

                      <p className="mt-1.5 text-xs leading-relaxed text-[#374151] dark:text-[#D1D5DB]">
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

      {/* ══════════════════════════════════════════════════════════════════
          ABOUT ME MODAL (Detailed profile, education, strengths)
          ══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {modalOpen ? (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-[#1B1F3B]/60 backdrop-blur-md dark:bg-black/75"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#E2E4EB] bg-[#FFFFFF] p-6 text-[#1B1F3B] shadow-2xl dark:border-[#2A305A] dark:bg-[#151934] dark:text-white sm:p-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E4EB] dark:border-[#2A305A]">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#E2E4FA] text-[#7C5DFA] dark:bg-[#7C5DFA]/20 dark:text-[#9277FF]">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#1B1F3B] dark:text-white">
                      About {identity.fullName}
                    </h3>
                    <p className="text-xs text-[#4A3E8C] dark:text-[#9277FF]">{identity.role} · {identity.location}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full p-2 text-[#374151] hover:bg-[#F4F5F8] dark:text-slate-400 dark:hover:bg-[#1D2245]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-[#4A3E8C] uppercase dark:text-[#9277FF]">
                    Professional Summary
                  </h4>
                  <div className="mt-2 space-y-2 text-sm leading-relaxed text-[#374151] dark:text-[#D1D5DB]">
                    {identity.supportingStatement.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold tracking-wider text-[#4A3E8C] uppercase dark:text-[#9277FF]">
                    Education
                  </h4>
                  <div className="mt-2 space-y-3 rounded-2xl border border-[#E2E4EB] bg-[#F4F5F8] p-4 dark:border-[#2A305A] dark:bg-[#1D2245]">
                    {education.map((edu) => (
                      <div key={edu.institution} className="flex items-start gap-3">
                        <GraduationCap size={20} className="mt-0.5 text-[#7C5DFA] shrink-0" />
                        <div>
                          <p className="font-bold text-sm text-[#1B1F3B] dark:text-white">{edu.degree}</p>
                          <p className="text-xs text-[#4A3E8C] dark:text-[#9277FF]">{edu.specialisation}</p>
                          <p className="mt-1 text-xs text-[#374151] dark:text-[#D1D5DB]">
                            {edu.institution} ({edu.period})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold tracking-wider text-[#4A3E8C] uppercase dark:text-[#9277FF]">
                    Core Capabilities & Strengths
                  </h4>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {strengths.map((str) => (
                      <div
                        key={str.title}
                        className="flex items-center gap-2.5 rounded-xl border border-[#E2E4EB] bg-[#F4F5F8] px-3 py-2 text-xs text-[#1B1F3B] dark:border-[#2A305A] dark:bg-[#1D2245] dark:text-white"
                      >
                        <CheckCircle2 size={14} className="text-[#7C5DFA] shrink-0" />
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
