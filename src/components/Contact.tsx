import { ArrowUpRight, Mail } from 'lucide-react';
import { FaGithub, FaLinkedinIn, FaMedium } from 'react-icons/fa6';
import { identity } from '../data/content';
import { Reveal } from './Reveal';
import { BackgroundArt } from './BackgroundArt';

const links = [
  { label: 'GitHub', href: identity.github, icon: FaGithub },
  { label: 'LinkedIn', href: identity.linkedin, icon: FaLinkedinIn },
  { label: 'Medium', href: identity.medium, icon: FaMedium },
  { label: 'Email', href: `mailto:${identity.email}`, icon: Mail },
];

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ink py-28 text-paper">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-signal/30 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-amber/20 blur-[120px]" />
      </div>
      <BackgroundArt variant="dot-grid" />

      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <Reveal className="mx-auto">
          <span className="label-mono text-xs text-amber">08 / Contact</span>
          <h2 className="mt-5 font-display text-4xl font-medium leading-tight text-paper sm:text-5xl lg:text-6xl">
            Let&rsquo;s build something intelligent together.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-paper/70 sm:text-lg">
            Open to AI product, backend and full-stack engineering conversations — based in {identity.location}.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:${identity.email}`}
            className="group inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5"
          >
            {identity.email}
            <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>

        <Reveal delay={0.2} className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-5 py-2.5 text-sm font-medium text-paper/85 transition hover:border-paper/40 hover:bg-paper/10 hover:text-paper"
            >
              <link.icon size={15} />
              {link.label}
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
