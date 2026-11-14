import type { ProjectVisual as ProjectVisualType } from '../types';

interface ProjectVisualProps {
  variant: ProjectVisualType;
  palette: readonly [string, string];
  id: string;
}

/**
 * Code-generated, per-project illustration. Each variant is a small abstract
 * scene built from SVG primitives that echoes what the project does
 * (waveform for voice AI, document scan lines for resume parsing, a grid of
 * crates for inventory, etc.) rather than a generic placeholder box.
 */
export function ProjectVisual({ variant, palette, id }: ProjectVisualProps) {
  const [c1, c2] = palette;
  const gid = `pv-${id}`;

  const defs = (
    <defs>
      <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={c1} />
        <stop offset="100%" stopColor={c2} />
      </linearGradient>
      <linearGradient id={`${gid}-fade`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={c1} stopOpacity="0.5" />
        <stop offset="100%" stopColor={c1} stopOpacity="0" />
      </linearGradient>
    </defs>
  );

  switch (variant) {
    case 'voice':
      return (
        <svg viewBox="0 0 320 180" className="h-full w-full">
          {defs}
          <rect width="320" height="180" fill={`url(#${gid}-fade)`} opacity="0.5" />
          {Array.from({ length: 28 }).map((_, i) => {
            const h = 14 + Math.abs(Math.sin(i * 0.9)) * 70 + (i % 5) * 6;
            return (
              <rect
                key={i}
                x={10 + i * 11}
                y={90 - h / 2}
                width="5"
                height={h}
                rx="2.5"
                fill={`url(#${gid})`}
                opacity={0.55 + (i % 4) * 0.12}
              />
            );
          })}
          <circle cx="160" cy="90" r="64" fill="none" stroke={c1} strokeOpacity="0.25" strokeWidth="1.5" />
        </svg>
      );
    case 'resume':
      return (
        <svg viewBox="0 0 320 180" className="h-full w-full">
          {defs}
          <rect x="110" y="18" width="100" height="144" rx="10" fill="#FBF8F2" stroke={c1} strokeOpacity="0.3" />
          {Array.from({ length: 7 }).map((_, i) => (
            <rect
              key={i}
              x="126"
              y={40 + i * 16}
              width={i % 3 === 0 ? 68 : 52}
              height="6"
              rx="3"
              fill={`url(#${gid})`}
              opacity={0.85 - i * 0.07}
            />
          ))}
          <rect x="126" y="150" width="30" height="8" rx="4" fill={c2} opacity="0.6" />
          <circle cx="235" cy="45" r="16" fill="none" stroke={c2} strokeOpacity="0.4" strokeWidth="1.4" />
          <circle cx="85" cy="130" r="10" fill="none" stroke={c1} strokeOpacity="0.4" strokeWidth="1.4" />
        </svg>
      );
    case 'inventory':
      return (
        <svg viewBox="0 0 320 180" className="h-full w-full">
          {defs}
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 6 }).map((_, col) => {
              const skip = (row === 1 && col === 4) || (row === 3 && col === 1);
              if (skip) return null;
              return (
                <rect
                  key={`${row}-${col}`}
                  x={20 + col * 48}
                  y={20 + row * 36}
                  width="36"
                  height="26"
                  rx="4"
                  fill={`url(#${gid})`}
                  opacity={0.35 + ((row + col) % 3) * 0.18}
                />
              );
            }),
          )}
        </svg>
      );
    case 'community':
      return (
        <svg viewBox="0 0 320 180" className="h-full w-full">
          {defs}
          {[
            [100, 70],
            [160, 50],
            [220, 70],
            [130, 120],
            [190, 120],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="16" fill={`url(#${gid})`} opacity={0.8 - i * 0.07} />
              <circle cx={x} cy={y} r="22" fill="none" stroke={c2} strokeOpacity="0.25" />
            </g>
          ))}
          <path d="M100 70 L160 50 L220 70 L190 120 L130 120 Z" fill="none" stroke={c1} strokeOpacity="0.25" />
        </svg>
      );
    case 'auth':
      return (
        <svg viewBox="0 0 320 180" className="h-full w-full">
          {defs}
          <rect x="128" y="78" width="64" height="52" rx="8" fill={`url(#${gid})`} opacity="0.85" />
          <path d="M140 78v-16a20 20 0 0 1 40 0v16" fill="none" stroke={c1} strokeWidth="6" strokeLinecap="round" />
          <circle cx="160" cy="102" r="6" fill="#FBF8F2" />
          <rect x="157" y="106" width="6" height="14" rx="3" fill="#FBF8F2" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={100 - i * 18} cy={60 + i * 24} r="3" fill={c2} opacity={0.5} />
          ))}
        </svg>
      );
    case 'food':
      return (
        <svg viewBox="0 0 320 180" className="h-full w-full">
          {defs}
          <circle cx="160" cy="90" r="58" fill="none" stroke={c1} strokeOpacity="0.25" strokeWidth="10" />
          <circle cx="160" cy="90" r="58" fill="none" stroke={`url(#${gid})`} strokeWidth="10" strokeDasharray="120 400" />
          <circle cx="160" cy="90" r="34" fill={`url(#${gid})`} opacity="0.3" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <circle
                key={i}
                cx={160 + Math.cos(angle) * 58}
                cy={90 + Math.sin(angle) * 58}
                r="4"
                fill={c2}
                opacity="0.6"
              />
            );
          })}
        </svg>
      );
    case 'crime':
    default:
      return (
        <svg viewBox="0 0 320 180" className="h-full w-full">
          {defs}
          {Array.from({ length: 24 }).map((_, i) => {
            const x = 20 + (i % 8) * 36;
            const y = 24 + Math.floor(i / 8) * 46;
            const r = 6 + ((i * 7) % 11);
            return <circle key={i} cx={x} cy={y} r={r} fill={`url(#${gid})`} opacity={0.18 + (r / 20) * 0.5} />;
          })}
          <path d="M20 150 L80 100 L140 130 L200 60 L280 100" fill="none" stroke={c1} strokeWidth="2" opacity="0.5" />
        </svg>
      );
  }
}
