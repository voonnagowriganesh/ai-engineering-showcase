import { experiences } from '../data/content';
import { SectionHeading } from './SectionHeading';
import { ExperienceCard } from './ExperienceCard';

export function Experience() {
  return (
    <section id="experience" className="relative bg-paper py-28">
      <div className="mx-auto max-w-5xl px-5">
        <SectionHeading
          index="02"
          eyebrow="Experience"
          title="Where I've built."
          description="Three teams, one throughline: taking a product from requirement to running in production."
        />

        <div className="relative mt-16 space-y-14">
          <div
            aria-hidden="true"
            className="absolute left-[4.4rem] top-2 hidden h-[calc(100%-2rem)] w-px bg-gradient-to-b from-ink/15 via-ink/10 to-transparent sm:block"
          />
          {experiences.map((exp, i) => (
            <ExperienceCard key={exp.id} experience={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
