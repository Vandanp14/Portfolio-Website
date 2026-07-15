import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Mail, Linkedin, Globe, Phone, MapPin, Menu, X } from 'lucide-react';
import heroCard from './assets/hero-card.jpg';

const RESUME_URL =
  'https://drive.google.com/file/d/1XZIbed6pfAnyLFdAvmiSdF7pIH8kbQ9J/view?usp=sharing';

const navItems = ['about', 'education', 'experience', 'skills', 'projects', 'contact'];

const contactCards: {
  label: string;
  value: string;
  href?: string;
  icon: LucideIcon;
}[] = [
  {
    label: 'Email',
    value: 'patelvandan024@gmail.com',
    href: 'mailto:patelvandan024@gmail.com',
    icon: Mail,
  },
  {
    label: 'LinkedIn',
    value: 'vpatel1410',
    href: 'https://linkedin.com/in/vpatel1410',
    icon: Linkedin,
  },
  {
    label: 'Website',
    value: 'vandanpatel.me',
    href: 'https://vandanpatel.me',
    icon: Globe,
  },
  {
    label: 'Phone',
    value: '+1 315-236-1200',
    icon: Phone,
  },
  {
    label: 'Location',
    value: 'Oswego, NY',
    icon: MapPin,
  },
];

const coursework = [
  'Operating Systems',
  'Systems Programming',
  'Data Structures and Algorithms',
  'Computer Architecture',
  'Software Engineering',
  'Database Systems',
];

const focusAreas = ['Concurrency', 'Multithreading', 'Server Architectures', 'Algorithm Optimization'];

const experience = [
  {
    title: 'Incoming Summer Intern',
    company: 'Fanatics Collectibles',
    period: 'Incoming Summer 2026',
    location: 'New York City, NY',
    achievements: [
      'Joining Fanatics Collectibles in New York City for Summer 2026.',
      'Getting up to speed on the team’s technology stack ahead of the start date — Elixir and Phoenix LiveView — assimilating quickly to unfamiliar technologies.',
    ],
  },
  {
    title: 'Data Analyst Intern',
    company: 'Institutional Research & Assessment',
    period: 'August 2025 - December 2025',
    location: 'Oswego, NY',
    achievements: [
      'Optimized SQL query performance for large-scale institutional datasets, reducing execution time and report generation latency by 40 percent.',
      'Architected automated ETL pipelines to process and validate data from disparate sources, ensuring high availability and consistency for decision-making systems.',
      'Analyzed complex data relationships to define standardized schemas, improving reliability and fault tolerance of downstream reporting applications.',
    ],
  },
  {
    title: 'Software Developer Intern',
    company: 'SUNY Oswego Facilities Services',
    period: 'April 2024 - Present',
    location: 'Oswego, NY',
    achievements: [
      'Engineered backend integration logic connecting legacy facility systems with modern web dashboards through REST APIs, increasing data throughput and system responsiveness.',
      'Delivered production-ready code in an Agile environment with CI/CD workflows, emphasizing system reliability and maintainability.',
      'Refactored existing codebases to improve modularity and reduce technical debt, enabling scalable future feature development.',
    ],
  },
  {
    title: 'Help Desk Attendant (Technical Support)',
    company: 'SUNY Oswego Help Desk',
    period: 'February 2023 - May 2023',
    location: 'Oswego, NY',
    achievements: [
      'Resolved over 100 Tier-1 and Tier-2 technical tickets involving hardware, software, and network systems in Linux and Unix environments, maintaining a 15 percent faster resolution rate than team average.',
      'Performed system debugging and troubleshooting for recurring network issues, documenting root causes and solutions in internal knowledge bases.',
    ],
  },
];

const skillGroups = [
  {
    title: 'Systems Programming',
    skills: ['C++', 'C', 'POSIX APIs', 'Multithreading and Concurrency', 'Memory Management'],
  },
  {
    title: 'Algorithms & Data',
    skills: ['Data Structures', 'Algorithm Design', 'SQL Optimization', 'Complexity Analysis'],
  },
  {
    title: 'Tools & Environment',
    skills: ['Linux and Unix', 'Git', 'GDB', 'Valgrind', 'Docker', 'Bash Scripting', 'CI/CD'],
  },
  {
    title: 'Languages',
    skills: ['Python', 'Java', 'SQL', 'Clojure', 'Scala'],
  },
];

const projects = [
  {
    title: 'High-Performance Multi-Threaded HTTP Server',
    technologies: ['C++', 'POSIX Threads', 'Networking'],
    description: [
      'Architected a concurrent web server from scratch using a custom thread pool to handle multiple client connections without blocking.',
      'Implemented synchronization primitives including mutexes and condition variables to prevent race conditions and deadlocks.',
      'Optimized throughput by decoupling connection acceptance from request processing using low-level POSIX socket APIs.',
      'Ensured reliability through RAII-based resource management and robust error handling to prevent memory leaks under load.',
    ],
  },
  {
    title: 'Full-Stack Transit Analytics Tracker',
    technologies: ['React', 'Flask', 'MySQL', 'Docker'],
    description: [
      'Architected a responsive web application integrating live transit APIs with a Flask backend, serving over 7,000 users with high-performance MySQL caching.',
      'Implemented containerized deployment using Docker to ensure consistent environments across development and production with Git-based version control.',
    ],
  },
  {
    title: 'TA Grading & Testing Automation',
    technologies: ['Python', 'Selenium', 'Bash'],
    description: [
      'Engineered an automated testing and grading pipeline using Selenium and Python, reducing manual processing time from 3 hours to 15 minutes.',
      'Integrated Bash scripts for automated email reporting to ensure reliable and timely delivery of results to stakeholders.',
    ],
  },
  {
    title: 'Event RSVP Management Platform',
    technologies: ['React', 'Node.js', 'Cloud APIs'],
    description: [
      'Developed a cloud-synced management platform with real-time validation and automated CI/CD pipelines, handling over 500 concurrent entries with zero downtime.',
    ],
  },
  {
    title: 'Deterministic Turing Machine Simulator',
    technologies: ['C', 'Low-Level Memory Management'],
    description: [
      'Developed a low-level Turing machine simulator using custom doubly linked lists to efficiently emulate infinite tape memory.',
      'Optimized transition logic and memory allocation strategies, improving runtime performance by 20 percent.',
      'Demonstrated strong understanding of state machines and computational theory through precise algorithmic implementation.',
    ],
  },
  {
    title: 'Propositional Logic Inference Engine',
    technologies: ['Clojure', 'Recursion', 'Algorithms'],
    description: [
      'Implemented a forward-chaining inference engine using recursive data structures to evaluate logical rules and propagate facts.',
      'Designed optimized lookup mechanisms to maximize rule evaluation efficiency across large knowledge bases.',
    ],
  },
  {
    title: 'Light-Up Puzzle Solver',
    technologies: ['Answer Set Programming (Clingo)'],
    description: [
      'Modeled complex constraint satisfaction problems to compute valid configurations for NP-hard puzzles.',
      'Applied heuristic optimizations to reduce the search space and significantly lower computation time.',
    ],
  },
];

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

function useReveal() {
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      return undefined;
    }

    const root = document.documentElement;
    root.classList.add('js-motion');

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('.reveal, .reveal-text'),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      root.classList.remove('js-motion');
    };
  }, []);
}

function useCardTilt() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const card = cardRef.current;
    if (!scene || !card) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    if (!mediaQuery.matches) {
      return undefined;
    }

    let frameId = 0;

    const handleEnter = () => {
      card.style.setProperty('will-change', 'transform');
    };

    const handleMove = (event: PointerEvent) => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const rect = scene.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const cx = px * 100 - 50;
        const cy = py * 100 - 50;
        scene.style.setProperty('--pointer-x', `${px * 100}%`);
        scene.style.setProperty('--pointer-y', `${py * 100}%`);
        scene.style.setProperty('--background-x', `${px * 100}%`);
        scene.style.setProperty('--background-y', `${py * 100}%`);
        scene.style.setProperty('--rotate-x', `${-(cx / 5)}deg`);
        scene.style.setProperty('--rotate-y', `${cy / 5}deg`);
        scene.style.setProperty('--pointer-from-center', `${Math.min(1, Math.hypot(cx, cy) / 50)}`);
        scene.style.setProperty('--card-opacity', '1');
        card.dataset.tilting = 'true';
      });
    };

    const handleLeave = () => {
      window.cancelAnimationFrame(frameId);
      card.dataset.tilting = 'false';
      scene.style.setProperty('--rotate-x', '0deg');
      scene.style.setProperty('--rotate-y', '0deg');
      scene.style.setProperty('--card-opacity', '0');
      card.style.removeProperty('will-change');
    };

    scene.addEventListener('pointerenter', handleEnter);
    scene.addEventListener('pointermove', handleMove);
    scene.addEventListener('pointerleave', handleLeave);

    return () => {
      window.cancelAnimationFrame(frameId);
      scene.removeEventListener('pointerenter', handleEnter);
      scene.removeEventListener('pointermove', handleMove);
      scene.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  return { sceneRef, cardRef };
}

function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="reveal-text">
      <p className="mono text-[12px] text-[var(--accent)]">{kicker}</p>
      <h2 className="mt-4 text-[clamp(2rem,4vw,2.75rem)]">{title}</h2>
    </div>
  );
}

function Bullet() {
  return (
    <span
      className="mt-[10px] h-[5px] w-[5px] flex-none rounded-full bg-[var(--accent)]"
      aria-hidden="true"
    />
  );
}

function FanaticsHoverCard() {
  return (
    <div className="hovercard-motion pointer-events-none absolute right-0 top-6 z-20 hidden -translate-y-1 items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)] px-4 py-3 opacity-0 shadow-[var(--shadow-card)] md:flex md:group-hover:translate-y-0 md:group-hover:opacity-100">
      <div className="serif flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-lg text-[var(--accent)]">
        FC
      </div>
      <div>
        <div className="serif text-sm text-[var(--text-1)]">Fanatics</div>
        <div className="text-xs text-[var(--text-2)]">Collectibles</div>
      </div>
    </div>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorHover, setCursorHover] = useState(false);
  const [cursorPressed, setCursorPressed] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef('about');
  const cursorShownRef = useRef(false);

  useReveal();
  const { sceneRef, cardRef } = useCardTilt();

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const height = doc.scrollHeight - doc.clientHeight;
      const progress = height > 0 ? doc.scrollTop / height : 0;

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      let nextActive = lastActiveRef.current;
      document.querySelectorAll('section').forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 180 && rect.bottom >= 180) {
          nextActive = section.id;
        }
      });

      if (doc.scrollTop + doc.clientHeight >= doc.scrollHeight - 2) {
        nextActive = navItems[navItems.length - 1];
      }

      if (nextActive !== lastActiveRef.current) {
        lastActiveRef.current = nextActive;
        setActiveSection(nextActive);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    if (!mediaQuery.matches) {
      return undefined;
    }

    let frameId = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let coreX = targetX;
    let coreY = targetY;

    const animateCursor = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      coreX += (targetX - coreX) * 0.35;
      coreY += (targetY - coreY) * 0.35;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${coreX}px, ${coreY}px, 0) translate(-50%, -50%)`;
      }

      frameId = window.requestAnimationFrame(animateCursor);
    };

    const isInteractive = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest('a, button, [data-cursor="interactive"]'));

    const handleMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!cursorShownRef.current) {
        cursorShownRef.current = true;
        setCursorVisible(true);
      }
    };

    const handleMouseLeaveWindow = (event: MouseEvent) => {
      if (event.relatedTarget) {
        return;
      }

      cursorShownRef.current = false;
      setCursorVisible(false);
      setCursorHover(false);
      setCursorPressed(false);
    };

    const handlePointerOver = (event: MouseEvent) => {
      if (isInteractive(event.target)) {
        setCursorHover(true);
      }
    };

    const handlePointerOut = (event: MouseEvent) => {
      if (!isInteractive(event.relatedTarget)) {
        setCursorHover(false);
      }
    };

    const handleMouseDown = () => setCursorPressed(true);
    const handleMouseUp = () => setCursorPressed(false);

    frameId = window.requestAnimationFrame(animateCursor);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseout', handleMouseLeaveWindow);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handlePointerOver);
    document.addEventListener('mouseout', handlePointerOut);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseout', handleMouseLeaveWindow);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handlePointerOver);
      document.removeEventListener('mouseout', handlePointerOut);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const contactRow = contactCards.filter((card) => card.label !== 'Email');

  return (
    <div
      className={`min-h-screen ${cursorVisible ? 'cursor-visible' : ''} ${
        cursorHover ? 'cursor-hover' : ''
      } ${cursorPressed ? 'cursor-pressed' : ''}`}
    >
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span />
      </div>
      <div ref={coreRef} className="cursor-core" aria-hidden="true">
        <span />
      </div>

      <div className="scene" aria-hidden="true">
        <div className="bloom bloom-a" />
        <div className="bloom bloom-b" />
        <div className="grain" />
        <div className="grid-lines" />
      </div>

      <div
        ref={progressRef}
        className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-[var(--accent)]"
        style={{ transform: 'scaleX(0)' }}
        aria-hidden="true"
      />

      <nav className="nav-glass fixed inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <button
            onClick={() => scrollToSection('about')}
            className="serif text-[18px] tracking-[-0.02em] text-[var(--text-1)]"
          >
            Vandan Patel
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`nav-link-motion relative rounded-md px-3 py-2 text-[14px] ${
                  activeSection === section
                    ? 'text-[var(--text-1)]'
                    : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
                }`}
              >
                {capitalize(section)}
                {activeSection === section && (
                  <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--accent)]" />
                )}
              </button>
            ))}
          </div>

          <button
            className="flex h-11 w-11 items-center justify-center text-[var(--text-1)] md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-[var(--border-subtle)] px-4 pb-4 pt-1 md:hidden">
            {navItems.map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`nav-link-motion flex h-12 w-full items-center rounded-lg px-4 text-left text-[15px] ${
                  activeSection === section
                    ? 'text-[var(--text-1)]'
                    : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
                }`}
              >
                {capitalize(section)}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main>
        <section
          id="about"
          className="relative flex min-h-screen items-center px-6 pb-20 pt-32 scroll-mt-24"
        >
          <div className="mx-auto grid w-full max-w-5xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="reveal-text mono text-[12px] text-[var(--accent)]">
                Software Engineer · Systems &amp; Backend
              </p>
              <h1
                className="reveal-text mt-6 text-[clamp(3.5rem,9vw,7rem)] font-[560] leading-[0.95] tracking-[-0.03em]"
                style={{ transitionDelay: '60ms' }}
              >
                Vandan Patel
              </h1>
              <p
                className="reveal-text mt-6 max-w-2xl text-[19px] leading-[1.6] text-[var(--text-2)]"
                style={{ transitionDelay: '120ms' }}
              >
                Computer science student focused on systems, backend engineering, and polished
                product experiences that still feel fast and reliable under pressure.
              </p>

              <div
                className="reveal-text mt-8 flex items-center gap-3"
                style={{ transitionDelay: '180ms' }}
              >
                <span
                  className="h-2 w-2 flex-none rounded-full bg-[var(--accent)]"
                  aria-hidden="true"
                />
                <span className="mono text-[12px] text-[var(--text-2)]">
                  Next — Fanatics Collectibles · New York City · Summer 2026
                </span>
              </div>

              <div
                className="reveal-text mt-10 flex flex-wrap items-center gap-3"
                style={{ transitionDelay: '240ms' }}
              >
                <a
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-motion inline-flex items-center rounded-[14px] bg-[var(--text-1)] px-7 py-3.5 text-[15px] font-medium text-[var(--bg)] hover:-translate-y-0.5 hover:bg-[#2A2A2E] active:scale-[0.985]"
                >
                  View Resume
                </a>
                <button
                  onClick={() => scrollToSection('experience')}
                  className="btn-motion inline-flex items-center rounded-[14px] border border-[var(--border-strong)] px-7 py-3.5 text-[15px] font-medium text-[var(--text-1)] hover:-translate-y-0.5 hover:border-[var(--text-1)] active:scale-[0.985]"
                >
                  Explore work
                </button>
              </div>
            </div>

            <div
              className="reveal flex justify-center"
              style={{ transitionDelay: '300ms' }}
            >
              <div ref={sceneRef} className="card-scene w-[260px] lg:w-[300px] xl:w-[340px]">
                <div
                  ref={cardRef}
                  className="hero-card flex flex-col rounded-[18px] border border-[var(--border-strong)] bg-[var(--surface-1)] p-[10px] shadow-[var(--shadow-card)]"
                >
                  <div className="hero-card__art relative min-h-0 flex-1 overflow-hidden rounded-[10px]">
                    <img src={heroCard} alt="Vandan Patel" />
                    <div className="hero-card__sheen" aria-hidden="true" />
                    <div className="hero-card__shine" aria-hidden="true" />
                    <div className="hero-card__glare" aria-hidden="true" />
                  </div>
                  <div className="mt-[10px] shrink-0 px-1 pb-0.5 pt-1.5">
                    <div className="serif text-[20px] leading-tight text-[var(--text-1)]">
                      Vandan Patel
                    </div>
                    <div className="mono mt-1 text-[10px] text-[var(--text-3)]">
                      Software Engineer · Systems &amp; Backend
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="mono text-[11px] text-[var(--accent)]">Rookie · 2026</span>
                      <span className="mono text-[11px] text-[var(--text-2)]">1/1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
            <span className="mono text-[11px] text-[var(--text-3)]">Scroll</span>
            <span className="h-10 w-px bg-[var(--border-strong)]" aria-hidden="true" />
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-6">
        <section id="education" className="scroll-mt-24 py-24 md:py-28">
          <SectionHeader kicker="01 — Foundation" title="Education" />

          <div className="reveal mt-12 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-8 shadow-[var(--shadow-card)] md:p-10">
            <h3 className="text-[26px]">Bachelor of Science in Computer Science</h3>
            <p className="mt-2 text-[16px] text-[var(--text-2)]">
              State University of New York at Oswego
            </p>
            <p className="text-[15px] text-[var(--text-3)]">Oswego, NY</p>
            <p className="mono mt-4 text-[12px] text-[var(--accent)]">Expected December 2026</p>

            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <div>
                <h4 className="mono text-[12px] text-[var(--text-3)]">Relevant Coursework</h4>
                <ul className="mt-4">
                  {coursework.map((course) => (
                    <li
                      key={course}
                      className="border-b border-[var(--border-subtle)] py-3 text-[15px] text-[var(--text-2)] last:border-b-0"
                    >
                      {course}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mono text-[12px] text-[var(--text-3)]">Focus Areas</h4>
                <div className="mt-4 flex flex-wrap gap-2">
                  {focusAreas.map((focus) => (
                    <span
                      key={focus}
                      className="rounded-[10px] bg-[var(--surface-2)] px-3 py-2 text-[13px] font-medium text-[var(--text-2)]"
                    >
                      {focus}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="scroll-mt-24 py-24 md:py-28">
          <SectionHeader kicker="02 — Timeline" title="Experience" />

          <div className="mt-12 border-t border-[var(--border-subtle)]">
            {experience.map((job, index) => (
              <div
                key={job.title}
                className="group reveal relative grid gap-4 border-b border-[var(--border-subtle)] py-8 md:grid-cols-[200px_1fr] md:gap-8"
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                {job.company === 'Fanatics Collectibles' && <FanaticsHoverCard />}

                <div className="flex flex-col gap-1">
                  <span className="mono text-[12px] text-[var(--text-3)]">{job.period}</span>
                  <span className="mono text-[12px] text-[var(--text-3)]">{job.location}</span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[24px]">{job.title}</h3>
                    {index === 0 && (
                      <span className="mono rounded-[6px] bg-[var(--accent-soft)] px-2 py-1 text-[11px] text-[var(--accent)]">
                        Incoming
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[16px] text-[var(--text-2)]">{job.company}</p>

                  <ul className="mt-4 space-y-2.5">
                    {job.achievements.map((achievement) => (
                      <li
                        key={achievement}
                        className="flex gap-3 text-[16px] leading-[1.6] text-[var(--text-2)]"
                      >
                        <Bullet />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="skills" className="scroll-mt-24 py-24 md:py-28">
          <SectionHeader kicker="03 — Capabilities" title="Technical Skills" />

          <div className="reveal mt-12 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-6 shadow-[var(--shadow-card)] md:p-8">
            <div className="divide-y divide-[var(--border-subtle)]">
              {skillGroups.map((group) => (
                <div
                  key={group.title}
                  className="grid gap-4 py-6 first:pt-0 last:pb-0 md:grid-cols-[220px_1fr] md:gap-8"
                >
                  <h3 className="text-[19px] tracking-[-0.01em]">{group.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-[10px] bg-[var(--surface-2)] px-3 py-2 text-[14px] text-[var(--text-2)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="scroll-mt-24 py-24 md:py-28">
          <SectionHeader kicker="04 — Selected Work" title="Projects" />

          <div className="mt-12 border-t border-[var(--border-subtle)]">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="group reveal flex gap-4 border-b border-[var(--border-subtle)] py-8 md:gap-6"
                style={{ transitionDelay: `${Math.min(index, 5) * 60}ms` }}
              >
                <span className="link-motion mono text-[13px] text-[var(--text-3)] group-hover:text-[var(--accent)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <h3 className="text-[24px] md:text-[26px]">{project.title}</h3>
                  <p className="mono mt-2 text-[11px] text-[var(--text-3)]">
                    {project.technologies.join(' · ')}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {project.description.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 text-[16px] leading-[1.6] text-[var(--text-2)]"
                      >
                        <Bullet />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 py-24 md:py-28">
          <SectionHeader kicker="05 — Contact" title="Get in touch" />

          <div className="reveal-text mt-10">
            <a
              href="mailto:patelvandan024@gmail.com"
              className="email-motion serif inline-block text-[clamp(1.75rem,4vw,2.25rem)] tracking-[-0.02em] text-[var(--text-1)] underline decoration-[var(--border-strong)] decoration-1 underline-offset-[6px] hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
            >
              patelvandan024@gmail.com
            </a>
          </div>

          <div
            className="reveal-text mt-8 flex flex-wrap gap-x-8 gap-y-4"
            style={{ transitionDelay: '80ms' }}
          >
            {contactRow.map(({ label, value, href, icon: Icon }) => {
              const content = (
                <>
                  <Icon className="h-4 w-4 text-[var(--text-3)]" aria-hidden="true" />
                  {value}
                </>
              );

              if (href) {
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label}: ${value}`}
                    className="link-motion inline-flex items-center gap-2 text-[14px] text-[var(--text-2)] hover:text-[var(--text-1)]"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 text-[14px] text-[var(--text-2)]"
                >
                  {content}
                </span>
              );
            })}
          </div>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] py-8">
          <span className="mono text-[11px] text-[var(--text-3)]">© 2026 Vandan Patel</span>
          <span className="mono text-[11px] text-[var(--text-3)]">Built with React</span>
        </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
