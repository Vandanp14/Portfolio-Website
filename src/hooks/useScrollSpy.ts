import { useEffect, useState } from 'react';
import type { SectionId } from '../content/portfolio';

export function useScrollSpy(initial: SectionId = 'top') {
  const [active, setActive] = useState<SectionId>(initial);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-section]'));
    // Which sections currently cross a thin band ~20–35% down the viewport.
    // Tracked as a set (not by intersection ratio) because sections can be
    // several viewports tall, where any ratio threshold would never be met.
    const inBand = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        });
        const current = sections.find((section) => inBand.has(section.id));
        if (current) setActive(current.id as SectionId);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 },
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
