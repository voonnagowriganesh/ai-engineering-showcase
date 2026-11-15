import { identity, strengths } from '../data/content';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { BackgroundArt } from './BackgroundArt';

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-paper-deep py-28">
      <BackgroundArt />
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading index="01" eyebrow="About" title="Thinking in systems, shipping in product." />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            {identity.statements.map((line, i) => (
              <Reveal key={line} delay={i * 0.08}>
                <p className="text-lg leading-relaxed text-ink-soft sm:text-xl">{line}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="relative rounded-[2rem] border border-ink/10 bg-paper p-5 shadow-card sm:p-8">
              <span className="label-mono text-xs text-amber">Core strengths</span>
              {/* Below sm the icon sits above the label, so long words
                  ("development", "architecture") never run past the tile edge. */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {strengths.map(({ title, icon: Icon }) => (
                  <div
                    key={title}
                    className="group flex min-w-0 flex-col items-start gap-2.5 rounded-2xl border border-ink/5 bg-paper-deep/60 p-3 transition hover:-translate-y-0.5 hover:border-signal/30 hover:bg-white sm:flex-row sm:gap-3 sm:p-3.5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-signal/10 text-signal transition group-hover:bg-signal group-hover:text-paper">
                      <Icon size={15} />
                    </span>
                    <span className="min-w-0 break-words text-[13px] font-medium leading-snug text-ink">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
