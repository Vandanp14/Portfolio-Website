import { useRef, useState, type KeyboardEvent } from 'react';
import { featuredProjects } from '../content/portfolio';
import { ProjectPanel } from './ProjectPanel';
import { Shell } from './primitives';

const panelId = 'work-project-panel';

export function Work() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const project = featuredProjects[active];

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = featuredProjects.length - 1;
    const next = event.key === 'ArrowRight' ? (active + 1) % featuredProjects.length
      : event.key === 'ArrowLeft' ? (active + last) % featuredProjects.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? last : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="work" data-nav-section aria-labelledby="work-title" className="band band-paper work-page">
      <Shell>
        <div className="work-intro">
          <div>
            <p className="work-kicker"><i /> Selected work / 2024—26</p>
            <h2 id="work-title">Built for the<br /><span>real world.</span></h2>
          </div>
          <p className="work-intro-lede">Three products, built end to end. Explore the interface, then the engineering underneath it.</p>
        </div>

        <div className="work-explorer">
          <div className="work-project-tabs" role="tablist" aria-label="Featured projects">
            {featuredProjects.map((item, index) => (
              <button
                key={item.id}
                ref={(node) => { tabs.current[index] = node; }}
                type="button"
                role="tab"
                id={`work-tab-${item.id}`}
                aria-selected={active === index}
                aria-controls={panelId}
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={onTabKey}
              >
                <span className="work-tab-number">0{index + 1}</span>
                <span className="work-tab-copy"><strong>{item.title}</strong><small>{item.category}</small></span>
                <span className="work-tab-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>

          <div id={panelId} role="tabpanel" aria-labelledby={`work-tab-${project.id}`} tabIndex={0} className="work-panel-wrap">
            <ProjectPanel key={project.id} project={project} position={active} />
          </div>
        </div>
      </Shell>
    </section>
  );
}
