import { identity } from '../data/content';

export function Footer() {
  return (
    <footer className="bg-ink py-8 text-paper/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-xs sm:flex-row">
        <span>
          © {new Date().getFullYear()} {identity.name}. Built from scratch, light theme only.
        </span>
        <span className="label-mono text-[10px] text-paper/40">Designed &amp; engineered end to end.</span>
      </div>
    </footer>
  );
}
