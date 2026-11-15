import { identity } from '../data/content';
import { analyticsEnabled } from '../lib/analytics';

export function Footer() {
  return (
    <footer className="bg-ink py-8 text-paper/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-center text-xs sm:flex-row sm:text-left">
        <span>
          © {new Date().getFullYear()} {identity.name}. Built from scratch, light theme only.
        </span>
        <span className="label-mono text-[10px] text-paper/40">Designed &amp; engineered end to end.</span>
      </div>
      {analyticsEnabled ? (
        <p className="mx-auto mt-3 max-w-6xl px-5 text-center text-[11px] text-paper/40 sm:text-left">
          Anonymous, cookie-free visit stats. No personal data is stored.
        </p>
      ) : null}
    </footer>
  );
}
