import { useEffect, useRef, useState } from 'react';
import { GraduationCap } from 'lucide-react';

interface CgpaRingProps {
  cgpa?: string;
  max?: number;
  accent: string;
}

/**
 * Animated circular-progress ring for a CGPA score. Falls back to a simple
 * graduation glyph when no numeric score is recorded.
 */
export function CgpaRing({ cgpa, max = 10, accent }: CgpaRingProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const score = cgpa ? parseFloat(cgpa) : 0;
  const pct = Math.min(score / max, 1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!cgpa) {
    return (
      <div
        ref={ref}
        className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed"
        style={{ borderColor: `${accent}55` }}
      >
        <GraduationCap size={28} style={{ color: accent }} />
      </div>
    );
  }

  return (
    <div ref={ref} className="relative flex h-24 w-24 items-center justify-center">
      <svg viewBox="0 0 96 96" className="h-24 w-24 -rotate-90">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#1B171210" strokeWidth="8" />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={accent}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={visible ? circumference * (1 - pct) : circumference}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-lg font-semibold text-ink">{cgpa}</span>
        <span className="text-[9px] uppercase tracking-wide text-ink-faint">/ {max}</span>
      </div>
    </div>
  );
}
