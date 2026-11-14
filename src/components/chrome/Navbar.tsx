import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Command, Download, Menu, X } from 'lucide-react';
import { identity, navSections } from '@/data/profile';
import { useActiveSection, useScrollState, useScrollTo } from '@/hooks/useScroll';
import { useEscapeKey } from '@/hooks/useInteractions';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

const SECTION_IDS = navSections.map((section) => section.id);

export interface NavbarProps {
  readonly onOpenCommandPalette: () => void;
}

export function Navbar({ onOpenCommandPalette }: NavbarProps): React.JSX.Element {
  const { offset } = useScrollState();
  const activeSection = useActiveSection(SECTION_IDS, 'hero');
  const scrollTo = useScrollTo();
  const [mobileOpen, setMobileOpen] = useState(false);

  const condensed = offset > 30;

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  useEscapeKey(mobileOpen, closeMobile);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const media = window.matchMedia('(min-width: 1024px)');
    const handler = (): void => {
      if (media.matches) closeMobile();
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [mobileOpen, closeMobile]);

  const handleNavigate = useCallback(
    (sectionId: string): void => {
      closeMobile();
      scrollTo(sectionId, -20);
    },
    [closeMobile, scrollTo],
  );

  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[120] focus:rounded-full focus:bg-emerald-500 focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <motion.header
        className="fixed inset-x-0 top-0 z-[100] flex justify-center px-3 pt-3 sm:px-6"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          aria-label="Primary"
          className={cn(
            'flex w-full max-w-[84rem] items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500',
            condensed
              ? 'border border-emerald-500/20 bg-[#061910]/85 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] backdrop-blur-md'
              : 'border border-emerald-500/10 bg-[#061910]/60 backdrop-blur-sm',
          )}
        >
          {/* Monogram Brand */}
          <button
            type="button"
            onClick={() => handleNavigate('hero')}
            aria-label={`${identity.fullName} — back to top`}
            className="group flex shrink-0 items-center gap-2.5 rounded-full text-left"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-emerald-400 to-emerald-600 font-display text-sm font-black text-[#04140b] shadow-[0_0_15px_rgba(52,211,153,0.35)] transition-transform duration-300 group-hover:scale-105">
              {identity.initials}
            </span>
            {/* Hidden below sm: at phone width this plus the Resume link,
                theme toggle and hamburger together overflowed the nav pill
                — the monogram alone is enough brand presence that narrow. */}
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-[0.875rem] font-bold tracking-tight text-white transition-colors group-hover:text-emerald-400">
                {identity.fullName}
              </span>
              <span className="text-[0.625rem] font-medium tracking-wider text-emerald-400/80 uppercase">
                {identity.role}
              </span>
            </span>
          </button>

          {/* Desktop Links */}
          <ul className="mx-auto hidden items-center gap-1 xl:gap-2 lg:flex">
            {navSections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(section.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors duration-200',
                      isActive ? 'text-emerald-300' : 'text-slate-300 hover:text-white',
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full border border-emerald-400/40 bg-emerald-500/15"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <span className="relative z-10">{section.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right Actions */}
          <div className="flex shrink-0 items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Open command palette"
              className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/40 py-1.5 pr-2.5 pl-3 text-xs text-emerald-300/80 transition-colors duration-200 hover:border-emerald-500/40 hover:text-white md:flex"
            >
              <span>Search</span>
              <kbd className="flex items-center gap-0.5 rounded border border-emerald-500/30 bg-emerald-900/40 px-1.5 py-0.5 font-mono text-[0.625rem] text-emerald-300">
                <Command size={10} />K
              </kbd>
            </button>

            {/* Hidden below sm: already duplicated in the mobile drawer
                below, and showing it here too was what overflowed the bar. */}
            <a
              href={identity.resumeUrl}
              download={identity.resumeFileName}
              className="hidden h-9 items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-950/60 px-4 text-xs font-semibold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-200 hover:scale-105 hover:border-emerald-300 hover:bg-emerald-500 hover:text-slate-950 sm:inline-flex"
            >
              Resume
              <Download size={13} />
            </a>

            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="grid size-9 place-items-center rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 transition-colors hover:text-white lg:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            key="mobile-nav"
            className="fixed inset-0 z-[99] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              role="button"
              tabIndex={0}
              aria-label="Close menu"
              onClick={closeMobile}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') closeMobile();
              }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute top-0 right-0 bottom-0 flex w-72 flex-col border-l border-emerald-500/20 bg-[#071910] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-6 border-b border-emerald-500/15">
                <span className="font-display text-base font-bold text-white">Menu</span>
                <button
                  type="button"
                  onClick={closeMobile}
                  className="rounded-full p-2 text-emerald-300 hover:bg-emerald-900/40"
                >
                  <X size={20} />
                </button>
              </div>

              <ul className="mt-6 flex flex-col gap-2">
                {navSections.map((section) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => handleNavigate(section.id)}
                      className={cn(
                        'w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors',
                        activeSection === section.id
                          ? 'bg-emerald-500/15 font-semibold text-emerald-300'
                          : 'text-slate-300 hover:bg-emerald-950/40 hover:text-white',
                      )}
                    >
                      {section.label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6 border-t border-emerald-500/15">
                <a
                  href={identity.resumeUrl}
                  download={identity.resumeFileName}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg"
                >
                  <Download size={15} />
                  Download Resume
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
