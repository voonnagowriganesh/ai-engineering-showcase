import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navItems, identity } from '../data/content';
import { useActiveSection } from '../hooks/useActiveSection';

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
    return () => document.body.classList.remove('modal-open');
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
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
          <span className="hidden font-display text-sm font-medium text-ink sm:block">
            {identity.name.split(' ').slice(-1)}
          </span>
        </div>

        <nav
          className={`hidden items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-xl transition-all duration-300 lg:flex ${
            scrolled ? 'border-ink/10 bg-paper/90 shadow-soft' : 'border-ink/10 bg-paper/60'
          }`}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${identity.email}`}
            className="hidden rounded-full border border-ink/15 bg-paper/80 px-4 py-2 text-sm font-semibold text-ink shadow-soft backdrop-blur-xl transition hover:border-signal hover:text-signal sm:block"
          >
            Let&rsquo;s talk
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-paper/90 text-ink shadow-soft backdrop-blur-xl lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="mx-5 mt-3 overflow-hidden rounded-3xl border border-ink/10 bg-paper/95 p-3 shadow-card backdrop-blur-xl lg:hidden"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`block w-full rounded-2xl px-4 py-3 text-left text-base font-medium ${
                  active === item.id ? 'bg-ink text-paper' : 'text-ink-soft'
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
