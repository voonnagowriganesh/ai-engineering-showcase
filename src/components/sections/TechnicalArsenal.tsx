import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { technicalArsenal, skillDomains } from '@/data/profile';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';

type CategoryFilter =
  | 'All'
  | 'AI & GenAI'
  | 'Backend'
  | 'Frontend'
  | 'Database'
  | 'Data Science'
  | 'DevOps & Cloud';

const CATEGORIES: readonly CategoryFilter[] = [
  'All',
  'AI & GenAI',
  'Backend',
  'Frontend',
  'Database',
  'Data Science',
  'DevOps & Cloud',
];

export function TechnicalArsenal(): React.JSX.Element {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [showAll, setShowAll] = useState(false);
  const [openDomainId, setOpenDomainId] = useState<string | null>(skillDomains[0]?.id ?? null);

  const COLLAPSED_COUNT = 12;

  const filteredItems = useMemo(() => {
    const items =
      activeCategory === 'All'
        ? technicalArsenal
        : technicalArsenal.filter((item) => item.category === activeCategory);

    if (activeCategory === 'All' && !showAll) {
      return items.slice(0, COLLAPSED_COUNT);
    }
    return items;
  }, [activeCategory, showAll]);

  return (
    <section
      id="skills"
      className="relative overflow-hidden bg-[#F4F5F8] py-20 text-[#1B1F3B] transition-colors dark:bg-[#0B0E1E] dark:text-white"
    >
      {/* Background ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[45rem] rounded-full bg-[#7C5DFA]/5 blur-[150px] dark:bg-[#7C5DFA]/10"
      />

      <div className="relative mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        {/* Header and Filter Tabs */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal direction="down" distance={10}>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E2E4FA] px-3.5 py-1 text-xs font-bold text-[#1B1F3B] dark:bg-[#7C5DFA]/20 dark:text-[#E2E4FA]">
                <span className="size-1.5 rounded-full bg-[#7C5DFA]" />
                <span>TECHNICAL ARSENAL</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.1}>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#1B1F3B] sm:text-4xl dark:text-white">
                My Technology Stack
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.15}>
              <p className="mt-2 text-sm text-[#374151] sm:text-base dark:text-[#D1D5DB]">
                A blend of AI, backend engineering and product development technologies.
              </p>
            </Reveal>
          </div>

          {/* Filter Pills */}
          <Reveal direction="left" delay={0.2}>
            <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-[#E2E4EB] bg-[#FFFFFF] p-1.5 shadow-sm backdrop-blur-md dark:border-[#2A305A] dark:bg-[#151934]">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'relative rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-[#7C5DFA] text-white shadow-[0_4px_14px_rgba(124,93,250,0.35)]'
                        : 'text-[#1B1F3B] hover:bg-[#E2E4FA] hover:text-[#7C5DFA] dark:text-[#D1D5DB] dark:hover:bg-[#1D2245] dark:hover:text-white',
                    )}
                  >
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Tech Cards Row / Grid */}
        <div className="mt-10">
          <motion.div layout className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((tech) => (
                <motion.div
                  key={tech.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="group flex flex-col items-center justify-center rounded-2xl border border-[#E2E4EB] bg-[#FFFFFF] p-4 text-center shadow-[0_2px_12px_rgba(27,31,59,0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#7C5DFA] hover:shadow-[0_8px_25px_-5px_rgba(124,93,250,0.15)] dark:border-[#2A305A] dark:bg-[#151934] dark:hover:border-[#7C5DFA]"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#F4F5F8] text-[#7C5DFA] transition-transform duration-300 group-hover:scale-110 dark:bg-[#1D2245] dark:text-[#9277FF]">
                    <Icon icon={tech.icon} size={22} />
                  </div>
                  <span className="mt-2.5 block text-xs font-semibold text-[#1B1F3B] group-hover:text-[#7C5DFA] dark:text-slate-200 dark:group-hover:text-white">
                    {tech.name}
                  </span>
                </motion.div>
              ))}

              {/* "More ->" card matching the design */}
              {activeCategory === 'All' && technicalArsenal.length > COLLAPSED_COUNT ? (
                <motion.button
                  key="more-btn"
                  layout
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#CBD5E1] bg-[#FFFFFF] p-4 text-center transition-all duration-300 hover:border-[#7C5DFA] hover:bg-[#E2E4FA]/40 dark:border-[#2A305A] dark:bg-[#151934] dark:hover:border-[#7C5DFA]"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#F4F5F8] text-[#7C5DFA] dark:bg-[#1D2245] dark:text-[#9277FF]">
                    <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </div>
                  <span className="mt-2.5 text-xs font-bold text-[#7C5DFA] dark:text-[#9277FF]">
                    {showAll ? 'Less' : 'More →'}
                  </span>
                </motion.button>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Core Competencies: concept-level skills grouped by domain ──── */}
        <div className="mt-20">
          <Reveal direction="down" distance={10}>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E2E4FA] px-3.5 py-1 text-xs font-bold text-[#1B1F3B] dark:bg-[#7C5DFA]/20 dark:text-[#E2E4FA]">
              <span className="size-1.5 rounded-full bg-[#7C5DFA]" />
              <span>CORE COMPETENCIES</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.1}>
            <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[#1B1F3B] sm:text-3xl dark:text-white">
              How the tools come together
            </h3>
          </Reveal>

          <Reveal direction="up" delay={0.15}>
            <p className="mt-2 max-w-2xl text-sm text-[#374151] sm:text-base dark:text-[#D1D5DB]">
              Grouped by the capability they serve — from LLM engineering to the deployment
              infrastructure that keeps it running.
            </p>
          </Reveal>

          <div className="mt-8 flex flex-col gap-3">
            {skillDomains.map((domain) => {
              const isOpen = domain.id === openDomainId;
              return (
                <Reveal key={domain.id} direction="up" distance={8}>
                  <motion.div
                    layout="position"
                    className="overflow-hidden rounded-2xl border border-[#E2E4EB] bg-[#FFFFFF] shadow-[0_2px_12px_rgba(27,31,59,0.04)] backdrop-blur-md dark:border-[#2A305A] dark:bg-[#151934]"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`competency-panel-${domain.id}`}
                      id={`competency-tab-${domain.id}`}
                      onClick={() => setOpenDomainId(isOpen ? null : domain.id)}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-300 hover:bg-[#F4F5F8] sm:px-7 dark:hover:bg-[#1D2245]"
                    >
                      <span
                        className={cn(
                          'grid size-10 shrink-0 place-items-center rounded-xl border transition-colors duration-300',
                          isOpen
                            ? 'border-[#7C5DFA]/40 bg-[#E2E4FA] text-[#7C5DFA] dark:bg-[#7C5DFA]/20 dark:text-[#9277FF]'
                            : 'border-[#E2E4EB] bg-[#F4F5F8] text-[#4A3E8C] dark:border-[#2A305A] dark:bg-[#1D2245] dark:text-slate-400',
                        )}
                      >
                        <Icon icon={domain.icon} size={18} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-[#1B1F3B] sm:text-base dark:text-white">
                          {domain.title}
                        </span>
                        <span className="mt-0.5 hidden text-xs leading-relaxed text-[#374151] sm:block dark:text-slate-400">
                          {domain.blurb}
                        </span>
                      </span>

                      <span className="hidden shrink-0 font-mono text-2xs text-[#4A3E8C] sm:block dark:text-[#9277FF]">
                        {domain.skills.length} skills
                      </span>

                      <ChevronDown
                        size={18}
                        className={cn(
                          'shrink-0 text-[#7C5DFA] transition-transform duration-300',
                          isOpen && 'rotate-180',
                        )}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          key="content"
                          id={`competency-panel-${domain.id}`}
                          role="region"
                          aria-labelledby={`competency-tab-${domain.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <p className="px-5 text-xs leading-relaxed text-[#374151] sm:hidden dark:text-slate-400">
                            {domain.blurb}
                          </p>
                          <ul className="flex flex-wrap gap-2 px-5 pt-4 pb-5 sm:px-7">
                            {domain.skills.map((skill, index) => (
                              <motion.li
                                key={skill.name}
                                initial={{ opacity: 0, scale: 0.92, y: 6 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{
                                  delay: index * 0.025,
                                  duration: 0.25,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                              >
                                <span className="group/skill flex items-center gap-2 rounded-xl border border-[#E2E4EB] bg-[#F4F5F8] px-3.5 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7C5DFA] hover:bg-[#E2E4FA] dark:border-[#2A305A] dark:bg-[#1D2245] dark:hover:border-[#7C5DFA]">
                                  {skill.icon ? (
                                    <Icon
                                      icon={skill.icon}
                                      size={14}
                                      className="text-[#7C5DFA] transition-colors duration-300 group-hover/skill:text-[#4A3E8C] dark:text-[#9277FF]"
                                    />
                                  ) : null}
                                  <span className="text-xs font-semibold whitespace-nowrap text-[#1B1F3B] transition-colors duration-300 group-hover/skill:text-[#1B1F3B] dark:text-slate-200 dark:group-hover/skill:text-white">
                                    {skill.name}
                                  </span>
                                </span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
