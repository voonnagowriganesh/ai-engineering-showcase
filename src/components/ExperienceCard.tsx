import { motion } from 'framer-motion';
import { Lock, MapPin } from 'lucide-react';
import type { Experience } from '../types';
import { AvatarGlyph } from './AvatarGlyph';
import { useTilt } from '../hooks/useTilt';
import { Reveal } from './Reveal';

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

export function ExperienceCard({ experience, index }: ExperienceCardProps) {
  const tilt = useTilt(7);

  return (
    <Reveal delay={index * 0.08}>
      <div className="relative grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
        {/* timeline rail node */}
        <div className="hidden flex-col items-center sm:flex">
          <span
            className="z-10 flex h-4 w-4 items-center justify-center rounded-full border-4 border-paper shadow-soft"
            style={{ backgroundColor: experience.accent[0] }}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-[9rem_1fr] sm:items-start">
          {/* 3D medallion: the real company logo on a white tile, or a
              generative glyph when no logo is available. */}
          <div className="[perspective:900px]">
            <div
              ref={tilt.ref}
              onPointerMove={tilt.onPointerMove}
              onPointerLeave={tilt.onPointerLeave}
              style={{
                transform: `rotateX(${tilt.tilt.rotateX}deg) rotateY(${tilt.tilt.rotateY}deg)`,
              }}
              className="relative mx-auto h-28 w-28 shrink-0 rounded-3xl bg-paper shadow-card transition-transform duration-150 ease-out sm:h-36 sm:w-36"
            >
              {experience.logo ? (
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-ink/10 bg-white p-4 sm:p-5">
                  <img
                    src={experience.logo}
                    alt={`${experience.company} logo`}
                    width={112}
                    height={112}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-full w-full overflow-hidden rounded-3xl">
                  <AvatarGlyph accent={experience.accent} seed={index} active={experience.status === 'current'} />
                </div>
              )}
              {experience.status === 'current' && (
                <span className="absolute -right-2 -top-2 flex h-7 items-center rounded-full border border-white bg-sage px-2.5 text-[10px] font-bold uppercase tracking-wide text-paper shadow-soft">
                  Current
                </span>
              )}
              <div
                className="pointer-events-none absolute -inset-3 -z-10 rounded-[2rem] opacity-50 blur-xl"
                style={{ background: `linear-gradient(135deg, ${experience.accent[0]}, ${experience.accent[1]})` }}
              />
            </div>
          </div>

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-[1.75rem] border border-ink/10 bg-paper p-6 shadow-card sm:p-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">{experience.role}</h3>
                <p className="mt-1 text-sm font-semibold" style={{ color: experience.accent[0] }}>
                  {experience.company}
                </p>
              </div>
              <div className="flex flex-col items-start gap-1 sm:items-end">
                <span className="label-mono rounded-full bg-paper-deep px-3 py-1 text-[11px] text-ink-soft">
                  {experience.period}
                </span>
                <span className="flex items-center gap-1 text-xs text-ink-faint">
                  <MapPin size={12} /> {experience.location}
                </span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">{experience.summary}</p>

            <ul className="mt-4 space-y-2">
              {experience.responsibilities.map((r) => (
                <li key={r} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: experience.accent[0] }}
                  />
                  {r}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              {experience.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-ink/10 bg-paper-deep/70 px-3 py-1 text-xs font-medium text-ink-soft"
                >
                  {s}
                </span>
              ))}
            </div>

            {experience.confidential ? (
              <p className="mt-5 flex items-start gap-2.5 border-t border-ink/10 pt-4 text-xs leading-relaxed text-ink-faint">
                <Lock size={13} className="mt-0.5 shrink-0" />
                Work at {experience.company} is covered by confidentiality. Responsibilities and technologies are
                described in general terms; internal products, architecture and metrics are deliberately omitted.
              </p>
            ) : null}
          </motion.div>
        </div>
      </div>
    </Reveal>
  );
}
