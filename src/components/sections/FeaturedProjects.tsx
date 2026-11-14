import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckCircle2, ExternalLink, X } from 'lucide-react';
import { projects } from '@/data/profile';
import { useScrollLock } from '@/hooks/useScroll';
import { useReducedMotion } from '@/hooks/useInteractions';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/primitives';
import type { Project } from '@/domain/models';

/** Pixels of extra sticky offset per card, so each one settles lower than
 * the last and you can see a real strip of earlier cards peeking out above
 * it once it's covered.
 *
 * Verified empirically by testing a short, deliberately simple isolated
 * page with only this mechanic on it (no real app around it) before
 * touching this component again: the thing that actually makes several
 * cards pile up simultaneously is each card being SHORT relative to the
 * viewport (so many sticky windows are active at once), not a bigger
 * offset number. A ~520px-tall "full scene" card -- which an earlier pass
 * here used, reasoning that a stacking card should feel substantial --
 * leaves room for at most one other card to coexist in the viewport at
 * all, and only briefly; the pile-of-3-or-4 look needs compact cards. */
const STACK_OFFSET_PX = 18;

export function FeaturedProjects(): React.JSX.Element {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const reduceMotion = useReducedMotion();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Plain `overflow: hidden` on body isn't enough — this site drives scroll
  // through Lenis (see ScrollService), which scrolls the page via its own
  // rAF loop regardless of CSS overflow. useScrollLock calls into the same
  // service the command palette already uses, so Lenis itself is paused
  // while the modal is open, not just the body's native overflow.
  useScrollLock(selectedProject !== null);

  // Depth-of-field: once a card is mostly covered by the next one sliding
  // up over it, blur and dim it slightly, like the page is racking focus
  // onto whichever project is currently on top. Pure scroll position read
  // (never writes scroll, never calls preventDefault), so there's nothing
  // here for Lenis to fight over — same reasoning as the rest of this
  // session's Lenis-safety notes. Styles are set directly on the DOM node
  // instead of through React state so this doesn't trigger a re-render on
  // every scroll frame.
  useEffect(() => {
    if (reduceMotion) return undefined;

    let ticking = false;
    const update = (): void => {
      const vh = window.innerHeight;
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const next = cardRefs.current[index + 1];
        const nextTop = next?.getBoundingClientRect().top ?? Infinity;
        const covered = Math.max(0, vh * 0.42 - nextTop);
        const isPast = card.getBoundingClientRect().top < vh * 0.3 && covered > 10;
        const depth = Math.min(1, covered / 160);
        card.style.filter = isPast ? `blur(${(depth * 3).toFixed(1)}px)` : '';
        card.style.opacity = isPast ? `${(1 - depth * 0.45).toFixed(2)}` : '1';
      });
      ticking = false;
    };
    const onScroll = (): void => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduceMotion]);

  const getTagStyle = (category: string) => {
    switch (category) {
      case 'AI Product':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-500/30';
      case 'AI Engineering':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border-sky-500/30';
      case 'Agentic AI':
      case 'Automation':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-500/30';
      case 'Full-Stack':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-500/30';
      case 'AI / RAG':
      case 'ML / Data':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-500/30';
      case 'Computer Vision':
        return 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950/70 dark:text-fuchsia-300 border-fuchsia-500/30';
      default:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-[#f7f6f0] py-20 text-[#071910] transition-colors dark:bg-[#06180f] dark:text-white"
    >
      <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Reveal direction="down" distance={10}>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>FEATURED PROJECTS</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.1}>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#0a1e12] dark:text-white sm:text-3xl lg:text-4xl">
                Real-World Projects & Products
              </h2>
            </Reveal>
          </div>

          <Reveal direction="left" delay={0.15}>
            <a
              href="https://github.com/voonnagowriganesh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 transition-colors hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <span>View All Projects</span>
              <ArrowRight size={14} />
            </a>
          </Reveal>
        </div>

        {/* Cards that stack as you scroll: each one sticks in place while
            the next slides up and settles just below it, so you see a deck
            build up rather than one card replacing the last. Read-only
            scroll position drives the depth-blur effect above; the sticky
            behaviour itself is plain CSS, independent of Lenis entirely.

            Two real bugs lived here before this version, both only caught
            by live-testing actual scroll behaviour rather than trusting
            the layout math:
            1) An early version wrapped each card in its own separate tall
               "track" div. That can't ever work — a sticky element is
               bound to its own containing block, and SEQUENTIAL
               (non-overlapping) containing blocks can only ever produce
               SEQUENTIAL (non-overlapping) sticky windows, however tall
               each track is tuned to be.
            2) The next version removed the track but made the card itself
               tall (~520px, "a full scene") on the theory that a stacking
               card should feel substantial. That's backwards: a card that
               tall leaves room for at most one other card to coexist in
               the viewport, and only for a sliver of scroll distance —
               nowhere near the "several cards visibly piled up" look this
               was supposed to produce. Confirmed by isolating the exact
               mechanic from this session's own approved demo artifact in
               a bare test page and measuring which cards were in viewport
               bounds across a scroll sweep: with SHORT cards (~220px)
               relative to the viewport, 3-4 stay stuck simultaneously;
               with ~520px cards, at most 1-2 ever do. Compact cards are
               what makes the pile-up real, not a bigger offset number. */}
        <div className="relative mt-16 flex flex-col gap-5">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="sticky"
              style={{ top: `calc(6rem + ${index * STACK_OFFSET_PX}px)` }}
            >
              <Reveal direction="up" delay={0.06 * index}>
                {/* A real <button>, not a plain div with onClick: the custom
                    cursor's hover-grow state and keyboard activation both key
                    off interactive elements, and a div matched neither. */}
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="group flex w-full flex-col gap-4 overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-5 text-left shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 dark:border-emerald-500/20 dark:bg-[#0b2115] sm:flex-row sm:items-center sm:gap-7 sm:p-6"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-stone-400 dark:text-emerald-500/60">
                        0{index + 1}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-bold ${getTagStyle(
                          project.category,
                        )}`}
                      >
                        {project.category}
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-lg font-bold leading-snug text-[#0a1e12] group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-300 sm:text-xl">
                      {project.title}
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600 dark:text-emerald-100/70">
                      {project.subtitle}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      <span>View details</span>
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>

                  {/* Real artwork where supplied; otherwise a generative
                      panel derived from the project's own palette, so no
                      card depends on a generated image that might bake in
                      text of its own. */}
                  <div
                    className="relative h-32 w-full shrink-0 overflow-hidden rounded-2xl border border-stone-200/80 dark:border-emerald-500/30 sm:h-full sm:w-52"
                    style={
                      project.image
                        ? undefined
                        : { background: `linear-gradient(135deg, ${project.palette[0]}, ${project.palette[1]})` }
                    }
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <span className="grid size-12 place-items-center rounded-2xl border border-white/25 bg-white/15 text-white backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">
                        <Icon icon={project.icon} size={22} />
                      </span>
                    )}
                    <span className="absolute top-3 right-3 rounded-full border border-white/25 bg-black/25 px-2 py-0.5 font-mono text-[0.625rem] text-white backdrop-blur-md">
                      {project.year}
                    </span>
                  </div>
                </button>
              </Reveal>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProject ? (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              // Lenis's own wheel handler calls preventDefault() on every
              // scroll while stopped unless the target carries this
              // attribute — without it, locking the page for the modal
              // also silently blocks the modal's own overflow-y-auto.
              data-lenis-prevent
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-emerald-500/30 bg-[#071910] p-6 text-white shadow-2xl sm:p-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${getTagStyle(
                    selectedProject.category,
                  )}`}
                >
                  {selectedProject.category}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="rounded-full p-2 text-slate-400 hover:bg-emerald-900/40 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {selectedProject.image ? (
                <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-500/20">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="h-auto w-full object-cover"
                  />
                </div>
              ) : null}

              <div className="mt-5">
                <h3 className="font-display text-2xl font-bold text-white">
                  {selectedProject.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {selectedProject.summary}
                </p>

                {/* Links */}
                {selectedProject.links?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {selectedProject.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 transition-colors hover:border-emerald-400 hover:bg-emerald-500/15 hover:text-white"
                      >
                        <span>{link.label}</span>
                        <ExternalLink size={12} />
                      </a>
                    ))}
                  </div>
                ) : null}

                {/* Metrics */}
                {selectedProject.metrics?.length ? (
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {selectedProject.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-2xl border border-emerald-500/20 bg-emerald-950/40 p-3 text-center"
                      >
                        <span className="font-display block text-xl font-bold text-emerald-400">
                          {m.value}
                        </span>
                        <span className="mt-1 block text-[0.6875rem] text-slate-400">{m.label}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Highlights */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                    Key Highlights
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {selectedProject.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <CheckCircle2 size={15} className="mt-0.5 text-emerald-400 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stack */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                    Technologies
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedProject.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-emerald-500/20 bg-emerald-950/60 px-2.5 py-1 text-xs font-medium text-emerald-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
