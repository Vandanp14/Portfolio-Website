import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { featuredProjects } from '../content/portfolio';
import { Rule } from './motion/Rule';
import { SplitLines } from './motion/SplitLines';
import { ProjectPanel } from './ProjectPanel';
import { SectionHeading, Shell } from './primitives';

const PANEL_ID = 'work-panel';
const tabId = (id: string) => `work-tab-${id}`;

export function Work() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const viewer = useRef<HTMLDivElement>(null);
  const project = featuredProjects[active];

  const selectTab = (index: number) => {
    setActive(index);
    tabs.current[index]?.focus();
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = featuredProjects.length - 1;
    const next =
      event.key === 'ArrowRight'
        ? active === last ? 0 : active + 1
        : event.key === 'ArrowLeft'
          ? active === 0 ? last : active - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    selectTab(next);
  };

  /** Index-row click: select the project and bring the viewer into view. */
  const openFromIndex = (index: number) => {
    setActive(index);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    viewer.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    tabs.current[index]?.focus({ preventScroll: true });
  };

  return (
    <section
      id="work"
      data-nav-section
      aria-labelledby="work-title"
      className="band band-paper relative py-[var(--section)]"
    >
      <Shell>
        <SectionHeading
          index="0.1"
          kicker="Selected work"
          title="Three products, built end to end."
          lede="Schema, backend, front end, deploy — each one on real data. Mine, or a team’s that had no engineer of its own."
          id="work-title"
        />

        {/* Numbered index — each row selects its project in the viewer below. */}
        <ol
          aria-label="Featured projects"
          className="mt-[clamp(64px,8vw,112px)] [&:hover_.row-name]:opacity-40 [&_.row:focus-visible_.row-name]:opacity-100 [&_.row:hover_.row-name]:opacity-100"
        >
          {featuredProjects.map((item, i) => {
            const isActive = i === active;
            return (
              <li key={item.id}>
                <Rule delay={i * 90} />
                <button
                  type="button"
                  onClick={() => openFromIndex(i)}
                  aria-controls={PANEL_ID}
                  aria-current={isActive ? 'true' : undefined}
                  className="row group grid w-full grid-cols-[minmax(0,1fr)_auto] gap-x-6 py-7 text-left md:py-9"
                >
                  <span className="min-w-0">
                    <SplitLines
                      text={item.title}
                      delay={i * 90}
                      className="row-name t-display block text-[clamp(3rem,7vw,6.5rem)] text-[var(--text)] transition-[opacity,transform] duration-[var(--t-medium)] ease-[var(--ease-out-expo)] group-hover:translate-x-2 group-focus-visible:translate-x-2"
                    />
                    <span
                      className="reveal mt-4 block max-w-[52ch] text-[17px] leading-[1.4] text-[var(--text-2)] md:text-[20px]"
                      style={{ '--reveal-delay': `${i * 90 + 200}ms` } as CSSProperties}
                    >
                      {item.tagline}
                    </span>
                  </span>

                  <span
                    className="reveal flex flex-col items-end gap-1.5 text-right"
                    style={{ '--reveal-delay': `${i * 90 + 120}ms` } as CSSProperties}
                  >
                    <span className="t-index text-[var(--text)]">/0.{i + 1}</span>
                    <span className="t-index num text-[var(--text-3)]">{item.year}</span>
                    <span className="t-index hidden max-w-[22ch] text-[var(--text-3)] md:block">{item.category}</span>
                    <span className="mt-auto flex items-center gap-2 pt-4">
                      {isActive && <span className="t-eyebrow text-[var(--accent)]">Viewing</span>}
                      <span
                        aria-hidden="true"
                        className="arrow-nudge text-[22px] leading-none text-[var(--text)] md:text-[28px]"
                      >
                        ↗
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
          <li aria-hidden="true">
            <Rule delay={featuredProjects.length * 90} />
          </li>
        </ol>

        {/* The product viewer behaves like a small route selector into each case study. */}
        <div ref={viewer} className="mt-[clamp(56px,7vw,96px)] scroll-mt-[var(--nav-h)]">
          <div className="reveal flex flex-wrap items-center justify-between gap-4">
            <div role="tablist" aria-label="Project details" className="flex flex-wrap gap-1.5">
              {featuredProjects.map((item, i) => {
                const selected = i === active;
                return (
                  <button
                    key={item.id}
                    ref={(node) => {
                      tabs.current[i] = node;
                    }}
                    type="button"
                    role="tab"
                    id={tabId(item.id)}
                    aria-selected={selected}
                    aria-controls={PANEL_ID}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(i)}
                    onKeyDown={onTabKey}
                    className={`project-switch inline-flex min-h-[48px] items-center gap-2.5 rounded-full px-5 text-[14px] tracking-[-0.01em] transition-[background-color,color,transform] duration-[var(--t-base)] ease-[var(--ease-out-expo)] active:scale-[0.985] ${
                      selected
                        ? 'bg-[var(--surface-2)] text-[var(--text)]'
                        : 'bg-[var(--surface)] text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-2)]'
                    }`}
                  >
                    <span className="t-index text-[11px]">/0.{i + 1}</span>
                    {item.title}
                  </button>
                );
              })}
            </div>
            <span className="t-index hidden text-[var(--text-3)] sm:inline" aria-hidden="true">
              {String(active + 1).padStart(2, '0')} / {String(featuredProjects.length).padStart(2, '0')}
            </span>
          </div>

          <div
            id={PANEL_ID}
            role="tabpanel"
            aria-labelledby={tabId(project.id)}
            tabIndex={0}
            data-reveal="clip"
            className="band band-slate mt-3 overflow-hidden rounded-[2px] px-[var(--pp)] py-[clamp(28px,4.5vw,64px)] [--pp:clamp(20px,4vw,56px)]"
          >
            <ProjectPanel key={project.id} project={project} position={active} />
          </div>
        </div>
      </Shell>
    </section>
  );
}
