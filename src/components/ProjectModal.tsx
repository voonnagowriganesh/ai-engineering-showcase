import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import type { Project } from '../types';
import { track } from '../lib/analytics';
import { ProjectVisual } from './ProjectVisual';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

/**
 * Detail modal. Scroll handling is intentionally simple: this project does
 * not use a global scroll-hijacking library (no Lenis), so locking the
 * background to `overflow:hidden` can never fight with the modal's own
 * `overflow-y-auto` panel — there's no wheel-event interceptor in the page
 * to exclude the modal from in the first place.
 */
export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    document.body.classList.add('modal-open');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] bg-paper shadow-card"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink shadow-soft backdrop-blur hover:text-signal"
            >
              <X size={16} />
            </button>

            {/* This inner element owns the scroll — it is the only scrollable
               region in the overlay, so there is no ambiguity about which
               element should receive wheel/touch scroll events. */}
            <div className="overflow-y-auto">
              <div
                className="relative h-48 w-full overflow-hidden sm:h-64"
                style={{ backgroundColor: `${project.palette[0]}0d` }}
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={`${project.title} preview`}
                    className="h-full w-full object-cover"
                    decoding="async"
                  />
                ) : (
                  <ProjectVisual variant={project.visual} palette={project.palette} id={`modal-${project.id}`} />
                )}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-paper to-transparent" />
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 text-xs">
                  <span className="rounded-full bg-paper-deep px-3 py-1 font-semibold text-ink-soft">
                    {project.category}
                  </span>
                  <span className="label-mono text-ink-faint">{project.year}</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-ink sm:text-3xl">{project.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">{project.summary}</p>

                {project.metrics ? (
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {project.metrics.map((m) => (
                      <div key={m.label} className="rounded-2xl bg-paper-deep/70 p-3 text-center">
                        <div className="font-display text-lg font-semibold" style={{ color: project.palette[0] }}>
                          {m.value}
                        </div>
                        <div className="mt-0.5 text-[11px] text-ink-faint">{m.label}</div>
                      </div>
                    ))}
                  </div>
                ) : null}

                <h4 className="label-mono mt-7 text-xs text-amber">Highlights</h4>
                <ul className="mt-3 space-y-2.5">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: project.palette[0] }}
                      />
                      {h}
                    </li>
                  ))}
                </ul>

                <h4 className="label-mono mt-7 text-xs text-amber">Stack</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-ink/10 bg-paper-deep/60 px-3 py-1 text-xs font-medium text-ink-soft"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => track('github-click', { project: project.id, label: link.label })}
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:-translate-y-0.5"
                    >
                      {link.label}
                      <ArrowUpRight size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
