import { MapPin } from 'lucide-react';
import { education } from '../data/content';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { CgpaRing } from './CgpaRing';
import { BackgroundArt } from './BackgroundArt';

const accents = ['#4338CA', '#2F7A64', '#E8793C'];

export function Education() {
  return (
    <section id="education" className="relative overflow-hidden bg-paper py-28">
      <BackgroundArt variant="dot-grid" />
      <div className="relative mx-auto max-w-5xl px-5">
        <SectionHeading
          index="06"
          eyebrow="Education"
          title="The foundation underneath the work."
          align="center"
        />

        <div className="mt-16 space-y-6">
          {education.map((edu, i) => (
            <Reveal key={edu.institution} delay={i * 0.08}>
              <div className="flex flex-col gap-6 rounded-[1.75rem] border border-ink/10 bg-paper p-6 shadow-card sm:flex-row sm:items-center sm:gap-8 sm:p-8">
                <div className="flex justify-center sm:justify-start">
                  <CgpaRing cgpa={edu.cgpa} max={edu.cgpaMax} accent={accents[i % accents.length]} />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col items-center justify-between gap-2 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">{edu.degree}</h3>
                      {edu.specialisation ? (
                        <p className="mt-1 text-sm font-medium text-ink-soft">{edu.specialisation}</p>
                      ) : null}
                    </div>
                    <span
                      className="label-mono shrink-0 rounded-full px-3 py-1 text-[11px]"
                      style={{ backgroundColor: `${accents[i % accents.length]}14`, color: accents[i % accents.length] }}
                    >
                      {edu.period}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-col items-center gap-2 text-sm text-ink-soft sm:flex-row sm:items-center sm:gap-4">
                    <span className="font-medium text-ink">{edu.institution}</span>
                    {edu.university ? <span className="text-ink-faint">{edu.university}</span> : null}
                    <span className="flex items-center gap-1 text-ink-faint">
                      <MapPin size={12} /> {edu.location}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
