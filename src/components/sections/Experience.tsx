import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Lock, MapPin } from 'lucide-react';
import { experiences, stackIcons } from '@/data/profile';
import { useReducedMotion } from '@/hooks/useInteractions';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Tag } from '@/components/ui/primitives';
import type { Experience as ExperienceModel } from '@/domain/models';
import { cn } from '@/lib/utils';

export function Experience(): React.JSX.Element {
  const timelineRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();

  // Progress of the timeline spine, driven by this section's own scroll range.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 72%', 'end 55%'],
  });
  const spineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const spineOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <Section id="experience" tone="indigo">
      <SectionHeader
        index="02"
        eyebrow="Experience"
        title="Three teams, one trajectory — from operations to"
        titleAccent="AI product engineering."
        description="Each role widened the surface area: process analysis, then backend and AI services, now complete products end to end."
      />

      <ol ref={timelineRef} className="relative">
        {/* Spine */}
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[11px] w-px bg-line sm:left-[15px]"
        >
          {!reduceMotion ? (
            <motion.div
              className="absolute inset-x-0 top-0 h-full origin-top bg-[linear-gradient(to_bottom,var(--color-accent),var(--color-accent-2),var(--color-accent-3))]"
              style={{ scaleY: spineScale, opacity: spineOpacity }}
            />
          ) : (
            <div className="absolute inset-0 bg-accent-2 opacity-60" />
          )}
        </div>

        {experiences.map((experience, index) => (
          <ExperienceEntry key={experience.id} experience={experience} delay={index * 0.06} />
        ))}
      </ol>
    </Section>
  );
}

function ExperienceEntry({
  experience,
  delay,
}: {
  readonly experience: ExperienceModel;
  readonly delay: number;
}): React.JSX.Element {
  const isCurrent = experience.status === 'current';

  return (
    <li className="relative pb-12 pl-10 last:pb-0 sm:pl-14">
      {/*
        Node — deliberately NOT wrapped in <Reveal>. Reveal animates `filter`,
        and any non-none filter makes the element a containing block for
        absolutely-positioned descendants, which pulled this marker off the
        timeline spine and in behind the card.
      */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-1.5 left-0 grid size-6 place-items-center rounded-full border-2 bg-canvas sm:size-8',
          isCurrent ? 'border-accent-2' : 'border-line-strong',
        )}
      >
        <span
          className={cn(
            'size-2 rounded-full sm:size-2.5',
            isCurrent ? 'bg-accent-2' : 'bg-line-strong',
          )}
        />
        {isCurrent ? (
          <span className="animate-pulse-ring absolute size-2 rounded-full bg-accent-2 sm:size-2.5" />
        ) : null}
      </span>

      <Reveal direction="up" delay={delay + 0.05}>
        <article className="group rounded-card border border-line bg-surface p-6 transition-[border-color,transform,box-shadow] duration-500 [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_24px_60px_-30px_rgb(0_0_0/0.4)] sm:p-7">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-xl font-semibold text-ink sm:text-2xl">{experience.role}</h3>
                {isCurrent ? (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-2xs tracking-wide text-emerald-500 uppercase">
                    Current
                  </span>
                ) : null}
              </div>

              <p className="mt-1.5 text-[0.9375rem] font-medium text-gradient-static">
                {experience.company}
              </p>
            </div>

            <div className="flex flex-col items-start gap-1.5 sm:items-end">
              <span className="rounded-full border border-line bg-canvas px-3 py-1 font-mono text-2xs whitespace-nowrap text-ink-muted">
                {experience.period}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-2xs text-ink-subtle">
                <MapPin size={11} />
                {experience.location}
              </span>
            </div>
          </div>

          <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
            {experience.summary}
          </p>

          {/* Responsibilities */}
          <ul className="mt-5 grid gap-2.5">
            {experience.responsibilities.map((item) => (
              <li key={item} className="flex gap-3 text-[0.875rem] leading-relaxed text-ink-muted">
                <span
                  aria-hidden="true"
                  className="mt-[0.5rem] size-1 shrink-0 rounded-full bg-accent-2"
                />
                {item}
              </li>
            ))}
          </ul>

          {/* Stack */}
          <div className="mt-6 flex flex-wrap gap-2">
            {experience.stack.map((tech) => (
              <Tag key={tech} icon={stackIcons[tech]}>
                {tech}
              </Tag>
            ))}
          </div>

          {/* Confidentiality note — states plainly why there is no case study. */}
          {experience.confidential ? (
            <p className="mt-6 flex items-start gap-2.5 border-t border-line pt-5 text-[0.8125rem] leading-relaxed text-ink-subtle">
              <Lock size={13} className="mt-0.5 shrink-0" />
              Work at {experience.company} is covered by confidentiality. Responsibilities and
              technologies are described in general terms; internal products, architecture and
              metrics are deliberately omitted.
            </p>
          ) : null}
        </article>
      </Reveal>
    </li>
  );
}
