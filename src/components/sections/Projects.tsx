import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { projects, stackIcons } from '@/data/profile';
import { useEscapeKey, useReducedMotion } from '@/hooks/useInteractions';
import { useScrollLock } from '@/hooks/useScroll';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Eyebrow, Icon, Tag } from '@/components/ui/primitives';
import type { Project, ProjectCategory } from '@/domain/models';
import { cn } from '@/lib/utils';

type Filter = 'All' | ProjectCategory;

const FILTERS: readonly Filter[] = [
  'All',
  'Agentic AI',
  'AI Engineering',
  'Full-Stack',
  'Machine Learning',
];

export function Projects(): React.JSX.Element {
  const [filter, setFilter] = useState<Filter>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visibleProjects = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  const selected = useMemo(
    () => projects.find((project) => project.id === selectedId) ?? null,
    [selectedId],
  );

  const close = useCallback(() => setSelectedId(null), []);
  useEscapeKey(selected !== null, close);
  useScrollLock(selected !== null);

  return (
    <Section id="projects" grid tone="aqua">
      <SectionHeader
        index="04"
        eyebrow="Selected work"
        title="Systems I designed, built and"
        titleAccent="shipped."
        description="Independent and prior-employer work. Figures shown are the ones I can stand behind."
      />

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <Reveal direction="up" className="mb-10">
        <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
          {FILTERS.map((option) => {
            const isActive = filter === option;
            const count =
              option === 'All'
                ? projects.length
                : projects.filter((p) => p.category === option).length;

            return (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={isActive}
                className={cn(
                  'relative rounded-full border px-4 py-2 text-[0.8125rem] font-medium transition-colors duration-300',
                  isActive
                    ? 'border-transparent text-white'
                    : 'border-line text-ink-muted hover:border-line-strong hover:text-ink',
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="project-filter-pill"
                    className="absolute inset-0 rounded-full bg-[linear-gradient(110deg,var(--color-accent),var(--color-accent-2))]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative z-10">
                  {option}
                  <span className="ml-1.5 font-mono text-2xs opacity-60">{count}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* ── Bento grid ──────────────────────────────────────────────────── */}
      <motion.ul layout className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={() => setSelectedId(project.id)}
            />
          ))}
        </AnimatePresence>
      </motion.ul>

      {/* ── Detail dialog ───────────────────────────────────────────────── */}
      <ProjectDialog project={selected} onClose={close} />
    </Section>
  );
}

/* ── Card ────────────────────────────────────────────────────────────────── */

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  readonly project: Project;
  readonly index: number;
  readonly onOpen: () => void;
}): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const [from, to] = project.palette;

  return (
    <motion.li
      layout
      initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      {...(reduceMotion ? {} : { exit: { opacity: 0, scale: 0.94 } })}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative',
        project.emphasis === 'feature' && 'sm:col-span-2 lg:col-span-2',
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${project.title} — view details`}
        className="ring-gradient edge-gradient relative flex h-full w-full flex-col overflow-hidden rounded-card border border-line bg-surface text-left transition-[transform,border-color,box-shadow] duration-500 [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-1.5 hover:border-line-strong hover:shadow-[0_30px_80px_-32px_color-mix(in_oklab,var(--color-accent-2)_60%,transparent)]"
      >
        {/* Generative artwork — derived from the project's own palette, so each
            card is visually distinct without needing a bespoke image asset. */}
        <div
          aria-hidden="true"
          className={cn(
            'relative overflow-hidden',
            project.emphasis === 'feature' ? 'h-44 sm:h-52' : 'h-36',
          )}
        >
          <div
            className="absolute inset-0 transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-110"
            style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
          />
          {/* Concentric arcs give the block structure rather than flat colour */}
          <svg
            viewBox="0 0 400 200"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 size-full opacity-35 mix-blend-overlay"
          >
            {[0, 1, 2, 3, 4].map((ring) => (
              <circle
                key={ring}
                cx="330"
                cy="180"
                r={42 + ring * 38}
                fill="none"
                stroke="#fff"
                strokeWidth="1.2"
              />
            ))}
          </svg>
          <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-surface),transparent_62%)]" />

          {/* Floating glyph */}
          <span className="absolute bottom-4 left-5 grid size-11 place-items-center rounded-xl border border-white/30 bg-black/35 text-white backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">
            <Icon icon={project.icon} size={20} />
          </span>

          <span className="absolute top-4 right-4 rounded-full border border-white/25 bg-black/25 px-2.5 py-1 font-mono text-2xs tracking-wide text-white backdrop-blur-md">
            {project.year}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6">
          <Eyebrow>{project.category}</Eyebrow>

          <h3 className="mt-2.5 text-xl leading-tight font-semibold text-ink">{project.title}</h3>
          <p className="mt-1.5 text-[0.8125rem] text-ink-subtle">{project.subtitle}</p>

          <p className="mt-4 line-clamp-3 flex-1 text-[0.875rem] leading-relaxed text-ink-muted">
            {project.summary}
          </p>

          {project.metrics ? (
            <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="sr-only">{metric.label}</dt>
                  <dd>
                    <span className="font-display block text-lg leading-none font-bold text-gradient-static">
                      {metric.value}
                    </span>
                    <span className="mt-1 block font-mono text-[0.625rem] tracking-wide text-ink-subtle uppercase">
                      {metric.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 5).map((tech) => (
              <Tag key={tech} icon={stackIcons[tech]}>
                {tech}
              </Tag>
            ))}
            {project.stack.length > 5 ? (
              <Tag tone="accent">+{project.stack.length - 5}</Tag>
            ) : null}
          </div>

          <span className="mt-6 flex items-center gap-1.5 font-mono text-2xs tracking-wider text-accent-2 uppercase">
            Read more
            <ArrowUpRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </button>
    </motion.li>
  );
}

/* ── Dialog ──────────────────────────────────────────────────────────────── */

function ProjectDialog({
  project,
  onClose,
}: {
  readonly project: Project | null;
  readonly onClose: () => void;
}): React.JSX.Element {
  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          key="project-dialog"
          className="fixed inset-0 z-[160] flex items-start justify-center overflow-y-auto overscroll-contain p-4 py-[8vh] sm:p-6 sm:py-[10vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <button
            type="button"
            aria-label="Close project details"
            onClick={onClose}
            className="fixed inset-0 bg-canvas/80 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-dialog-title"
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_40px_120px_-40px_rgb(0_0_0/0.7)]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Banner */}
            <div className="relative h-36 overflow-hidden sm:h-44">
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${project.palette[0]} 0%, ${project.palette[1]} 100%)`,
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-surface),transparent_70%)]"
              />

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 grid size-9 place-items-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-black/50"
              >
                <X size={16} />
              </button>

              <span
                aria-hidden="true"
                className="absolute bottom-4 left-6 grid size-12 place-items-center rounded-xl border border-white/25 bg-white/15 text-white backdrop-blur-md"
              >
                <Icon icon={project.icon} size={22} />
              </span>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Eyebrow>{project.category}</Eyebrow>
                <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
                <span className="font-mono text-2xs text-ink-subtle">{project.year}</span>
              </div>

              <h3
                id="project-dialog-title"
                className="mt-3 text-2xl font-semibold text-ink sm:text-3xl"
              >
                {project.title}
              </h3>
              <p className="mt-1.5 text-[0.9375rem] text-ink-subtle">{project.subtitle}</p>

              <p className="text-lede mt-5 text-ink-muted">{project.summary}</p>

              {project.metrics ? (
                <dl className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
                  {project.metrics.map((metric) => (
                    <div key={metric.label} className="bg-surface p-4">
                      <dt className="font-mono text-[0.625rem] tracking-wide text-ink-subtle uppercase">
                        {metric.label}
                      </dt>
                      <dd className="font-display mt-1.5 text-2xl leading-none font-bold text-gradient">
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              <div className="mt-8">
                <Eyebrow>What it does</Eyebrow>
                <ul className="mt-4 grid gap-3">
                  {project.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-2"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 border-t border-line pt-6">
                <Eyebrow>Built with</Eyebrow>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <Tag key={tech} icon={stackIcons[tech]}>
                      {tech}
                    </Tag>
                  ))}
                </div>
              </div>

              {project.links && project.links.length > 0 ? (
                <div className="mt-7 flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[0.8125rem] font-medium text-ink-muted transition-colors hover:border-accent-2 hover:text-accent-2"
                    >
                      {link.label}
                      <ArrowUpRight size={14} />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
