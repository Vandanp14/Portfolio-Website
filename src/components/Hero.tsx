import { featuredProjects, profile, stats } from '../content/portfolio';
import { Link } from './Link';
import { Picture, Shell } from './primitives';

const leadProject = featuredProjects[0];
const leadShot = leadProject.shots.find((shot) => shot.kind === 'wide') ?? leadProject.shots[0];
const headlineAccent = 'other people build on.';
const headlineLead = profile.headline.slice(0, -headlineAccent.length).trimEnd();

export function Hero() {
  return (
    <>
      <section id="top" className="band band-paper home-hero" aria-labelledby="home-title">
        <Shell className="home-hero-inner">
          <div className="home-hero-copy">
            <p className="home-kicker"><span className="status-dot" aria-hidden="true" />{profile.status}</p>
            <h1 id="home-title" className="home-title">
              {headlineLead} <em>{headlineAccent}</em>
            </h1>
            <p className="home-intro">{profile.intro}</p>
            <div className="home-actions">
              <Link to="/work" className="home-primary-link">Explore the work <span aria-hidden="true">↗</span></Link>
              <Link to="/contact" className="home-secondary-link">Get in touch <span aria-hidden="true">→</span></Link>
            </div>
            <div className="home-location"><span>Based in</span><strong>{profile.location}</strong><span className="location-divider">/</span><span>{profile.disciplines.join(' · ')}</span></div>
          </div>

          <Link to="/work" className="home-feature" aria-label={`Explore ${leadProject.title}: ${leadProject.tagline}`}>
            <div className="home-feature-image">
              <Picture
                image={leadShot.src}
                sizes="(min-width: 1024px) 58vw, 100vw"
                eager
                alt={leadShot.alt}
                width={leadShot.kind === 'wide' ? 2940 : 758}
                height={leadShot.kind === 'wide' ? 1604 : 1400}
              />
              <span className="home-feature-index">Featured work <span>01 / 03</span></span>
              <span className="home-feature-open" aria-hidden="true">↗</span>
            </div>
            <div className="home-feature-caption">
              <div><span className="home-overline">{leadProject.category} · {leadProject.year}</span><h2>{leadProject.title}</h2></div>
              <p>{leadProject.tagline}</p>
            </div>
          </Link>
        </Shell>
      </section>

      <section className="band band-paper home-proof" aria-label="Selected engineering outcomes">
        <Shell>
          <div className="home-proof-heading"><span>Recent work, in numbers</span><span>01 — 04</span></div>
          <dl className="home-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="home-stat">
                <dd>{stat.value}<span>{stat.suffix}</span></dd>
                <dt>{stat.label}</dt>
                <dd className="home-stat-note">{stat.note}</dd>
              </div>
            ))}
          </dl>
        </Shell>
      </section>
    </>
  );
}
