import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { skillDomains } from '@/data/profile';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Icon, SpotlightCard } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';

export function Skills(): React.JSX.Element {
  const [activeId, setActiveId] = useState<string>(skillDomains[0]?.id ?? '');
  const activeDomain = skillDomains.find((domain) => domain.id === activeId) ?? skillDomains[0];

  return (
    <Section id="skills" grid tone="magenta">
      <SectionHeader
        index="03"
        eyebrow="Capabilities"
        title="Five domains,"
        titleAccent="honestly scoped."
        description="Grouped by what I actually build with. No self-assigned percentages — those tell you nothing about whether someone can ship."
      />

      {/* ── Desktop: domain switcher with an animated detail panel ───────── */}
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-10">
        <Reveal direction="right">
          <ul role="tablist" aria-label="Skill domains" className="flex flex-col gap-2">
            {skillDomains.map((domain) => {
              const isActive = domain.id === activeId;
              return (
                <li key={domain.id}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`skill-panel-${domain.id}`}
                    id={`skill-tab-${domain.id}`}
                    onClick={() => setActiveId(domain.id)}
                    className={cn(
                      'group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border px-5 py-4 text-left transition-colors duration-400',
                      isActive
                        ? 'border-accent-2/40 bg-surface'
                        : 'border-line bg-transparent hover:border-line-strong hover:bg-surface/60',
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="skill-active"
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 w-0.5 bg-[linear-gradient(to_bottom,var(--color-accent),var(--color-accent-3))]"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    ) : null}

                    <span
                      className={cn(
                        'grid size-11 shrink-0 place-items-center rounded-xl border transition-colors duration-400',
                        isActive
                          ? 'border-accent-2/30 bg-accent-2/10 text-accent-2'
                          : 'border-line bg-surface-2 text-ink-subtle group-hover:text-ink-muted',
                      )}
                    >
                      <Icon icon={domain.icon} size={19} />
                    </span>

                    <span className="min-w-0">
                      <span
                        className={cn(
                          'block text-[0.9375rem] font-semibold transition-colors duration-300',
                          isActive ? 'text-ink' : 'text-ink-muted group-hover:text-ink',
                        )}
                      >
                        {domain.title}
                      </span>
                      <span className="mt-0.5 block font-mono text-2xs text-ink-subtle">
                        {domain.skills.length} capabilities
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal direction="left">
          <AnimatePresence mode="wait">
            {activeDomain ? (
              <motion.div
                key={activeDomain.id}
                id={`skill-panel-${activeDomain.id}`}
                role="tabpanel"
                aria-labelledby={`skill-tab-${activeDomain.id}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <SpotlightCard className="h-full p-8">
                  <div className="flex items-start gap-4">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-line bg-canvas text-accent-2">
                      <Icon icon={activeDomain.icon} size={24} />
                    </span>
                    <div>
                      <h3 className="text-2xl font-semibold text-ink">{activeDomain.title}</h3>
                      <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-ink-muted">
                        {activeDomain.blurb}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-8 flex flex-wrap gap-2.5">
                    {activeDomain.skills.map((skill, index) => (
                      <motion.li
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.92, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          delay: index * 0.035,
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <span className="group/skill flex items-center gap-2.5 rounded-xl border border-line bg-canvas px-4 py-2.5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent-2/50">
                          <Icon
                            icon={skill.icon}
                            size={16}
                            className="text-ink-subtle transition-colors duration-300 group-hover/skill:text-accent-2"
                          />
                          <span className="text-[0.875rem] font-medium whitespace-nowrap text-ink-muted transition-colors duration-300 group-hover/skill:text-ink">
                            {skill.name}
                          </span>
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </SpotlightCard>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Reveal>
      </div>

      {/* ── Mobile / tablet: every domain stacked, no interaction required ── */}
      <RevealGroup as="div" className="grid gap-5 sm:grid-cols-2 lg:hidden" stagger={0.07}>
        {skillDomains.map((domain) => (
          <RevealItem key={domain.id}>
            <SpotlightCard className="h-full p-6">
              <div className="flex items-start gap-3.5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-canvas text-accent-2">
                  <Icon icon={domain.icon} size={19} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-ink">{domain.title}</h3>
                  <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-muted">
                    {domain.blurb}
                  </p>
                </div>
              </div>

              <ul className="mt-5 flex flex-wrap gap-2">
                {domain.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="flex items-center gap-2 rounded-lg border border-line bg-canvas px-3 py-1.5"
                  >
                    <Icon icon={skill.icon} size={13} className="text-ink-subtle" />
                    <span className="text-[0.8125rem] whitespace-nowrap text-ink-muted">
                      {skill.name}
                    </span>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
