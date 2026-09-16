import { useEffect, useState } from 'react';
import type { SectionId } from '../content/portfolio';

export function useScrollSpy(initial: SectionId = 'top') {
  const [active, setActive] = useState<SectionId>(initial);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-section]'));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as SectionId);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0.05, 0.4] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}

export function scrollToSection(id: SectionId) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}
