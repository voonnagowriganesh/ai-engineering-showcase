import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Command, Download, Menu, X } from 'lucide-react';
import { identity, navSections } from '@/data/profile';
import { useActiveSection, useScrollState, useScrollTo } from '@/hooks/useScroll';
import { useEscapeKey } from '@/hooks/useInteractions';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { track } from '@/lib/analytics';

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
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[120] focus:rounded-full focus:bg-[#7C5DFA] focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
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
              ? 'border border-[#E2E4EB] bg-[#FFFFFF]/95 shadow-[0_12px_36px_-10px_rgba(27,31,59,0.1)] backdrop-blur-md dark:border-[#2A305A] dark:bg-[#151934]/90'
              : 'border border-[#E2E4EB]/80 bg-[#FFFFFF]/85 shadow-[0_4px_20px_-5px_rgba(27,31,59,0.06)] backdrop-blur-sm dark:border-[#2A305A]/80 dark:bg-[#151934]/75',
          )}
        >
          {/* Monogram Brand */}
          <button
            type="button"
            onClick={() => handleNavigate('hero')}
            aria-label={`${identity.fullName} — back to top`}
            className="group flex shrink-0 items-center gap-2.5 rounded-full text-left"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#1B1F3B] font-display text-sm font-black text-white shadow-[0_4px_14px_rgba(27,31,59,0.25)] transition-transform duration-300 group-hover:scale-105 dark:bg-[#7C5DFA] dark:shadow-[0_4px_16px_rgba(124,93,250,0.35)]">
              {identity.initials}
            </span>

            <span className="hidden flex-col leading-tight sm:flex lg:hidden xl:flex">
              <span className="text-[0.875rem] font-bold tracking-tight text-[#1B1F3B] transition-colors group-hover:text-[#7C5DFA] dark:text-[#F4F5F8] dark:group-hover:text-[#9277FF]">
                {identity.fullName}
              </span>
              <span className="text-[0.625rem] font-medium tracking-wider text-[#4A3E8C] uppercase dark:text-[#9277FF]">
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
                      'relative rounded-full px-3 py-1.5 text-[0.8125rem] font-medium whitespace-nowrap transition-colors duration-200 xl:px-3.5',
                      isActive
                        ? 'font-semibold text-[#1B1F3B] dark:text-white'
                        : 'text-[#1B1F3B]/80 hover:text-[#7C5DFA] dark:text-[#D1D5DB] dark:hover:text-white',
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full border border-[#7C5DFA]/30 bg-[#E2E4FA] dark:border-[#7C5DFA]/40 dark:bg-[#7C5DFA]/25"
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
              className="hidden items-center gap-2 rounded-full border border-[#E2E4EB] bg-[#F4F5F8] py-1.5 pr-2.5 pl-3 text-xs font-medium text-[#1B1F3B] transition-colors duration-200 hover:border-[#7C5DFA]/40 hover:text-[#7C5DFA] md:flex dark:border-[#2A305A] dark:bg-[#1D2245] dark:text-[#D1D5DB] dark:hover:text-white"
            >
              <span className="lg:hidden xl:inline">Search</span>
              <kbd className="flex items-center gap-0.5 rounded border border-[#E2E4EB] bg-[#FFFFFF] px-1.5 py-0.5 font-mono text-[0.625rem] text-[#1B1F3B] dark:border-[#2A305A] dark:bg-[#151934] dark:text-white">
                <Command size={10} />K
              </kbd>
            </button>

            <a
              href={identity.resumeUrl}
              download={identity.resumeFileName}
              onClick={() => track('resume-download', { from: 'navbar' })}
              className="hidden h-9 items-center gap-2 rounded-full bg-[#1B1F3B] px-4 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(27,31,59,0.25)] transition-all duration-200 hover:scale-105 hover:bg-[#4A3E8C] sm:inline-flex dark:bg-[#7C5DFA] dark:shadow-[0_4px_16px_rgba(124,93,250,0.35)] dark:hover:bg-[#9277FF]"
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
              className="grid size-9 place-items-center rounded-full border border-[#E2E4EB] bg-[#FFFFFF] text-[#1B1F3B] transition-colors hover:border-[#7C5DFA] hover:text-[#7C5DFA] lg:hidden dark:border-[#2A305A] dark:bg-[#1D2245] dark:text-white"
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
              className="absolute inset-0 bg-[#1B1F3B]/50 backdrop-blur-md dark:bg-black/75"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute top-0 right-0 bottom-0 flex w-72 flex-col border-l border-[#E2E4EB] bg-[#FFFFFF] p-6 shadow-2xl dark:border-[#2A305A] dark:bg-[#0B0E1E]"
            >
              <div className="flex items-center justify-between pb-6 border-b border-[#E2E4EB] dark:border-[#2A305A]">
                <span className="font-display text-base font-bold text-[#1B1F3B] dark:text-white">Menu</span>
                <button
                  type="button"
                  onClick={closeMobile}
                  className="rounded-full p-2 text-[#374151] hover:bg-[#F4F5F8] dark:text-slate-400 dark:hover:bg-[#151934]"
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
                          ? 'bg-[#E2E4FA] font-bold text-[#1B1F3B] dark:bg-[#7C5DFA]/20 dark:text-white'
                          : 'text-[#374151] hover:bg-[#F4F5F8] hover:text-[#1B1F3B] dark:text-[#D1D5DB] dark:hover:bg-[#151934] dark:hover:text-white',
                      )}
                    >
                      {section.label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6 border-t border-[#E2E4EB] dark:border-[#2A305A]">
                <a
                  href={identity.resumeUrl}
                  download={identity.resumeFileName}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B1F3B] py-3 text-center text-sm font-semibold text-white shadow-lg hover:bg-[#4A3E8C] dark:bg-[#7C5DFA] dark:hover:bg-[#9277FF]"
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
