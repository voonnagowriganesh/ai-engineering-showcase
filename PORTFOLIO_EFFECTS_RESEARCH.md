# Portfolio Interaction & Animation Upgrade — Research & Proposal

Status: **research only, nothing in either site has been touched.**
Covers both: `ai-engineering-showcase` (dark emerald, Lenis smooth-scroll) and
`voonna-portfolio-light` (warm paper light theme, native scroll).

## The actual problem

Both sites already have good color, typography and basic scroll-reveal
(fade/slide-in as a card enters the viewport). What's missing is *interaction*
on the things with multiple cards: Projects, Certifications, Skills/Toolkit.
Right now a visitor's only interaction with a card grid is "scroll past it" or
"click a card to open a disconnected modal." Certifications specifically uses
click-to-paginate (6 cards per page on desktop) — functional, but it reads as
a settings table, not a portfolio.

Premium portfolios differ in exactly this spot: the cards themselves are
something to *play with* — drag them, watch them rotate into focus, watch one
visually become the detail view instead of a modal just appearing.

## Techniques found, with what they actually are

| # | Technique | What it looks like | How it's really built |
|---|---|---|---|
| 1 | **Horizontal drag-scroll carousel** | Cards in one row, drag/swipe or scroll sideways, snaps to each card | CSS `scroll-snap-type` for the free version; `motion`'s own `drag="x"` (already in both stacks, zero new dependency) for a hand-built one; **Embla Carousel** (~7KB, headless — the engine behind shadcn/ui's carousel) or **Swiper.js** (~15KB, ships effects out of the box) if a packaged solution is preferred |
| 2 | **3D coverflow / "rotating" cards** | Centered card large and flat, side cards shrink and tilt away in 3D as you move through them — this is what "rotating 360°" usually means in the wild | Swiper ships this as `effect: 'coverflow'` directly; hand-built means mapping each card's distance-from-center to `rotateY`/`scale`/`translateZ` via `useTransform` |
| 3 | **Card → detail "morph" transition** | Click a card and it smoothly *becomes* the open detail panel — image and title visibly travel into place — instead of a modal popping up disconnected from what you clicked | `motion`'s `layoutId` (shared element transitions) — give the card and its expanded view the same `layoutId`, Motion animates the rect automatically; wrap in `AnimatePresence` so it morphs back on close |
| 4 | **Scroll-pinned horizontal reveal ("scrollytelling")** | Section locks in place while you scroll down, and that scroll instead drags a gallery sideways across the screen | **GSAP ScrollTrigger** `pin: true` + a scrubbed horizontal tween — the standard tool for this exact effect |
| 5 | **Tilt-on-hover / magnetic / cursor-spotlight** | Card tilts toward the cursor in 3D, or visually "pulls" toward it, or shows a soft light following the pointer | Exactly the recipe already built and shipped for the Hero portrait this session (`perspective` + pointer-driven `rotateX/rotateY`, or a `radial-gradient` following cursor position) — directly reusable on cards |
| 6 | **Staggered clip-path reveal** | Cards wipe into view (not fade/slide) on scroll, staggered one after another | Animated `clip-path` instead of `opacity`/`y`, same `Reveal`/stagger wrapper both sites already use |
| 7 | **Infinite marquee strip** | Logos/tech icons scrolling sideways forever, pausing on hover | CSS keyframe loop — `voonna-portfolio-light`'s Toolkit section already does this |

## Fit and risk for these two specific codebases

**Zero new dependency, low risk, reuses code already written this session:**
tilt-on-hover, magnetic hover, cursor-spotlight, clip-path reveal, and a
`motion`-native drag carousel (no library needed — `drag="x"` is already
available since `motion`/`framer-motion` is installed in both).

**New dependency, still low-to-medium risk, isolated to one component:**
Embla or Swiper for a carousel with built-in nav arrows/dots/coverflow. Embla
if the goal is a fully custom look; Swiper if the built-in effects (coverflow,
cube, cards) are wanted with less hand-written code.

**Card → detail morph via `layoutId`:** low risk, **highest payoff for the
effort** — this one change would make every "click a card, see a modal"
interaction across both sites feel dramatically more premium, and both sites
already have the exact list→modal structure this technique replaces in place.
One known rough edge: nested content inside the morphing element can appear to
freeze for a frame while React mounts the new tree — manageable, not a
blocker.

**GSAP ScrollTrigger pinned horizontal sections:** the flashiest effect, and
the **highest risk specifically for `ai-engineering-showcase`**. This site
already had one real, intermittent, production-crashing bug this session from
two systems (Rolldown's chunk splitting, Lenis's scroll hijacking) not being
aware of each other. GSAP ScrollTrigger *also* drives scroll directly, and
needs to be explicitly wired into Lenis's own render loop or the two fight
over scroll position — documented, solvable, but it's a second scroll-ownership
conflict in a codebase that already cost real debugging time to the first one.
`voonna-portfolio-light` has no Lenis, so this technique is meaningfully safer
there. **Recommendation: skip this for now, revisit only if the other six
techniques aren't enough.**

## What I'd actually propose per section

| Section | Current | Proposed |
|---|---|---|
| Projects (both sites) | Static grid → click → modal pops in | Keep the grid, add tilt-on-hover + a `layoutId` morph so the card becomes the detail panel |
| Certifications (`ai-engineering-showcase`, 11 cards, currently paginated) | Click Next/Prev through fixed pages | Replace pagination with a `drag="x"` horizontal carousel with scroll-snap — same cards, now explorable by drag/swipe instead of clicking a page number |
| Skills tile grid (`TechnicalArsenal.tsx`) | Static grid + "More/Less" toggle | Optional: a drag-scroll row per category instead of a grid, or leave as-is — this one is lower priority, the grid+filter pattern already works reasonably well |
| Toolkit (`voonna-portfolio-light`) | Already has a marquee + filterable grid | Lowest priority — already has motion, smallest gap between current and proposed |

## Next step

A live demo artifact (separate from this document) with the actual techniques
built and running on real project titles from both sites' data, in both color
themes — so you can click/drag/hover them yourself and say which ones feel
right, before anything touches the real code.
