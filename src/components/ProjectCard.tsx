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
      className="group flex w-full flex-col gap-4 overflow-hidden rounded-[1.75rem] border border-ink/10 bg-paper p-5 text-left shadow-card transition-transform duration-150 ease-out [perspective:1000px] sm:flex-row sm:items-center sm:gap-6 sm:p-6"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 text-xs">
          <span className="label-mono text-ink-faint">0{index + 1}</span>
          <span className="rounded-full bg-paper-deep px-3 py-1 font-semibold text-ink-soft">{project.category}</span>
          <span className="label-mono text-ink-faint">{project.year}</span>
        </div>

        <h3 className="mt-3 font-display text-lg font-semibold text-ink transition-colors group-hover:text-signal sm:text-xl">
          {project.title}
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{project.subtitle}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
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

        <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-signal">
          View case study
          <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      <div
        className="relative h-32 w-full shrink-0 overflow-hidden rounded-2xl sm:h-full sm:w-52"
        style={{ backgroundColor: `${project.palette[0]}0d` }}
      >
        <ProjectVisual variant={project.visual} palette={project.palette} id={project.id} />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent sm:bg-gradient-to-l" />
      </div>
    </motion.button>
  );
}
