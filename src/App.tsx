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
import { Hero } from '@/components/sections/Hero';
import { AboutAndExperience } from '@/components/sections/AboutAndExperience';
import { TechnicalArsenal } from '@/components/sections/TechnicalArsenal';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { CaseStudySection } from '@/components/sections/CaseStudySection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/sections/Footer';
import { AmbientBackdrop } from '@/components/ui/primitives';
import { usePageLoad } from '@/hooks/usePageLoad';
import { useScrollLock, useSmoothScrollRoot } from '@/hooks/useScroll';
import { useTheme } from '@/hooks/useTheme';

const CommandPalette = lazy(() =>
  import('@/components/chrome/CommandPalette').then((module) => ({
    default: module.CommandPalette,
  })),
);

export function App(): React.JSX.Element {
  useTheme();
  useSmoothScrollRoot();

  const { progress, complete } = usePageLoad();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteMounted, setPaletteMounted] = useState(false);

  const openPalette = useCallback((): void => {
    setPaletteMounted(true);
    setPaletteOpen(true);
  }, []);

  useEffect(() => {
    const boot = document.getElementById('boot');
    if (!boot) return undefined;

    boot.style.opacity = '0';
    const timer = window.setTimeout(() => boot.remove(), 420);
    return () => window.clearTimeout(timer);
  }, []);

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

  useScrollLock(!complete);

  return (
    <>
      <Preloader progress={progress} complete={complete} />

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

        <ErrorBoundary label="AboutAndExperience">
          <AboutAndExperience />
        </ErrorBoundary>

        <ErrorBoundary label="TechnicalArsenal">
          <TechnicalArsenal />
        </ErrorBoundary>

        <ErrorBoundary label="FeaturedProjects">
          <FeaturedProjects />
        </ErrorBoundary>

        <ErrorBoundary label="CaseStudySection">
          <CaseStudySection />
        </ErrorBoundary>

        <ErrorBoundary label="CertificationsSection">
          <CertificationsSection />
        </ErrorBoundary>

        <ErrorBoundary label="ContactSection">
          <ContactSection />
        </ErrorBoundary>
      </main>

      <Footer />

      <BackToTop />

      <ErrorBoundary label="CommandPalette">
        <Suspense fallback={null}>
          {paletteMounted ? (
            <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
          ) : null}
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
