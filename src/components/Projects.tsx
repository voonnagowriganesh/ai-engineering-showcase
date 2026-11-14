import { useState } from 'react';
import { projects } from '../data/content';
import { SectionHeading } from './SectionHeading';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { Reveal } from './Reveal';
import type { Project } from '../types';

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative bg-paper-deep py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          index="03"
          eyebrow="Projects"
          title="Seven builds, one habit: ship it end to end."
          description="From a sub-2-second voice agent to authentication proofs-of-concept — each one built, deployed and documented."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={(i % 4) * 0.06} className={project.featured ? 'sm:col-span-2' : ''}>
              <ProjectCard project={project} onOpen={() => setActive(project)} />
            </Reveal>
          ))}
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
