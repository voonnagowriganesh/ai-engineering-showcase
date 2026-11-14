import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { skillDomains } from '../data/content';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

export function Expertise() {
  const [openId, setOpenId] = useState<string | null>(skillDomains[0]?.id ?? null);

  return (
    <section id="expertise" className="relative bg-paper py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          index="04"
          eyebrow="Expertise"
          title="Depth across the stack, not just breadth."
          description="Eight capability domains — expand any one for the specific skills behind it."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {skillDomains.map((domain, i) => {
            const isOpen = openId === domain.id;
            return (
              <Reveal key={domain.id} delay={(i % 4) * 0.05}>
                <div
                  className={`overflow-hidden rounded-[1.5rem] border transition-colors ${
                    isOpen ? 'border-signal/30 bg-signal/[0.04]' : 'border-ink/10 bg-paper-deep/40'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : domain.id)}
                    className="flex w-full items-center gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                        isOpen ? 'bg-signal text-paper' : 'bg-signal/10 text-signal'
                      }`}
                    >
                      <domain.icon size={19} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-base font-semibold text-ink sm:text-lg">
                        {domain.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-ink-faint">{domain.skills.length} skills</span>
                    </span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown size={18} className="text-ink-faint" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="px-5 pb-5">
                          <p className="text-sm leading-relaxed text-ink-soft">{domain.blurb}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {domain.skills.map((skill) => (
                              <span
                                key={skill.name}
                                className="rounded-full border border-signal/20 bg-paper px-3 py-1.5 text-xs font-medium text-ink-soft"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
