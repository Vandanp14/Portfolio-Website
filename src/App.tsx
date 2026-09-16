import { About } from './components/About';
import { Contact } from './components/Contact';
import { Experience } from './components/Experience';
import { FanaticsBanner } from './components/FanaticsBanner';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { OtherWork } from './components/OtherWork';
import { Work } from './components/Work';
import { useRevealObserver } from './hooks/useReveal';
import { useScrollSpy } from './hooks/useScrollSpy';

export default function App() {
  const active = useScrollSpy();
  useRevealObserver();

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[var(--r-md)] focus:bg-[#1F6FEB] focus:px-4 focus:py-2 focus:text-[#FFFFFF]"
      >
        Skip to content
      </a>
      <Nav active={active} />
      <main>
        <Hero />
        <FanaticsBanner />
        <Work />
        <OtherWork />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
