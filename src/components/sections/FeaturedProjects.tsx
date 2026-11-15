import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, CheckCircle2, ExternalLink, X } from 'lucide-react';
import { projects } from '@/data/profile';
import { useScrollLock } from '@/hooks/useScroll';
import { useEscapeKey, useReducedMotion } from '@/hooks/useInteractions';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/primitives';
import { track } from '@/lib/analytics';
import type { Project } from '@/domain/models';

function getTagStyle(_category: string): string {
  return 'bg-[#E2E4FA] text-[#4A3E8C] dark:bg-[#7C5DFA]/20 dark:text-[#E2E4FA]';
}

interface ProjectCardButtonProps {
  readonly project: Project;
  readonly index: number;
  readonly onOpen: () => void;
  readonly inStage?: boolean;
}

/** Stack chips shown on the card; the rest collapse into a "+N" chip. */
const VISIBLE_STACK = 4;

function ProjectCardButton({ project, index, onOpen, inStage }: ProjectCardButtonProps): React.JSX.Element {
  const extra = project.stack.length - VISIBLE_STACK;
  const card = (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full flex-col gap-4 overflow-hidden rounded-[1.75rem] border border-[#E2E4EB] bg-[#FFFFFF] p-5 text-left shadow-[0_1px_2px_rgba(27,31,59,0.04),0_12px_32px_-12px_rgba(27,31,59,0.14)] transition-[border-color,box-shadow] duration-300 hover:border-[#7C5DFA]/50 hover:shadow-[0_1px_2px_rgba(27,31,59,0.04),0_20px_44px_-14px_rgba(124,93,250,0.28)] dark:border-[#2A305A] dark:bg-[#151934] dark:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.55)] sm:flex-row sm:items-center sm:gap-6 sm:p-6"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          <span className="font-mono tracking-[0.15em] text-[#6B7280] dark:text-[#9EA5C0]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={`rounded-full px-3 py-1 font-semibold ${getTagStyle(project.category)}`}>
            {project.category}
          </span>
          <span className="font-mono tracking-[0.15em] text-[#6B7280] dark:text-[#9EA5C0]">{project.year}</span>
        </div>

        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-[#4A3E8C] transition-colors group-hover:text-[#7C5DFA] dark:text-[#B9A8FF] dark:group-hover:text-white sm:text-xl">
          {project.title}
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#374151] dark:text-[#D1D5DB]">
          {project.subtitle}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.slice(0, VISIBLE_STACK).map((item) => (
            <span
              key={item}
              className="rounded-full bg-[#F4F5F8] px-2.5 py-1 text-[0.6875rem] font-medium text-[#374151] dark:bg-[#1D2245] dark:text-[#D1D5DB]"
            >
              {item}
            </span>
          ))}
          {extra > 0 ? (
            <span className="rounded-full bg-[#F4F5F8] px-2.5 py-1 text-[0.6875rem] font-medium text-[#6B7280] dark:bg-[#1D2245] dark:text-[#9EA5C0]">
              +{extra}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#7C5DFA] dark:text-[#9277FF]">
          View case study
          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>

      <div
        className="relative h-40 w-full shrink-0 overflow-hidden rounded-2xl border border-[#E2E4EB] bg-[#F4F5F8] dark:border-[#2A305A] dark:bg-[#1D2245] sm:h-36 sm:w-60"
        style={
          project.image
            ? undefined
            : { background: `linear-gradient(135deg, ${project.palette[0]}, ${project.palette[1]})` }
        }
      >
        {project.image ? (
          <img
            src={project.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-12 place-items-center rounded-2xl border border-white/25 bg-white/15 text-white backdrop-blur-md">
              <Icon icon={project.icon} size={22} />
            </span>
          </span>
        )}
      </div>
    </button>
  );

  if (inStage) return card;

  return (
    <Reveal direction="up" delay={0.06 * index}>
      {card}
    </Reveal>
  );
}

export function FeaturedProjects(): React.JSX.Element {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeProject = useCallback(() => setSelectedProject(null), []);
  useEscapeKey(selectedProject !== null, closeProject);
  useScrollLock(selectedProject !== null);

  useEffect(() => {
    if (selectedProject) {
      closeButtonRef.current?.focus();
    }
  }, [selectedProject]);

  // The stack itself is plain CSS: every card is `sticky` at the same top,
  // so the first one holds still and each later card scrolls up over it
  // and covers it completely; scrolling back up reverses it. This only
  // equalises card heights — a shorter card arriving on top of a taller
  // one would otherwise leave the taller one's bottom edge showing.
  useEffect(() => {
    if (reduceMotion) return undefined;

    const equalise = (): void => {
      const buttons = Array.from(listRef.current?.querySelectorAll<HTMLElement>('button') ?? []);
      buttons.forEach((btn) => {
        btn.style.minHeight = '';
      });
      const tallest = Math.max(0, ...buttons.map((btn) => btn.offsetHeight));
      buttons.forEach((btn) => {
        btn.style.minHeight = `${tallest}px`;
      });
    };

    equalise();
    window.addEventListener('resize', equalise);
    // Web fonts and late layout change text wrapping, so re-measure after both.
    window.addEventListener('load', equalise);
    void document.fonts?.ready.then(equalise);
    return () => {
      window.removeEventListener('resize', equalise);
      window.removeEventListener('load', equalise);
    };
  }, [reduceMotion]);

  return (
    <section
      id="projects"
      className="relative bg-[#F4F5F8] py-20 text-[#1B1F3B] transition-colors dark:bg-[#0B0E1E] dark:text-white"
    >
      <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        {/* Header. overflow-hidden is scoped to just this row (a sibling of
            the pinned stage below, not an ancestor of it) so it clips the
            Reveal entrance animation's initial offset without breaking the
            stage's sticky frame — overflow:hidden on any ancestor of a
            position:sticky element disables its stickiness entirely. */}
        <div className="flex flex-col justify-between gap-4 overflow-hidden sm:flex-row sm:items-end">
          <div>
            <Reveal direction="down" distance={10}>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E2E4FA] px-3.5 py-1 text-xs font-bold text-[#1B1F3B] dark:bg-[#7C5DFA]/20 dark:text-[#E2E4FA]">
                <span className="size-1.5 rounded-full bg-[#7C5DFA]" />
                <span>FEATURED PROJECTS</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.1}>
              <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[#1B1F3B] sm:text-3xl lg:text-4xl dark:text-white">
                Real-World Projects & Products
              </h2>
            </Reveal>
          </div>

          <Reveal direction="left" delay={0.15}>
            <a
              href="https://github.com/voonnagowriganesh"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('github-click', { label: 'View All Projects' })}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A3E8C] transition-colors hover:text-[#7C5DFA] dark:text-[#9277FF] dark:hover:text-white"
            >
              <span>View All Projects</span>
              <ArrowRight size={14} />
            </a>
          </Reveal>
        </div>

        {/* All cards share one parent so their sticky windows overlap; each
            sticks at the same top, so a later card lands exactly on top of
            the one before and hides it fully. Reduced motion gets the same
            list without the sticky behaviour. */}
        <div ref={listRef} className="relative mt-10 flex flex-col gap-5 sm:mt-12">
          {projects.map((project, index) =>
            reduceMotion ? (
              <ProjectCardButton
                key={project.id}
                project={project}
                index={index}
                onOpen={() => {
                  track('project-open', { id: project.id });
                  setSelectedProject(project);
                }}
              />
            ) : (
              <div key={project.id} className="sticky top-20 sm:top-24">
                <ProjectCardButton
                  project={project}
                  index={index}
                  onOpen={() => {
                    track('project-open', { id: project.id });
                    setSelectedProject(project);
                  }}
                  inStage
                />
              </div>
            ),
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProject ? (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeProject}
              className="absolute inset-0 bg-[#1B1F3B]/60 backdrop-blur-md dark:bg-black/75"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              data-lenis-prevent
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-dialog-title"
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#E2E4EB] bg-[#FFFFFF] p-6 text-[#1B1F3B] shadow-2xl dark:border-[#2A305A] dark:bg-[#151934] dark:text-white sm:p-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E4EB] dark:border-[#2A305A]">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${getTagStyle(
                    selectedProject.category,
                  )}`}
                >
                  {selectedProject.category}
                </span>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeProject}
                  aria-label="Close project details"
                  className="rounded-full p-2 text-[#374151] hover:bg-[#F4F5F8] dark:text-slate-400 dark:hover:bg-[#1D2245]"
                >
                  <X size={20} />
                </button>
              </div>

              {selectedProject.image ? (
                <div className="mt-5 overflow-hidden rounded-2xl border border-[#E2E4EB] dark:border-[#2A305A]">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="h-auto w-full object-cover"
                  />
                </div>
              ) : null}

              <div className="mt-5">
                <h3 id="project-dialog-title" className="font-display text-2xl font-bold text-[#1B1F3B] dark:text-white">
                  {selectedProject.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#374151] dark:text-[#D1D5DB]">
                  {selectedProject.summary}
                </p>

                {/* Links */}
                {selectedProject.links?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {selectedProject.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => track('github-click', { project: selectedProject.id, label: link.label })}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E4EB] bg-[#F4F5F8] px-3.5 py-1.5 text-xs font-semibold text-[#1B1F3B] transition-colors hover:border-[#7C5DFA] hover:text-[#7C5DFA] dark:border-[#2A305A] dark:bg-[#1D2245] dark:text-[#E2E4FA]"
                      >
                        <span>{link.label}</span>
                        <ExternalLink size={12} />
                      </a>
                    ))}
                  </div>
                ) : null}

                {/* Metrics */}
                {selectedProject.metrics?.length ? (
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {selectedProject.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-2xl border border-[#E2E4EB] bg-[#F4F5F8] p-3 text-center dark:border-[#2A305A] dark:bg-[#1D2245]"
                      >
                        <span className="font-display block text-xl font-bold text-[#7C5DFA]">
                          {m.value}
                        </span>
                        <span className="mt-1 block text-[0.6875rem] text-[#4A3E8C] dark:text-[#9277FF]">{m.label}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Highlights */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold tracking-wider text-[#4A3E8C] uppercase dark:text-[#9277FF]">
                    Key Highlights
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {selectedProject.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-xs text-[#374151] dark:text-[#D1D5DB]">
                        <CheckCircle2 size={15} className="mt-0.5 text-[#7C5DFA] shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stack */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold tracking-wider text-[#4A3E8C] uppercase dark:text-[#9277FF]">
                    Technologies
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedProject.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-[#E2E4EB] bg-[#F4F5F8] px-2.5 py-1 text-xs font-medium text-[#1B1F3B] dark:border-[#2A305A] dark:bg-[#1D2245] dark:text-[#E2E4FA]"
                      >
                        {item}
                      </span>
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
