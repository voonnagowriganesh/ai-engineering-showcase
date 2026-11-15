import { useEffect, useRef, useState } from 'react';
import { projects } from '../data/content';
import { SectionHeading } from './SectionHeading';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { Reveal } from './Reveal';
import { track } from '../lib/analytics';
import type { Project } from '../types';

export function Projects() {
  const [active, setActiveState] = useState<Project | null>(null);
  const setActive = (project: Project | null) => {
    if (project) track('project-open', { id: project.id });
    setActiveState(project);
  };
  const [reduceMotion, setReduceMotion] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(media.matches);
    const onChange = () => setReduceMotion(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  // The stack itself is plain CSS: every card is `sticky` at the same top,
  // so the first one holds still and each later card scrolls up over it
  // and covers it completely; scrolling back up reverses it. This only
  // equalises card heights — a shorter card arriving on top of a taller
  // one would otherwise leave the taller one's bottom edge showing.
  useEffect(() => {
    if (reduceMotion) return undefined;

    const equalise = () => {
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
    <section id="projects" className="relative bg-paper-deep py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          index="03"
          eyebrow="Projects"
          title="Seven builds, one habit: ship it end to end."
          description="From a sub-2-second voice agent to authentication proofs-of-concept — each one built, deployed and documented."
        />

        {/* All cards share one parent so their sticky windows overlap; each
            sticks at the same top, so a later card lands exactly on top of
            the one before and hides it fully. Reduced motion gets the same
            list without the sticky behaviour. */}
        <div ref={listRef} className="relative mt-16 flex flex-col gap-5">
          {projects.map((project, i) =>
            reduceMotion ? (
              <Reveal key={project.id} delay={(i % 4) * 0.06}>
                <ProjectCard project={project} index={i} onOpen={() => setActive(project)} />
              </Reveal>
            ) : (
              <div key={project.id} className="sticky top-20 sm:top-24">
                <ProjectCard project={project} index={i} onOpen={() => setActive(project)} />
              </div>
            ),
          )}
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
