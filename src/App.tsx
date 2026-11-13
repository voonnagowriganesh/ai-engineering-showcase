import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Preloader } from '@/components/Preloader';
import { CustomCursor } from '@/components/chrome/CustomCursor';
import { Navbar } from '@/components/chrome/Navbar';
import {
  BackToTop,
  ScrollProgressBar,
  SectionRail,
} from '@/components/chrome/ScrollProgress';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Credentials } from '@/components/sections/Credentials';
import { Experience } from '@/components/sections/Experience';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { Projects } from '@/components/sections/Projects';
import { Services } from '@/components/sections/Services';
import { Skills } from '@/components/sections/Skills';
import { AmbientBackdrop } from '@/components/ui/primitives';
import { usePageLoad } from '@/hooks/usePageLoad';
import { useScrollLock, useSmoothScrollRoot } from '@/hooks/useScroll';
import { useTheme } from '@/hooks/useTheme';

// cmdk and its focus-management dependencies are ~74KB gzipped and are only
// needed once the palette is actually opened.
const CommandPalette = lazy(() =>
  import('@/components/chrome/CommandPalette').then((module) => ({
    default: module.CommandPalette,
  })),
);

export function App(): React.JSX.Element {
  // Mounts the ThemeService for the document. Its return value is unused here —
  // sub-components read the same service through their own useTheme() call.
  useTheme();
  useSmoothScrollRoot();

  const { progress, complete } = usePageLoad();
  const [paletteOpen, setPaletteOpen] = useState(false);
  // Latches on first open; unmounting the palette would discard cmdk's state.
  const [paletteMounted, setPaletteMounted] = useState(false);

  const openPalette = useCallback((): void => {
    setPaletteMounted(true);
    setPaletteOpen(true);
  }, []);

  // Hand off from the zero-JS boot screen in index.html. By the time this runs
  // React's own preloader has painted over it, so fading the static one out
  // reads as a single continuous sequence rather than two screens.
  useEffect(() => {
    const boot = document.getElementById('boot');
    if (!boot) return undefined;

    boot.style.opacity = '0';
    const timer = window.setTimeout(() => boot.remove(), 420);
    return () => window.clearTimeout(timer);
  }, []);

  // ⌘K / Ctrl-K lives here rather than inside the lazy palette, which does not
  // exist until the first open and so could never catch the opening keystroke.
  useEffect(() => {
    const handler = (event: KeyboardEvent): void => {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setPaletteMounted(true);
      setPaletteOpen((current) => !current);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Hold the page still until the preloader has finished its exit.
  useScrollLock(!complete);

  return (
    <>
      <Preloader progress={progress} complete={complete} />

      {/* Decorative layers are isolated: if WebGL or the canvas engine throws on
          an unusual device, the content below still renders normally. */}
      <ErrorBoundary label="AmbientBackdrop">
        <AmbientBackdrop />
      </ErrorBoundary>

      <ErrorBoundary label="CustomCursor">
        <CustomCursor />
      </ErrorBoundary>

      <ScrollProgressBar />
      <Navbar onOpenCommandPalette={openPalette} />
      <SectionRail />

      <main id="main">
        <ErrorBoundary label="Hero">
          <Hero />
        </ErrorBoundary>

        <About />
        <Experience />
        <Skills />
        <Projects />
        <Credentials />
        <Services />
        <Contact />
      </main>

      <Footer />

      <BackToTop />

      <ErrorBoundary label="CommandPalette">
        <Suspense fallback={null}>
          {/* Mounted only after the first open so the chunk is never fetched
              for visitors who do not use the palette. */}
          {paletteMounted ? (
            <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
          ) : null}
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
