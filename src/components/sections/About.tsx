import { GraduationCap, MapPin, Quote } from 'lucide-react';
import { education, identity, strengths } from '@/data/profile';
import { useTilt } from '@/hooks/useInteractions';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { Eyebrow, Icon, SpotlightCard } from '@/components/ui/primitives';

export function About(): React.JSX.Element {
  const portraitRef = useTilt<HTMLDivElement>(5);

  return (
    <Section id="about" grid tone="aqua">
      <SectionHeader
        index="01"
        eyebrow="About"
        title="An engineer who ships the whole product,"
        titleAccent="not a slice of it."
        description={identity.tagline}
      />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-16">
        {/* ── Portrait ──────────────────────────────────────────────────── */}
        <Reveal direction="right" distance={30}>
          <div className="lg:sticky lg:top-28">
            <div ref={portraitRef} className="transition-transform duration-500 ease-out">
              <div className="ring-gradient relative overflow-hidden rounded-card border border-line bg-surface-2">
                <img
                  src={identity.avatarUrl}
                  alt={`${identity.fullName} — ${identity.role}`}
                  width={640}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover"
                />
                {/* Corner brackets — a small "framed" detail */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-4 rounded-xl border border-white/10"
                />
              </div>
            </div>

            {/* Caption card */}
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
              <Quote size={16} className="mt-0.5 shrink-0 text-accent-2" />
              <p className="text-[0.8125rem] leading-relaxed text-ink-muted">
                I enjoy working across the entire development lifecycle — turning business
                requirements into practical, intelligent, production-ready applications.
              </p>
            </div>
          </div>
        </Reveal>

        {/* ── Narrative ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            {identity.supportingStatement.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 32)} direction="up" delay={index * 0.08}>
                <p
                  className={
                    index === 0
                      ? 'text-lede text-ink'
                      : 'text-[1.0625rem] leading-relaxed text-ink-muted'
                  }
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          {/* ── Strengths ───────────────────────────────────────────────── */}
          <div>
            <Reveal direction="up">
              <Eyebrow>What I bring</Eyebrow>
            </Reveal>

            <RevealGroup as="ul" className="mt-5 grid gap-2.5 sm:grid-cols-2" stagger={0.05}>
              {strengths.map((strength) => (
                <RevealItem as="li" key={strength.title}>
                  <div className="group flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent-2/40">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110">
                      <Icon icon={strength.icon} size={15} />
                    </span>
                    <span className="text-[0.875rem] font-medium text-ink-muted transition-colors duration-300 group-hover:text-ink">
                      {strength.title}
                    </span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          {/* ── Education ───────────────────────────────────────────────── */}
          <Reveal direction="up">
            <SpotlightCard className="p-6 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line bg-canvas text-accent-2">
                  <GraduationCap size={22} />
                </span>

                <div className="min-w-0 flex-1">
                  <Eyebrow>Education</Eyebrow>
                  <h3 className="mt-2 text-lg font-semibold text-ink">{education.degree}</h3>
                  <p className="mt-1 text-[0.9375rem] text-ink-muted">
                    {education.specialisation}
                  </p>

                  <dl className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-2xs tracking-wide text-ink-subtle">
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Institution</dt>
                      <dd>{education.institution}</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">University</dt>
                      <dd>{education.university}</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Location</dt>
                      <dd className="flex items-center gap-1.5">
                        <MapPin size={11} />
                        {education.location}
                      </dd>
                    </div>
                  </dl>
                </div>

                <span className="shrink-0 rounded-full border border-line bg-canvas px-3 py-1 font-mono text-2xs text-ink-muted">
                  {education.period}
                </span>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
