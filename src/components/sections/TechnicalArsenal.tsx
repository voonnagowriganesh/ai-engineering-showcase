import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { technicalArsenal } from '@/data/profile';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';

type CategoryFilter = 'All' | 'AI & GenAI' | 'Backend' | 'Frontend' | 'Database' | 'DevOps & Cloud';

const CATEGORIES: readonly CategoryFilter[] = [
  'All',
  'AI & GenAI',
  'Backend',
  'Frontend',
  'Database',
  'DevOps & Cloud',
];

export function TechnicalArsenal(): React.JSX.Element {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [showAll, setShowAll] = useState(false);

  // The "More / Less" control only makes sense for the unfiltered "All" view
  // — once a specific category is chosen there's nothing left to expand, so
  // collapsing never kicks in for a filtered list.
  const COLLAPSED_COUNT = 10;

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
      className="relative overflow-hidden bg-gradient-to-b from-[#05160d] via-[#071c10] to-[#04120a] py-20 text-white"
    >
      {/* Background emerald glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[45rem] rounded-full bg-emerald-500/10 blur-[150px]"
      />

      <div className="relative mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        {/* Header and Filter Tabs */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal direction="down" distance={10}>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span>TECHNICAL ARSENAL</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.1}>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                My Technology Stack
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.15}>
              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                A blend of AI, backend engineering and product development technologies.
              </p>
            </Reveal>
          </div>

          {/* Filter Pills */}
          <Reveal direction="left" delay={0.2}>
            <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-emerald-500/20 bg-emerald-950/40 p-1.5 backdrop-blur-md">
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
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                        : 'text-emerald-200/80 hover:bg-emerald-900/40 hover:text-white',
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
                  className="group flex flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-[#071d12]/90 p-4 text-center shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/50 hover:bg-emerald-900/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-950/80 text-emerald-300 transition-transform duration-300 group-hover:scale-110 group-hover:text-emerald-400">
                    <Icon icon={tech.icon} size={22} />
                  </div>
                  <span className="mt-2.5 block text-xs font-semibold text-slate-200 group-hover:text-white">
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
                  className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-500/40 bg-emerald-950/20 p-4 text-center transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500/10"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-900/30 text-emerald-400">
                    <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </div>
                  <span className="mt-2.5 text-xs font-semibold text-emerald-300">
                    {showAll ? 'Less' : 'More →'}
                  </span>
                </motion.button>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
