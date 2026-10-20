import { useRef, useState, type KeyboardEvent } from 'react';
import { featuredProjects } from '../content/portfolio';
import { Link } from './Link';
import { Picture, Shell } from './primitives';

const gameNames = ['2048', 'Hangman', 'Crossword', 'Memory', 'Higher / Lower'];

export function HomeShowcase() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const project = featuredProjects[active];
  const lead = project.shots.find((shot) => shot.kind === 'wide') ?? project.shots[0];

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const next = event.key === 'ArrowRight' ? (active + 1) % featuredProjects.length
      : event.key === 'ArrowLeft' ? (active + featuredProjects.length - 1) % featuredProjects.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? featuredProjects.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section className="home-showcase band band-slate" aria-labelledby="showcase-title">
      <Shell>
        <div className="showcase-heading">
          <p className="showcase-kicker"><i /> Work, in the real world</p>
          <h2 id="showcase-title">Built to <span>be used.</span></h2>
          <p>Products I’ve shipped, systems I’ve untangled, and the details behind the screens.</p>
        </div>

        <div className="showcase-controls" role="tablist" aria-label="Featured projects">
          {featuredProjects.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => { tabs.current[index] = node; }}
              type="button"
              role="tab"
              id={`showcase-tab-${item.id}`}
              aria-selected={active === index}
              aria-controls="showcase-panel"
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={onTabKey}
            >
              <span>0{index + 1}</span>{item.title}<b aria-hidden="true">↗</b>
            </button>
          ))}
        </div>

        <div key={project.id} id="showcase-panel" role="tabpanel" aria-labelledby={`showcase-tab-${project.id}`} className="showcase-panel showcase-enter">
          <div className={`showcase-visual ${lead?.kind === 'phone' ? 'showcase-visual-phone' : ''}`}>
            <div className="showcase-visual-top"><span>{project.category}</span><span>{project.year} <i>●</i></span></div>
            {lead ? (
              <Picture image={lead.src} sizes="(min-width: 900px) 58vw, 94vw" alt={lead.alt} width={lead.kind === 'wide' ? 2940 : 758} height={lead.kind === 'wide' ? 1604 : 1400} />
            ) : <GameIndex />}
            {lead && <span className="showcase-caption">{lead.caption}</span>}
          </div>

          <div className="showcase-copy">
            <div className="showcase-story-number">0{active + 1} <span>/ 03</span></div>
            <h3>{project.title}</h3>
            <p className="showcase-tagline">{project.tagline}</p>
            <div className="showcase-metrics">
              {project.metrics.slice(0, 2).map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
            </div>
            <Link to="/work" className="showcase-link">See how it works <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className="showcase-progress" aria-hidden="true"><span style={{ transform: `scaleX(${(active + 1) / featuredProjects.length})` }} /></div>
      </Shell>
    </section>
  );
}

function GameIndex() {
  return (
    <div className="game-index-art" aria-label="Five daily games: 2048, Hangman, Crossword, Memory, Higher or Lower">
      <div className="game-index-header"><span>THE DAILY SET</span><strong>5 games. A new challenge each day.</strong></div>
      <div className="game-index-tiles" aria-hidden="true">
        {gameNames.map((name, index) => <div className={`game-index-tile game-tile-${index + 1}`} key={name}><small>0{index + 1}</small><span>{name}</span><i>↗</i></div>)}
      </div>
    </div>
  );
}
