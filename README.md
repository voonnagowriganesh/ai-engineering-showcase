# Voonna Gowri Ganesh — Portfolio

A standalone, light-themed personal portfolio for Voonna Gowri Ganesh (AI Developer),
built from scratch with React 19, TypeScript, Vite and Tailwind CSS.

## Sections

Hero, About, Experience, Projects, Expertise, Toolkit, Education, Certifications, Contact.

## Notable implementation details

- **Light theme only** — a warm "paper" palette (indigo/violet + amber accents, serif
  display type) distinct from any other portfolio.
- **No scroll-hijacking library.** Scrolling is entirely native; scroll-triggered reveals
  use `framer-motion`'s `whileInView` (IntersectionObserver under the hood). This avoids
  the whole class of bug where a library like Lenis calls `preventDefault()` on wheel
  events and blocks a modal's own internal scroll.
- **Project detail modal** locks background scroll via a single `body.modal-open` class
  and lets the modal's own panel own `overflow-y-auto` — there is no competing scroll
  interceptor to exclude it from.
- **Pseudo-3D effects** are CSS-only: pointer-driven tilt cards (`useTilt` hook) in the
  hero, experience and project cards, plus an animated CGPA progress ring in Education.
- **Experience "photo" treatment**: since no real headshot is used, each role gets a
  generative, anime/low-poly-inspired portrait medallion (`AvatarGlyph`), built from
  layered SVG gradients and circuit-line accents rather than a placeholder image.
- All project illustrations (`ProjectVisual`) and backgrounds (`BackgroundArt`) are
  code-generated SVG — no external image assets.

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # type-check (tsc -b) and produce a production build
npm run preview  # preview the production build locally
```

## Content

All resume facts (employers, dates, education, certifications, project links) live in
`src/data/content.ts` and `src/data/toolkit.ts` and are sourced from verified résumé data.
