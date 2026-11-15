import { useEffect, useId, useRef, useState } from 'react';
import { GraduationCap, MapPin } from 'lucide-react';
import { education } from '@/data/profile';
import { Reveal } from '@/components/ui/Reveal';
import { useReducedMotion } from '@/hooks/useInteractions';
import { cn } from '@/lib/utils';

const CGPA_MAX = 10;
const RING_RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const LOAD_MS = 1800;
/** Each card starts a beat after the previous one, so they load in a cascade. */
const CASCADE_MS = 220;

/**
 * 0 → 1 progress (ease-out cubic) that starts the first time `ref` is half
 * in view, after `delayMs`. Reduced motion jumps straight to 1.
 */
function useLoadProgress(ref: React.RefObject<HTMLElement | null>, enabled: boolean, delayMs: number): number {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;
    if (reduceMotion) {
      setProgress(1);
      return undefined;
    }
    const el = ref.current;
    if (!el) return undefined;
    let frame = 0;
    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(() => {
          const start = performance.now();
          const tick = (now: number): void => {
            const t = Math.min(1, (now - start) / LOAD_MS);
            setProgress(1 - (1 - t) ** 3);
            if (t < 1) frame = requestAnimationFrame(tick);
          };
          frame = requestAnimationFrame(tick);
        }, delayMs);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [ref, enabled, delayMs, reduceMotion]);

  return progress;
}

/** Circular CGPA meter driven by the card's progress, with a glowing tip. */
function CgpaRing({ cgpa, progress }: { readonly cgpa: string; readonly progress: number }): React.JSX.Element {
  const gradientId = useId();
  const glowId = useId();
  const score = Number.parseFloat(cgpa);
  const decimals = cgpa.split('.')[1]?.length ?? 0;
  const pct = Math.min(score / CGPA_MAX, 1);
  const sweep = pct * progress;
  const loading = progress > 0 && progress < 1;
  const shown = progress >= 1 ? cgpa : (score * progress).toFixed(decimals);
  // Tip position on the arc (the svg is rotated -90deg so 0 is 12 o'clock).
  const angle = 2 * Math.PI * sweep;
  const tipX = 52 + RING_RADIUS * Math.cos(angle);
  const tipY = 52 + RING_RADIUS * Math.sin(angle);

  return (
    <div className="relative grid size-28 shrink-0 place-items-center" role="img" aria-label={`CGPA ${cgpa} out of ${CGPA_MAX}`}>
      {/* Breathing halo while the score is loading */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-2 rounded-full bg-[#7C5DFA]/25 blur-xl transition-opacity duration-700 dark:bg-[#7C5DFA]/35',
          loading ? 'animate-pulse opacity-100' : 'opacity-40',
        )}
      />
      <svg viewBox="0 0 104 104" className="absolute inset-0 size-28 -rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9277FF" />
            <stop offset="55%" stopColor="#7C5DFA" />
            <stop offset="100%" stopColor="#4A3E8C" />
          </linearGradient>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="52" cy="52" r={RING_RADIUS} fill="none" strokeWidth="7" className="stroke-[#E2E4FA] dark:stroke-[#2A305A]" />
        {/* Tick marks every 10% */}
        {Array.from({ length: 10 }, (_, i) => {
          const a = (2 * Math.PI * i) / 10;
          return (
            <line
              key={i}
              x1={52 + 38 * Math.cos(a)}
              y1={52 + 38 * Math.sin(a)}
              x2={52 + 35 * Math.cos(a)}
              y2={52 + 35 * Math.sin(a)}
              strokeWidth="1.5"
              strokeLinecap="round"
              className={cn(
                'transition-colors duration-300',
                i / 10 <= sweep ? 'stroke-[#7C5DFA]/70 dark:stroke-[#A78BFA]/80' : 'stroke-[#CBD5E1] dark:stroke-[#3D467D]',
              )}
            />
          );
        })}
        <circle
          cx="52"
          cy="52"
          r={RING_RADIUS}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - sweep)}
          filter={`url(#${glowId})`}
        />
        {progress > 0 ? (
          <circle cx={tipX} cy={tipY} r="5" className="fill-white dark:fill-[#E2E4FA]" filter={`url(#${glowId})`} />
        ) : null}
      </svg>
      <div className="relative flex flex-col items-center leading-none" aria-hidden="true">
        <span className="font-display text-2xl font-extrabold tabular-nums text-[#1B1F3B] dark:text-white">{shown}</span>
        <span className="mt-1 text-[0.625rem] font-semibold tracking-wide text-[#4A3E8C] dark:text-[#9EA5C0]">/ {CGPA_MAX}</span>
      </div>
    </div>
  );
}

/** "Score" bar that fills to the CGPA percentage with a light sweep while loading. */
function ScoreBar({ cgpa, progress }: { readonly cgpa: string; readonly progress: number }): React.JSX.Element {
  const pct = Math.min(Number.parseFloat(cgpa) / CGPA_MAX, 1);
  const fill = pct * progress * 100;
  const loading = progress > 0 && progress < 1;

  return (
    <div className="mt-4" aria-hidden="true">
      <div className="flex items-baseline justify-between text-[0.6875rem] font-semibold uppercase tracking-[0.14em]">
        <span className="text-[#6B7280] dark:text-[#9EA5C0]">{loading ? 'Loading score' : 'Score'}</span>
        <span className="font-display text-sm tracking-normal tabular-nums text-[#4A3E8C] dark:text-[#C4B5FD]">
          {fill.toFixed(1)}%
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E2E4FA] dark:bg-[#1D2245]">
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-[#9277FF] via-[#7C5DFA] to-[#4A3E8C] shadow-[0_0_14px_rgba(124,93,250,0.55)]"
          style={{ width: `${fill}%` }}
        >
          <span
            className={cn(
              'absolute inset-0 rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.7)_50%,transparent_100%)] bg-[length:220%_100%] transition-opacity duration-500',
              loading ? 'animate-shimmer opacity-100' : 'opacity-0',
            )}
          />
        </div>
      </div>
    </div>
  );
}

function EducationCard({ entry, index }: { readonly entry: (typeof education)[number]; readonly index: number }): React.JSX.Element {
  const ref = useRef<HTMLElement>(null);
  const progress = useLoadProgress(ref, Boolean(entry.cgpa), index * CASCADE_MS);

  return (
    <article
      ref={ref}
      className="group flex h-full flex-col gap-5 rounded-3xl border border-[#E2E4EB] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_-18px_rgba(27,31,59,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-[#7C5DFA]/50 hover:shadow-[0_18px_40px_-20px_rgba(124,93,250,0.45)] dark:border-[#2A305A] dark:bg-[#151934] sm:flex-row sm:items-start lg:flex-col"
    >
      {entry.cgpa ? (
        <CgpaRing cgpa={entry.cgpa} progress={progress} />
      ) : (
        <div className="grid size-28 shrink-0 place-items-center rounded-full border-2 border-dashed border-[#7C5DFA]/40">
          <GraduationCap size={30} className="text-[#7C5DFA]" />
        </div>
      )}

      <div className="flex w-full min-w-0 flex-1 flex-col">
        <span className="self-start rounded-full bg-[#E2E4FA] px-3 py-1 font-mono text-[0.6875rem] font-semibold text-[#4A3E8C] dark:bg-[#7C5DFA]/20 dark:text-[#C4B5FD]">
          {entry.period}
        </span>
        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-[#1B1F3B] dark:text-white">{entry.degree}</h3>
        {entry.specialisation ? (
          <p className="mt-1 text-sm leading-relaxed text-[#374151] dark:text-[#D1D5DB]">{entry.specialisation}</p>
        ) : null}

        {entry.cgpa ? <ScoreBar cgpa={entry.cgpa} progress={progress} /> : null}

        <div className="mt-auto pt-4">
          <div className="border-t border-[#E2E4EB] pt-4 text-sm dark:border-[#2A305A]">
            <p className="font-semibold text-[#1B1F3B] dark:text-white">{entry.institution}</p>
            {entry.university ? <p className="mt-0.5 text-xs text-[#4A3E8C] dark:text-[#9EA5C0]">{entry.university}</p> : null}
            <p className="mt-2 flex items-center gap-1.5 text-xs text-[#6B7280] dark:text-[#9EA5C0]">
              <MapPin size={12} className="shrink-0 text-[#7C5DFA]" />
              {entry.location}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function EducationSection(): React.JSX.Element {
  return (
    <section
      id="education"
      className="relative overflow-hidden bg-[#F4F5F8] py-20 text-[#1B1F3B] transition-colors dark:bg-[#0B0E1E] dark:text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C5DFA]/5 blur-[150px] dark:bg-[#7C5DFA]/10"
      />

      <div className="relative mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        <Reveal direction="down" distance={10}>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E2E4FA] px-3.5 py-1 text-xs font-bold text-[#1B1F3B] dark:bg-[#7C5DFA]/20 dark:text-[#E2E4FA]">
            <span className="size-1.5 rounded-full bg-[#7C5DFA]" />
            <span>06 · EDUCATION</span>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#1B1F3B] dark:text-white sm:text-3xl lg:text-4xl">
            The foundation underneath the work.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {education.map((entry, i) => (
            <Reveal key={entry.institution} direction="up" delay={0.08 * i} className="h-full">
              <EducationCard entry={entry} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
