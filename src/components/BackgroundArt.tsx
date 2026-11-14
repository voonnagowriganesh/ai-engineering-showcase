interface BackgroundArtProps {
  variant?: 'hero' | 'soft' | 'dot-grid';
}

/**
 * Decorative, code-generated backdrop — soft gradient blobs plus a fine dot
 * grid. Pure CSS/SVG, no image assets, kept behind pointer-events-none so it
 * never interferes with interaction or scroll.
 */
export function BackgroundArt({ variant = 'soft' }: BackgroundArtProps) {
  if (variant === 'hero') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-signal/20 blur-[110px]" />
        <div className="absolute -right-24 top-10 h-[26rem] w-[26rem] rounded-full bg-amber/25 blur-[110px]" />
        <div className="absolute bottom-[-10rem] left-1/3 h-[24rem] w-[24rem] rounded-full bg-sage/15 blur-[120px]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.35]" aria-hidden="true">
          <defs>
            <pattern id="hero-dots" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="#1B1712" fillOpacity="0.14" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>
      </div>
    );
  }

  if (variant === 'dot-grid') {
    return (
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-60" aria-hidden="true">
        <defs>
          <pattern id="soft-dots" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.3" fill="#1B1712" fillOpacity="0.08" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#soft-dots)" />
      </svg>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -right-40 top-1/4 h-[26rem] w-[26rem] rounded-full bg-signal/10 blur-[100px]" />
      <div className="absolute -left-32 bottom-0 h-[22rem] w-[22rem] rounded-full bg-amber/10 blur-[100px]" />
    </div>
  );
}
