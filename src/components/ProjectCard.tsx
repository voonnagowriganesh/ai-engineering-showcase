import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../types';
import { ProjectVisual } from './ProjectVisual';
import { useTilt } from '../hooks/useTilt';

interface ProjectCardProps {
  project: Project;
  onOpen: () => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const tilt = useTilt<HTMLButtonElement>(5);

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      ref={tilt.ref}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      style={{ transform: `rotateX(${tilt.tilt.rotateX}deg) rotateY(${tilt.tilt.rotateY}deg)` }}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] border border-ink/10 bg-paper text-left shadow-card transition-transform duration-150 ease-out [perspective:1000px]"
    >
      <div
        className="relative h-40 w-full overflow-hidden sm:h-48"
        style={{ backgroundColor: `${project.palette[0]}0d` }}
      >
        <ProjectVisual variant={project.visual} palette={project.palette} id={project.id} />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/80 px-3 py-1 text-[11px] font-semibold text-ink shadow-soft backdrop-blur">
          {project.category}
        </span>
        <span className="absolute right-4 top-4 label-mono text-[11px] text-ink-faint">{project.year}</span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-semibold text-ink transition-colors group-hover:text-signal sm:text-xl">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{project.subtitle}</p>

        {project.metrics ? (
          <div className="mt-4 flex flex-wrap gap-4">
            {project.metrics.slice(0, 3).map((m) => (
              <div key={m.label}>
                <div className="font-display text-base font-semibold" style={{ color: project.palette[0] }}>
                  {m.value}
                </div>
                <div className="text-[11px] text-ink-faint">{m.label}</div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((s) => (
            <span key={s} className="rounded-full bg-paper-deep px-2.5 py-1 text-[11px] font-medium text-ink-soft">
              {s}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span className="rounded-full bg-paper-deep px-2.5 py-1 text-[11px] font-medium text-ink-faint">
              +{project.stack.length - 4}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-signal">
          View case study
          <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </motion.button>
  );
}
