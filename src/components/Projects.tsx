import { useEffect, useRef, useState } from 'react';
import { projects } from '../data/content';
import { SectionHeading } from './SectionHeading';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { Reveal } from './Reveal';
import type { Project } from '../types';

/** Pixels of extra sticky offset per card, so each one settles a little
 * lower than the last and you can see the edge of earlier cards peeking
 * out above it once it's covered — the "deck building up" look. */
const STACK_OFFSET_PX = 18;

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Depth-of-field: once a card is mostly covered by the next one sliding
  // up over it, blur and dim it slightly, like the page is racking focus
  // onto whichever project is currently on top. This site has no scroll
  // library (native scroll only), so there's nothing to coordinate with —
  // it's a plain scroll-position read, styles applied directly to the DOM
  // node rather than through state so it doesn't trigger a re-render on
  // every scroll frame.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    let ticking = false;
    const update = () => {
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
    const onScroll = () => {
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
  }, []);

  return (
    <section id="projects" className="relative bg-paper-deep py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          index="03"
          eyebrow="Projects"
          title="Seven builds, one habit: ship it end to end."
          description="From a sub-2-second voice agent to authentication proofs-of-concept — each one built, deployed and documented."
        />

        {/* Cards that stack as you scroll: each one sticks in place while
            the next slides up and settles just below it, so you see a deck
            build up rather than one card replacing the last.

            This originally used a separate tall "track" div per card to
            give it scroll runway, reasoning a sticky element needs extra
            room behind it. That can't work: a sticky element is bound to
            its own containing block, and SEQUENTIAL (non-overlapping)
            containing blocks only ever produce SEQUENTIAL sticky windows —
            card N released before card N+1's track even began, so in real
            use (confirmed against the sibling AI Engineering Showcase
            project, which had the identical bug) it just looked like a
            plain list with gaps, not a stack.

            The actual mechanism, confirmed by isolating it in a bare test
            page and measuring which cards sit in the viewport across a
            scroll sweep: make the CARD ITSELF short relative to the
            viewport (compact, list-row height, not a tall "scene"), with
            a small gap between cards. Compact cards is what lets several
            sticky windows be active at once — a card that's tall relative
            to the viewport leaves room for at most one other to coexist,
            and only briefly. */}
        <div className="relative mt-16 flex flex-col gap-5">
          {projects.map((project, i) => (
            <div
              key={project.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="sticky"
              style={{ top: `calc(6rem + ${i * STACK_OFFSET_PX}px)` }}
            >
              <Reveal delay={(i % 4) * 0.06}>
                <ProjectCard project={project} index={i} onOpen={() => setActive(project)} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
