import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Sparkles, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { featuredCaseStudy } from '@/data/profile';
import { Reveal } from '@/components/ui/Reveal';

export function CaseStudySection(): React.JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#F4F5F8] pb-24 text-[#1B1F3B] transition-colors dark:bg-[#0B0E1E] dark:text-white">
      <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* ══════════════════════════════════════════════════════════════════
              LEFT SIDE: INFO & ACTIONS (4 cols)
              ══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4">
            <Reveal direction="down" distance={10}>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E2E4FA] px-3.5 py-1 text-xs font-bold text-[#1B1F3B] dark:bg-[#7C5DFA]/20 dark:text-[#E2E4FA]">
                <span className="size-1.5 rounded-full bg-[#7C5DFA]" />
                <span>PROJECT CASE STUDY</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.1}>
              <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-[#1B1F3B] sm:text-3xl dark:text-white">
                {featuredCaseStudy.title}
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.15}>
              <p className="mt-3 text-sm leading-relaxed text-[#374151] dark:text-[#D1D5DB]">
                {featuredCaseStudy.subtitle}
              </p>
            </Reveal>

            {/* CTA Buttons */}
            <Reveal direction="up" delay={0.2}>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#1B1F3B] px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:bg-[#4A3E8C] hover:shadow-lg dark:bg-[#7C5DFA] dark:hover:bg-[#9277FF]"
                >
                  <span>View Case Study</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>

                <a
                  href={featuredCaseStudy.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#E2E4EB] bg-[#FFFFFF] px-4 py-2.5 text-xs font-bold text-[#1B1F3B] shadow-sm transition-all duration-300 hover:border-[#7C5DFA] hover:text-[#7C5DFA] dark:border-[#2A305A] dark:bg-[#151934] dark:text-[#E2E4FA] dark:hover:border-[#7C5DFA]"
                >
                  <FaGithub size={15} />
                  <span>GitHub</span>
                </a>
              </div>
            </Reveal>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              CENTER: LAPTOP MOCKUP DASHBOARD (5 cols)
              ══════════════════════════════════════════════════════════════════ */}
          <div className="relative flex justify-center lg:col-span-5">
            <Reveal direction="up" delay={0.2}>
              <div className="relative mx-auto w-full max-w-md sm:max-w-lg">
                <div className="relative overflow-hidden rounded-3xl border border-[#E2E4EB] bg-[#FFFFFF] p-2 shadow-[0_20px_50px_-15px_rgba(27,31,59,0.08)] transition-transform duration-500 hover:scale-[1.02] dark:border-[#2A305A] dark:bg-[#151934]">
                  <img
                    src={featuredCaseStudy.laptopImage}
                    alt="Job Scraper & Intelligence Platform Dashboard"
                    className="h-auto w-full rounded-2xl object-contain"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 via-transparent to-transparent" />
                </div>
              </div>
            </Reveal>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              RIGHT: KEY HIGHLIGHTS & ISOMETRIC CUBE (3 cols)
              ══════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <Reveal direction="left" delay={0.25}>
              <div className="rounded-3xl border border-[#E2E4EB] bg-[#FFFFFF] p-5 shadow-[0_10px_30px_-10px_rgba(27,31,59,0.06)] dark:border-[#2A305A] dark:bg-[#151934]">
                <div className="flex items-center gap-2 pb-3 border-b border-[#E2E4EB] dark:border-[#2A305A]">
                  <Sparkles size={16} className="text-[#7C5DFA]" />
                  <h3 className="font-display text-sm font-bold text-[#1B1F3B] dark:text-white">
                    Key Highlights
                  </h3>
                </div>

                <ul className="mt-3.5 space-y-2.5">
                  {featuredCaseStudy.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2 text-xs leading-snug text-[#374151] dark:text-[#D1D5DB]">
                      <CheckCircle2
                        size={15}
                        className="mt-0.5 text-[#7C5DFA] shrink-0"
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
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
              className="absolute inset-0 bg-[#1B1F3B]/60 backdrop-blur-md dark:bg-black/75"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#E2E4EB] bg-[#FFFFFF] p-6 text-[#1B1F3B] shadow-2xl dark:border-[#2A305A] dark:bg-[#151934] dark:text-white sm:p-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E4EB] dark:border-[#2A305A]">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#E2E4FA] text-[#7C5DFA] dark:bg-[#7C5DFA]/20 dark:text-[#9277FF]">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#1B1F3B] dark:text-white">
                      Case Study: {featuredCaseStudy.title}
                    </h3>
                    <p className="text-xs text-[#4A3E8C] dark:text-[#9277FF]">Production Architecture & Implementation</p>
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

              {/* Metrics Row */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {featuredCaseStudy.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-2xl border border-[#E2E4EB] bg-[#F4F5F8] p-4 text-center dark:border-[#2A305A] dark:bg-[#1D2245]"
                  >
                    <span className="font-display block text-2xl font-bold text-[#7C5DFA]">
                      {m.value}
                    </span>
                    <span className="mt-1 block text-xs text-[#4A3E8C] dark:text-[#9277FF]">{m.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-[#4A3E8C] uppercase dark:text-[#9277FF]">
                    System Architecture
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-[#374151] dark:text-[#D1D5DB]">
                    Engineered an enterprise job intelligence harvester capable of querying LinkedIn and Dice simultaneously. Built on top of Python, FastAPI, and Playwright with intelligent browser emulation, automated session rotation, and residential proxies via Webshare.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold tracking-wider text-[#4A3E8C] uppercase dark:text-[#9277FF]">
                    Operating Modes
                  </h4>
                  <div className="mt-2 grid gap-2.5 sm:grid-cols-3">
                    <div className="rounded-xl border border-[#E2E4EB] bg-[#F4F5F8] p-3 dark:border-[#2A305A] dark:bg-[#1D2245]">
                      <p className="font-bold text-xs text-[#1B1F3B] dark:text-white">Normal Mode</p>
                      <p className="mt-1 text-[0.6875rem] text-[#374151] dark:text-[#D1D5DB]">
                        Broad keyword search and standard job post aggregation across active listings.
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#E2E4EB] bg-[#F4F5F8] p-3 dark:border-[#2A305A] dark:bg-[#1D2245]">
                      <p className="font-bold text-xs text-[#1B1F3B] dark:text-white">Bench Mode</p>
                      <p className="mt-1 text-[0.6875rem] text-[#374151] dark:text-[#D1D5DB]">
                        Tailored candidate skill-matrix matching against high-urgency contract roles.
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#E2E4EB] bg-[#F4F5F8] p-3 dark:border-[#2A305A] dark:bg-[#1D2245]">
                      <p className="font-bold text-xs text-[#1B1F3B] dark:text-white">Leadgen Mode</p>
                      <p className="mt-1 text-[0.6875rem] text-[#374151] dark:text-[#D1D5DB]">
                        Identifies hiring managers, company growth velocity, and direct recruiting leads.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold tracking-wider text-[#4A3E8C] uppercase dark:text-[#9277FF]">
                    Key Implementation Details
                  </h4>
                  <ul className="mt-2.5 space-y-2">
                    {featuredCaseStudy.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-xs text-[#374151] dark:text-[#D1D5DB]">
                        <CheckCircle2 size={15} className="mt-0.5 text-[#7C5DFA] shrink-0" />
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
