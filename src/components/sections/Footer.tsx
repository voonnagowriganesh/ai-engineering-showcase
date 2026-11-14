import { identity, navSections, socials } from '@/data/profile';
import { useScrollTo } from '@/hooks/useScroll';
import { Icon } from '@/components/ui/primitives';

export function Footer(): React.JSX.Element {
  const scrollTo = useScrollTo();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-emerald-500/20 bg-[#04120a] py-10 text-white">
      <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* ── Left: Monogram and Title ─────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollTo('hero', -20)}
              className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-emerald-400 to-emerald-600 font-display text-sm font-black text-[#04140b] shadow-[0_0_15px_rgba(52,211,153,0.35)]"
            >
              {identity.initials}
            </button>
            <div className="text-left">
              <span className="block text-sm font-bold text-white">
                {identity.fullName}
              </span>
              <span className="block text-xs text-emerald-400">
                {identity.role}
              </span>
            </div>
          </div>

          {/* ── Center: Nav Links ───────────────────────────────────────── */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-300">
              {navSections.map((section) => (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(section.id, -20)}
                    className="transition-colors hover:text-emerald-400"
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Right: Socials ─────────────────────────────────────────── */}
          <div className="flex items-center gap-2.5">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex size-8 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-950/50 text-slate-300 transition-all hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
              >
                <Icon icon={social.icon} size={14} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 text-center text-[0.6875rem] text-slate-400 border-t border-emerald-500/10">
          <p>© {year} {identity.fullName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
