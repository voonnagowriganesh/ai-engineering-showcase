import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { technicalArsenal, toolCategories } from '../data/toolkit';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

export function Toolkit() {
  const [category, setCategory] = useState<'All' | (typeof toolCategories)[number]>('All');

  const filtered = useMemo(
    () => (category === 'All' ? technicalArsenal : technicalArsenal.filter((t) => t.category === category)),
    [category],
  );

  return (
    <section id="toolkit" className="relative overflow-hidden bg-paper-deep py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          index="05"
          eyebrow="Toolkit"
          title="The tools behind the builds."
          description="A working set of 24 technologies across AI, backend, frontend, data and infrastructure."
        />
      </div>

      {/* Infinite marquee strip — decorative, independent of page scroll so it
         never fights with native scrolling. */}
      <div className="card-grid-fade relative mt-12 overflow-hidden border-y border-ink/10 bg-paper/60 py-5">
        <div className="flex w-max animate-marquee gap-10 pr-10 hover:[animation-play-state:paused]">
          {[...technicalArsenal, ...technicalArsenal].map((tool, i) => (
            <div key={`${tool.id}-${i}`} className="flex items-center gap-2.5 text-ink-soft">
              <tool.icon size={20} className="text-signal" />
              <span className="whitespace-nowrap text-sm font-medium">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mt-12 flex flex-wrap gap-2">
          {(['All', ...toolCategories] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                category === cat
                  ? 'bg-ink text-paper'
                  : 'border border-ink/10 bg-paper text-ink-soft hover:border-signal/40 hover:text-signal'
              }`}
            >
              {cat}
            </button>
          ))}
        </Reveal>

        <motion.div
          layout
          className="mt-8 grid grid-cols-3 gap-2.5 sm:gap-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {filtered.map((tool) => (
            <motion.div
              key={tool.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4, scale: 1.03 }}
              transition={{ duration: 0.25 }}
              className="group flex min-w-0 flex-col items-center gap-2 rounded-2xl border border-ink/10 bg-paper px-2 py-3.5 text-center shadow-soft sm:gap-2.5 sm:p-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal/10 sm:h-11 sm:w-11 text-signal transition-colors group-hover:bg-signal group-hover:text-paper">
                <tool.icon size={20} />
              </span>
              <span className="max-w-full break-words text-[11px] font-medium leading-tight text-ink-soft sm:text-xs">{tool.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
