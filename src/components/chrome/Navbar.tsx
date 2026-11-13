import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Command, Download, Menu, X } from 'lucide-react';
import { identity, navSections, socials } from '@/data/profile';
import { useActiveSection, useScrollState, useScrollTo } from '@/hooks/useScroll';
import { useEscapeKey } from '@/hooks/useInteractions';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/primitives';
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

  const condensed = offset > 40;

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  useEscapeKey(mobileOpen, closeMobile);

  // Close the sheet if the viewport grows past the breakpoint while it is open.
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
      scrollTo(sectionId, -16);
    },
    [closeMobile, scrollTo],
  );

  return (
    <>
      {/* Skip link — first tab stop, invisible until focused. */}
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[120] focus:rounded-full focus:bg-accent-2 focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <motion.header
        className="fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-4 sm:px-6"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          aria-label="Primary"
          className={cn(
            'flex w-full max-w-[82rem] items-center gap-3 rounded-full px-3 py-2.5',
            'transition-[background-color,border-color,box-shadow,padding] duration-500',
            '[transition-timing-function:var(--ease-out-expo)]',
            condensed
              ? 'glass shadow-[0_12px_40px_-18px_rgb(0_0_0/0.4)]'
              : 'border border-transparent bg-transparent',
          )}
        >
          {/* Monogram */}
          <button
            type="button"
            onClick={() => handleNavigate('hero')}
            aria-label={`${identity.fullName} — back to top`}
            className="group flex shrink-0 items-center gap-2.5 rounded-full pr-2 pl-1"
          >
            <span className="ring-gradient grid size-9 place-items-center rounded-xl border border-line bg-surface-2 transition-transform duration-500 group-hover:scale-105">
              <span className="font-display text-sm font-bold text-gradient-static">
                {identity.initials}
              </span>
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-[0.8125rem] font-semibold text-ink">
                {identity.shortName}
              </span>
              <span className="block font-mono text-[0.625rem] tracking-wider text-ink-subtle uppercase">
                {identity.role}
              </span>
            </span>
          </button>

          {/* Desktop links */}
          <ul className="mx-auto hidden items-center gap-0.5 lg:flex">
            {navSections.slice(1).map((section) => {
              const isActive = activeSection === section.id;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(section.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative rounded-full px-4 py-2 text-[0.8125rem] font-medium transition-colors duration-300',
                      isActive ? 'text-ink' : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {/* Shared layoutId makes the pill glide between items. */}
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full border border-accent-2/35 bg-[linear-gradient(110deg,color-mix(in_oklab,var(--color-accent)_20%,transparent),color-mix(in_oklab,var(--color-accent-3)_20%,transparent))]"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <span className="relative z-10">{section.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Open command palette"
              className="hidden items-center gap-2 rounded-full border border-line bg-surface-2 py-2 pr-2 pl-3.5 text-ink-subtle transition-colors duration-300 hover:border-line-strong hover:text-ink md:flex"
            >
              <span className="text-[0.8125rem]">Search</span>
              <kbd className="flex items-center gap-0.5 rounded-md border border-line bg-canvas px-1.5 py-0.5 font-mono text-[0.625rem] text-ink-subtle">
                <Command size={10} />K
              </kbd>
            </button>

            <ThemeToggle />

            <a
              href={identity.resumeUrl}
              download={identity.resumeFileName}
              className="hidden h-10 items-center gap-2 rounded-full bg-[linear-gradient(110deg,var(--color-accent),var(--color-accent-2))] px-5 text-[0.8125rem] font-medium text-white shadow-[0_8px_24px_-10px_var(--color-accent-2)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-10px_var(--color-accent-2)] sm:flex"
            >
              <Download size={15} />
              Resume
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="grid size-10 place-items-center rounded-full border border-line bg-surface-2 text-ink transition-colors duration-300 hover:border-line-strong lg:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            key="mobile-nav"
            className="fixed inset-0 z-[99] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMobile}
              className="absolute inset-0 bg-canvas/80 backdrop-blur-xl"
            />

            <motion.div
              className="absolute inset-x-4 top-24 overflow-hidden rounded-3xl border border-line bg-surface p-3 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)]"
              initial={{ y: -16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <ul className="flex flex-col">
                {navSections.slice(1).map((section, index) => (
                  <motion.li
                    key={section.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.04, duration: 0.35 }}
                  >
                    <button
                      type="button"
                      onClick={() => handleNavigate(section.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors duration-200',
                        activeSection === section.id
                          ? 'bg-surface-2 text-ink'
                          : 'text-ink-muted hover:bg-surface-2 hover:text-ink',
                      )}
                    >
                      <span className="font-mono text-2xs text-accent-2">{section.index}</span>
                      <Icon icon={section.icon} size={17} />
                      <span className="text-[0.9375rem] font-medium">{section.label}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
                <ThemeToggle withLabel />
                <a
                  href={identity.resumeUrl}
                  download={identity.resumeFileName}
                  onClick={closeMobile}
                  className="flex h-11 items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,var(--color-accent),var(--color-accent-2))] text-sm font-medium text-white"
                >
                  <Download size={16} />
                  Download résumé
                </a>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {socials.map((social) => (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="grid size-10 place-items-center rounded-full border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
                    >
                      <Icon icon={social.icon} size={17} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
