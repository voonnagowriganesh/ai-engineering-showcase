interface AvatarGlyphProps {
  accent: readonly [string, string];
  seed: number;
  active?: boolean;
}

/**
 * Generative "portrait" medallion used in place of a real photograph in the
 * Experience section. It's a layered, anime/low-poly-inspired bust rendered
 * purely in SVG — rim-lit gradient fill, faceted highlight planes and a
 * circuit-line overlay — so each role gets a distinct, artistic identity
 * without reusing any photo asset.
 */
export function AvatarGlyph({ accent, seed, active = false }: AvatarGlyphProps) {
  const [c1, c2] = accent;
  const gradId = `avatar-grad-${seed}`;
  const rimId = `avatar-rim-${seed}`;
  const maskId = `avatar-mask-${seed}`;

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <linearGradient id={rimId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${gradId}-bg`} cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor={c2} stopOpacity="0.35" />
          <stop offset="100%" stopColor={c1} stopOpacity="0" />
        </radialGradient>
        <clipPath id={maskId}>
          <circle cx="100" cy="100" r="92" />
        </clipPath>
      </defs>

      <circle cx="100" cy="100" r="96" fill="#FBF8F2" />
      <circle cx="100" cy="100" r="92" fill={`url(#${gradId}-bg)`} />

      <g clipPath={`url(#${maskId})`}>
        {/* faceted low-poly bust, built from simple triangles for an anime/3D feel */}
        <polygon points="100,46 132,86 100,196 68,86" fill={`url(#${gradId})`} opacity="0.92" />
        <polygon points="100,46 132,86 100,120" fill="#ffffff" opacity="0.14" />
        <polygon points="68,86 100,46 100,120" fill="#000000" opacity="0.08" />
        <polygon points="100,120 132,86 146,150 100,196" fill="#000000" opacity="0.1" />
        <polygon points="100,120 68,86 54,150 100,196" fill="#ffffff" opacity="0.08" />
        {/* head */}
        <circle cx="100" cy="74" r="30" fill={`url(#${gradId})`} />
        <path d="M70 74a30 30 0 0 1 60 0c0 10-6 16-6 16H76s-6-6-6-16Z" fill="#ffffff" opacity="0.1" />
        {/* rim light sweep */}
        <rect x="0" y="0" width="200" height="90" fill={`url(#${rimId})`} opacity="0.35" />
        {/* circuit-line overlay, anime-tech accent */}
        <g stroke={c2} strokeWidth="1.1" opacity={active ? 0.55 : 0.3} fill="none" strokeLinecap="round">
          <path d="M40 150 h20 l8 -10 h24" />
          <path d="M160 150 h-20 l-8 -10 h-24" />
          <circle cx="60" cy="150" r="2.2" fill={c2} stroke="none" />
          <circle cx="140" cy="150" r="2.2" fill={c2} stroke="none" />
          <path d="M100 196 V170" />
          <circle cx="100" cy="166" r="2.2" fill={c1} stroke="none" />
        </g>
      </g>

      <circle
        cx="100"
        cy="100"
        r="94"
        fill="none"
        stroke={c1}
        strokeOpacity={active ? 0.5 : 0.25}
        strokeWidth="2"
      />
    </svg>
  );
}
