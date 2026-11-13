import { ArrowUpRight, Download } from 'lucide-react';
import { identity, navSections, socials } from '@/data/profile';
import { useScrollTo } from '@/hooks/useScroll';
import { Reveal } from '@/components/ui/Reveal';
import { Eyebrow, GradientRule, Icon } from '@/components/ui/primitives';

export function Footer(): React.JSX.Element {
  const scrollTo = useScrollTo();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line pt-20 pb-10">
      <div className="relative mx-auto w-full max-w-[82rem] px-5 sm:px-8">
        {/* ── Call to action ──────────────────────────────────────────────── */}
        <Reveal direction="up">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>Open to work</Eyebrow>
              <p className="text-display mt-3 max-w-2xl font-bold text-ink">
                Have something worth
                <span className="text-gradient"> building</span>?
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollTo('contact', -16)}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-[linear-gradient(110deg,var(--color-accent),var(--color-accent-2))] px-6 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5"
              >
                Start a conversation
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>

              <a
                href={identity.resumeUrl}
                download={identity.resumeFileName}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-medium text-ink transition-[transform,border-color,color] duration-300 hover:-translate-y-0.5 hover:border-accent-2 hover:text-accent-2"
              >
                <Download size={16} />
                Résumé
              </a>
            </div>
          </div>
        </Reveal>

        <GradientRule className="my-14" />

        {/* ── Columns ─────────────────────────────────────────────────────── */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="ring-gradient grid size-10 place-items-center rounded-xl border border-line bg-surface-2" data-active="true">
                <span className="font-display text-sm font-bold text-gradient-static">
                  {identity.initials}
                </span>
              </span>
              <div>
                <span className="block text-[0.9375rem] font-semibold text-ink">
                  {identity.fullName}
                </span>
                <span className="block font-mono text-2xs tracking-wider text-ink-subtle uppercase">
                  {identity.role}
                </span>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-[0.875rem] leading-relaxed text-ink-muted">
              {identity.tagline}
            </p>

            <div className="mt-6 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid size-10 place-items-center rounded-full border border-line text-ink-muted transition-[color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent-2 hover:text-accent-2"
                >
                  <Icon icon={social.icon} size={16} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer">
            <Eyebrow>Sections</Eyebrow>
            <ul className="mt-4 flex flex-col gap-2.5">
              {navSections.slice(1).map((section) => (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(section.id, -16)}
                    className="group flex items-center gap-2 text-[0.875rem] text-ink-muted transition-colors duration-300 hover:text-ink"
                  >
                    <span className="font-mono text-2xs text-ink-subtle transition-colors group-hover:text-accent-2">
                      {section.index}
                    </span>
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <Eyebrow>Get in touch</Eyebrow>
            <ul className="mt-4 flex flex-col gap-2.5 text-[0.875rem]">
              <li>
                <a
                  href={`mailto:${identity.email}`}
                  className="break-all text-ink-muted transition-colors duration-300 hover:text-ink"
                >
                  {identity.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${identity.phone.replace(/\s/g, '')}`}
                  className="text-ink-muted transition-colors duration-300 hover:text-ink"
                >
                  {identity.phone}
                </a>
              </li>
              <li className="text-ink-subtle">{identity.location}</li>
            </ul>
          </div>
        </div>

        {/* ── Oversized wordmark ──────────────────────────────────────────── */}
        <div aria-hidden="true" className="mt-16 overflow-hidden">
          <span className="font-display block text-center text-[clamp(1.1rem,6.6vw,5.25rem)] leading-[0.85] font-bold tracking-[-0.045em] whitespace-nowrap text-stroke select-none">
            {identity.fullName.toUpperCase()}
          </span>
        </div>

        {/* ── Legal ───────────────────────────────────────────────────────── */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-8 sm:flex-row">
          <p className="font-mono text-2xs text-ink-subtle">
            © {year} {identity.fullName}. All rights reserved.
          </p>
          <p className="font-mono text-2xs text-ink-subtle">
            Built with React, TypeScript, Tailwind &amp; WebGL
          </p>
        </div>
      </div>
    </footer>
  );
}
