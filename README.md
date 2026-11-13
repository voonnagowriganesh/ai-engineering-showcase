# Voonna Gowri Ganesh — Portfolio

Personal portfolio for **Voonna Gowri Ganesh**, AI Developer & Full-Stack Product Engineer.

A single-page React application with a WebGL hero, a cursor-reactive neural field, a
fully-designed light **and** dark theme, and a ⌘K command palette.

**Live:** _deploy to Vercel, then add the URL here._

---

## Stack

| Layer      | Choice                                                   |
| ---------- | -------------------------------------------------------- |
| Framework  | React 19 + TypeScript 7 (strict)                          |
| Build      | Vite 8 (Rolldown)                                         |
| Styling    | Tailwind CSS v4 — CSS-first `@theme` tokens               |
| Motion     | Motion (Framer) + Lenis smooth scroll                     |
| 3D         | three.js + React Three Fiber, custom GLSL                 |
| Icons      | lucide-react (UI) + react-icons/si (brand marks)          |
| Palette    | cmdk                                                      |
| Hosting    | Vercel                                                    |

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script              | Purpose                                 |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Dev server with HMR                     |
| `npm run build`     | Typecheck, then production build to `dist/` |
| `npm run preview`   | Serve the production build locally      |
| `npm run typecheck` | Types only, no emit                     |

---

## Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable              | Purpose                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------ |
| `VITE_WEB3FORMS_KEY`  | Free access key from [web3forms.com](https://web3forms.com) — makes the contact form deliver real email. |
| `VITE_SITE_URL`       | Canonical site URL used in meta tags.                                                       |

Without a Web3Forms key the contact form **still works**: it falls back to opening the
visitor's own mail client (`MailtoGateway`), so it is never a dead end.

---

## Architecture

```
src/
  domain/       Interfaces — the contract between content and presentation
  data/         All site content, typed against domain/models.ts
  services/     ThemeService, ScrollService, ContactService, container (DI root)
  engine/       Canvas animation: CanvasRenderer (abstract), NeuralField, Vector2
  hooks/        React bridges over the services
  components/
    canvas/     WebGL aurora (GLSL) + neural field wrapper
    chrome/     Navbar, command palette, cursor, scroll progress
    sections/   Hero, About, Experience, Skills, Projects, Credentials, Services, Contact, Footer
    ui/         Reusable primitives (Button, Section, Reveal, SplitText, Marquee…)
```

A few decisions worth knowing about:

- **Content is data, not markup.** Every string lives in `src/data/profile.ts`, typed
  against `src/domain/models.ts`. Editing the site means editing one file.
- **One source of truth for colour.** `@theme` maps Tailwind utilities onto runtime CSS
  variables, so flipping the theme re-colours every utility without duplicating a class.
  The WebGL shader reads the same variables for its uniforms.
- **Per-section colour tones.** A `tone` prop on `<Section>` re-points the accent
  variables for that subtree, giving each section its own hue. Components never need to
  know which section they are in.
- **Services over hooks for shared state.** `ThemeService` and `ScrollService` are plain
  classes exposing an `Observable`; `useSyncExternalStore` bridges them into React. Non-React
  code (the render loop) reads the same instance.
- **One render loop.** `CanvasRenderer` is an abstract base handling DPR-correct sizing,
  delta-time clamping, and automatic pause when off-screen or backgrounded. `NeuralField`
  only implements `onResize` / `onFrame`.
- **Transport is swappable.** The contact form depends on the `ContactGateway` interface;
  `src/services/container.ts` is the only file that picks an implementation.

---

## Performance

- Initial JS ≈ **204 KB gzipped**; three.js (~240 KB) and cmdk (~18 KB) load lazily.
- A zero-JS boot screen is inlined in `index.html` so something paints on the first byte,
  rather than a blank page while the bundle downloads.
- The neural field pauses entirely when scrolled out of view or the tab is hidden.
- Every animation has a `prefers-reduced-motion` path; content is never left invisible.

---

## Accessibility

- Light and dark palettes both hold WCAG AA contrast for body text.
- Skip link, focus-visible rings, `aria-*` on every interactive control.
- Split-text animations expose the full string via `aria-label` and hide the per-character
  spans, so screen readers do not read letter-by-letter.
- Full keyboard navigation, including the ⌘K palette.

---

## Deploying to Vercel

1. Import the repository at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Vite** (auto-detected; `vercel.json` is already committed).
3. Add `VITE_WEB3FORMS_KEY` under **Settings → Environment Variables**.
4. Deploy.

---

## Replacing the placeholders

Two assets are intentionally placeholders:

| What        | Where                                   | How to replace                                                                 |
| ----------- | --------------------------------------- | ------------------------------------------------------------------------------ |
| **Portrait** | `public/images/profile-placeholder.svg` | Add your photo to `public/images/`, then point `identity.avatarUrl` in `src/data/profile.ts` at it. A 4:5 portrait works best. |
| **Résumé**   | `public/resume/Voonna_Gowri_Ganesh_Resume.pdf` | Overwrite the file, keeping the same name — no code change needed. |

---

## Content accuracy

Site copy follows the rules in the source professional profile:

- No Techgene Solutions internal product, architecture or metric appears anywhere.
  Current-role content is limited to general, transferable engineering responsibilities.
- Every figure traces to the résumé; every credential links to its actual file or public
  verification page.
- Machine Learning depth is presented as academic/independent project experience rather
  than claimed expertise.
