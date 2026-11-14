import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../types';
import { ProjectVisual } from './ProjectVisual';
import { useTilt } from '../hooks/useTilt';

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: () => void;
}

export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const tilt = useTilt<HTMLButtonElement>(3);

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      ref={tilt.ref}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      style={{ transform: `rotateX(${tilt.tilt.rotateX}deg) rotateY(${tilt.tilt.rotateY}deg)` }}
      className="group flex min-h-[420px] w-full flex-col gap-6 overflow-hidden rounded-[1.75rem] border border-ink/10 bg-paper p-7 text-left shadow-card transition-transform duration-150 ease-out [perspective:1000px] sm:min-h-[460px] sm:flex-row sm:items-center sm:gap-10 sm:p-10"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 text-xs">
          <span className="label-mono text-ink-faint">0{index + 1}</span>
          <span className="rounded-full bg-paper-deep px-3 py-1 font-semibold text-ink-soft">{project.category}</span>
          <span className="label-mono text-ink-faint">{project.year}</span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-semibold text-ink transition-colors group-hover:text-signal sm:text-3xl lg:text-4xl">
          {project.title}
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">{project.subtitle}</p>

        {project.metrics ? (
          <div className="mt-5 flex flex-wrap gap-5">
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

        <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-signal">
          View case study
          <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      <div
        className="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl sm:h-full sm:w-80"
        style={{ backgroundColor: `${project.palette[0]}0d` }}
      >
        <ProjectVisual variant={project.visual} palette={project.palette} id={project.id} />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent sm:bg-gradient-to-l" />
      </div>
    </motion.button>
  );
}
