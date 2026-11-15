import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckCircle2, ExternalLink, X } from 'lucide-react';
import { projects } from '@/data/profile';
import { useScrollLock } from '@/hooks/useScroll';
import { useReducedMotion } from '@/hooks/useInteractions';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/primitives';
import type { Project } from '@/domain/models';

function getTagStyle(category: string): string {
  switch (category) {
    case 'AI Product':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-500/30';
    case 'AI Engineering':
      return 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border-sky-500/30';
    case 'Agentic AI':
    case 'Automation':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-500/30';
    case 'Full-Stack':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-500/30';
    case 'AI / RAG':
    case 'ML / Data':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-500/30';
    case 'Computer Vision':
      return 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950/70 dark:text-fuchsia-300 border-fuchsia-500/30';
    default:
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-500/30';
  }
}

interface ProjectCardButtonProps {
  readonly project: Project;
  readonly index: number;
  readonly onOpen: () => void;
  /** True inside the sticky stack, where a scroll-reveal transform on the
   * card would fight the sticky positioning. */
  readonly inStage?: boolean;
}

function ProjectCardButton({ project, index, onOpen, inStage }: ProjectCardButtonProps): React.JSX.Element {
  const card = (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full flex-col gap-5 overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-6 text-left shadow-xl transition-colors duration-300 hover:border-emerald-500/40 dark:border-emerald-500/20 dark:bg-[#0b2115] sm:flex-row sm:items-center sm:gap-9 sm:p-9"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-stone-400 dark:text-emerald-500/60">0{index + 1}</span>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-bold ${getTagStyle(
              project.category,
            )}`}
          >
            {project.category}
          </span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-bold leading-snug text-[#0a1e12] group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-300 sm:text-3xl lg:text-4xl">
          {project.title}
        </h3>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-600 dark:text-emerald-100/70 sm:text-base">
          {project.subtitle}
        </p>

        <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          <span>View details</span>
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* Real artwork where supplied; otherwise a generative panel derived
          from the project's own palette, so no card depends on a
          generated image that might bake in text of its own. */}
      <div
        className="relative h-32 w-full shrink-0 overflow-hidden rounded-2xl border border-stone-200/80 dark:border-emerald-500/30 sm:w-72"
        style={
          project.image
            ? undefined
            : { background: `linear-gradient(135deg, ${project.palette[0]}, ${project.palette[1]})` }
        }
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span className="grid size-12 place-items-center rounded-2xl border border-white/25 bg-white/15 text-white backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">
            <Icon icon={project.icon} size={22} />
          </span>
        )}
        <span className="absolute top-3 right-3 rounded-full border border-white/25 bg-black/25 px-2 py-0.5 font-mono text-[0.625rem] text-white backdrop-blur-md">
          {project.year}
        </span>
      </div>
    </button>
  );

  // The pinned stage's own entrance is handled by the slide-up-and-cover
  // transform, not a scroll-reveal fade — Reveal is only useful here in
  // the static reduced-motion fallback, which has no other entrance.
  return inStage ? card : <Reveal direction="up" delay={0.06 * index}>{card}</Reveal>;
}

export function FeaturedProjects(): React.JSX.Element {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);

  // Plain `overflow: hidden` on body isn't enough — this site drives scroll
  // through Lenis (see ScrollService), which scrolls the page via its own
  // rAF loop regardless of CSS overflow. useScrollLock calls into the same
  // service the command palette already uses, so Lenis itself is paused
  // while the modal is open, not just the body's native overflow.
  useScrollLock(selectedProject !== null);

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

    window.addEventListener('resize', equalise);
    equalise();
    // Web fonts change text wrapping, so re-measure once they've loaded.
    void document.fonts?.ready.then(equalise);
    return () => window.removeEventListener('resize', equalise);
  }, [reduceMotion]);

  return (
    <section
      id="projects"
      className="relative bg-[#f7f6f0] py-20 text-[#071910] transition-colors dark:bg-[#06180f] dark:text-white"
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
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>FEATURED PROJECTS</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.1}>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#0a1e12] dark:text-white sm:text-3xl lg:text-4xl">
                Real-World Projects & Products
              </h2>
            </Reveal>
          </div>

          <Reveal direction="left" delay={0.15}>
            <a
              href="https://github.com/voonnagowriganesh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 transition-colors hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
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
        <div ref={listRef} className="relative mt-16 flex flex-col gap-5">
          {projects.map((project, index) =>
            reduceMotion ? (
              <ProjectCardButton
                key={project.id}
                project={project}
                index={index}
                onOpen={() => setSelectedProject(project)}
              />
            ) : (
              <div key={project.id} className="sticky top-20 sm:top-24">
                <ProjectCardButton
                  project={project}
                  index={index}
                  onOpen={() => setSelectedProject(project)}
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
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              // Lenis's own wheel handler calls preventDefault() on every
              // scroll while stopped unless the target carries this
              // attribute — without it, locking the page for the modal
              // also silently blocks the modal's own overflow-y-auto.
              data-lenis-prevent
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-emerald-500/30 bg-[#071910] p-6 text-white shadow-2xl sm:p-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${getTagStyle(
                    selectedProject.category,
                  )}`}
                >
                  {selectedProject.category}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="rounded-full p-2 text-slate-400 hover:bg-emerald-900/40 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {selectedProject.image ? (
                <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-500/20">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="h-auto w-full object-cover"
                  />
                </div>
              ) : null}

              <div className="mt-5">
                <h3 className="font-display text-2xl font-bold text-white">
                  {selectedProject.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {selectedProject.summary}
                </p>

                {/* Links */}
                {selectedProject.links?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {selectedProject.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 transition-colors hover:border-emerald-400 hover:bg-emerald-500/15 hover:text-white"
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
                        className="rounded-2xl border border-emerald-500/20 bg-emerald-950/40 p-3 text-center"
                      >
                        <span className="font-display block text-xl font-bold text-emerald-400">
                          {m.value}
                        </span>
                        <span className="mt-1 block text-[0.6875rem] text-slate-400">{m.label}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Highlights */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                    Key Highlights
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {selectedProject.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <CheckCircle2 size={15} className="mt-0.5 text-emerald-400 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stack */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                    Technologies
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedProject.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-emerald-500/20 bg-emerald-950/60 px-2.5 py-1 text-xs font-medium text-emerald-200"
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
