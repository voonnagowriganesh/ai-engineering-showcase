import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Mail, Menu, X } from 'lucide-react';
import { navItems, identity } from '../data/content';
import { useActiveSection } from '../hooks/useActiveSection';
import { track } from '../lib/analytics';

const sectionIds = navItems.map((n) => n.id);

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('modal-open', open);
    if (!open) return () => document.body.classList.remove('modal-open');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    // Wait for the menu's scroll lock to lift, or the scroll is swallowed.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })),
    );
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5">
        <div
          className={`flex items-center gap-3 rounded-full border px-3 py-2 backdrop-blur-xl transition-all duration-300 ${
            scrolled ? 'border-ink/10 bg-paper/90 shadow-soft' : 'border-transparent bg-transparent'
          }`}
        >
          <button
            onClick={() => go('hero')}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-signal to-amber font-display text-sm font-semibold text-paper"
            aria-label="Go to top"
          >
            {identity.initials}
          </button>
          {/* Hidden at lg, where the full nav pill needs the room. */}
          <span className="hidden whitespace-nowrap font-display text-sm font-medium text-ink sm:block lg:hidden xl:block">
            {identity.name.split(' ').slice(-1)}
          </span>
        </div>

        <nav
          className={`hidden items-center gap-0.5 rounded-full border px-1.5 py-1.5 backdrop-blur-xl transition-all duration-300 lg:flex ${
            scrolled ? 'border-ink/10 bg-paper/90 shadow-soft' : 'border-ink/10 bg-paper/60'
          }`}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              aria-current={active === item.id ? 'true' : undefined}
              className={`relative whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition-colors xl:px-3.5 ${
                active === item.id ? 'text-paper' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {active === item.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {/* Icon-only between lg and xl, where the full nav pill leaves no room for the label. */}
          <a
            href={identity.resumeUrl}
            download={identity.resumeFileName}
            onClick={() => track('resume-download', { from: 'navbar' })}
            aria-label="Download resume"
            title="Download resume"
            className="hidden h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-ink px-4 text-sm font-semibold text-paper shadow-soft ring-1 ring-inset ring-white/15 transition hover:-translate-y-0.5 sm:inline-flex lg:w-10 lg:justify-center lg:px-0 xl:w-auto xl:px-4"
          >
            <Download size={15} className="shrink-0" />
            <span className="lg:hidden xl:inline">Resume</span>
          </a>
          <a
            href={`mailto:${identity.email}`}
            onClick={() => track('email-click', { from: 'navbar' })}
            className="hidden h-10 shrink-0 items-center whitespace-nowrap rounded-full border border-ink/15 bg-paper/80 px-4 text-sm font-semibold text-ink shadow-soft backdrop-blur-xl transition hover:border-signal hover:text-signal sm:inline-flex"
          >
            Let&rsquo;s talk
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-paper/90 text-ink shadow-soft backdrop-blur-xl lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          // Dims the page and closes the menu on an outside tap. -z-10 keeps it
          // inside the header's stacking context: above the page, below the menu.
          <motion.div
            key="backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 -z-10 bg-ink/25 backdrop-blur-[2px] lg:hidden"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="mx-5 mt-3 max-h-[calc(100svh-6rem)] overflow-y-auto overscroll-contain rounded-3xl border border-ink/10 bg-paper/95 p-3 shadow-card backdrop-blur-xl lg:hidden"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                aria-current={active === item.id ? 'true' : undefined}
                className={`block w-full rounded-2xl px-4 py-3 text-left text-base font-medium ${
                  active === item.id ? 'bg-ink text-paper' : 'text-ink-soft'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-ink/10 pt-3">
              <a
                href={identity.resumeUrl}
                download={identity.resumeFileName}
                onClick={() => {
                  track('resume-download', { from: 'menu' });
                  setOpen(false);
                }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-paper"
              >
                <Download size={15} /> Resume
              </a>
              <a
                href={`mailto:${identity.email}`}
                onClick={() => {
                  track('email-click', { from: 'menu' });
                  setOpen(false);
                }}
                className="flex items-center justify-center gap-2 rounded-2xl border border-ink/15 px-4 py-3 text-sm font-semibold text-ink"
              >
                <Mail size={15} /> Email me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
