import { identity, navSections, socials } from '@/data/profile';
import { useScrollTo } from '@/hooks/useScroll';
import { Icon } from '@/components/ui/primitives';
import { analyticsEnabled, track } from '@/lib/analytics';

export function Footer(): React.JSX.Element {
  const scrollTo = useScrollTo();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[#E2E4EB] dark:border-[#2A305A] bg-[#FFFFFF] dark:bg-[#0B0E1E] py-10 text-[#1B1F3B] dark:text-white transition-colors duration-300">
      <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* ── Left: Monogram and Title ─────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollTo('hero', -20)}
              className="flex size-9 items-center justify-center rounded-xl bg-[#1B1F3B] dark:bg-[#7C5DFA] font-display text-sm font-black text-white shadow-[0_4px_12px_rgba(27,31,59,0.2)]"
            >
              {identity.initials}
            </button>
            <div className="text-left">
              <span className="block text-sm font-bold text-[#1B1F3B] dark:text-white">
                {identity.fullName}
              </span>
              <span className="block text-xs font-medium text-[#4A3E8C] dark:text-[#9277FF]">
                {identity.role}
              </span>
            </div>
          </div>

          {/* ── Center: Nav Links ───────────────────────────────────────── */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-[#374151] dark:text-slate-300">
              {navSections.map((section) => (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(section.id, -20)}
                    className="transition-colors hover:text-[#7C5DFA]"
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
                onClick={() => track('social-click', { network: social.id, from: 'footer' })}
                className="flex size-8 items-center justify-center rounded-full border border-[#E2E4EB] dark:border-[#2A305A] bg-[#F4F5F8] dark:bg-[#151934] text-[#374151] dark:text-slate-300 transition-all hover:border-[#7C5DFA] hover:bg-[#E2E4FA] hover:text-[#7C5DFA]"
              >
                <Icon icon={social.icon} size={14} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 text-center text-[0.6875rem] text-[#6B7280] dark:text-slate-400 border-t border-[#E2E4EB] dark:border-[#2A305A]">
          <p>© {year} {identity.fullName}. All rights reserved.</p>
          {analyticsEnabled ? (
            <p className="mt-1.5 text-slate-400 dark:text-slate-500">Anonymous, cookie-free visit stats. No personal data is stored.</p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
