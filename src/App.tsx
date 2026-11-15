import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Expertise } from './components/Expertise';
import { Toolkit } from './components/Toolkit';
import { Education } from './components/Education';
import { Certifications } from './components/Certifications';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Preloader, usePageLoad } from './components/Preloader';

function App() {
  const { progress, complete } = usePageLoad();

  // The pre-JS boot screen in index.html only bridges the gap until React
  // paints the preloader; drop it once the preloader is on top of it.
  useEffect(() => {
    document.getElementById('boot')?.remove();
  }, []);

  // Lock scroll on <html> rather than via a body class, so it can never
  // clobber the modals' `body.modal-open`. `scrollbar-gutter: stable` keeps
  // the scrollbar's space reserved, so the page doesn't shift sideways when
  // the lock is released.
  useEffect(() => {
    if (complete) return undefined;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    const prevGutter = root.style.scrollbarGutter;
    root.style.overflow = 'hidden';
    root.style.scrollbarGutter = 'stable';
    return () => {
      root.style.overflow = prevOverflow;
      root.style.scrollbarGutter = prevGutter;
    };
  }, [complete]);

  return (
    <div className="bg-paper font-sans text-ink">
      <Preloader progress={progress} complete={complete} />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Expertise />
        <Toolkit />
        <Education />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
