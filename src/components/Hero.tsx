import { featuredProjects, profile, stats } from '../content/portfolio';
import { Link } from './Link';
import { Picture, Shell } from './primitives';

const leadProject = featuredProjects[0];
const leadShot = leadProject.shots.find((shot) => shot.kind === 'wide') ?? leadProject.shots[0];
const proof = stats.slice(0, 3);

export function Hero() {
  return (
    <>
      <section id="top" className="band band-paper home-hero" aria-labelledby="home-title">
        <Shell className="home-hero-inner">
          <div className="home-hero-copy">
            <p className="home-kicker"><span className="status-dot" aria-hidden="true" />{profile.status}</p>
            <h1 id="home-title" className="home-title">
              I build the systems <span>other teams</span> build on.
            </h1>
            <p className="home-intro">Backend systems, product interfaces, and practical AI—built with the care to make them useful beyond the demo.</p>
            <div className="home-actions">
              <Link to="/work" className="home-primary-link">Explore selected work <span aria-hidden="true">↗</span></Link>
              <Link to="/contact" className="home-secondary-link">Let’s talk <span aria-hidden="true">→</span></Link>
            </div>
          </div>

          <Link to="/work" className="home-feature" aria-label={`Explore ${leadProject.title}: ${leadProject.tagline}`}>
            <div className="home-feature-window">
              <div className="home-window-bar" aria-hidden="true">
                <span className="window-dots"><i /><i /><i /></span>
                <span>MFP COACH / FULL-STACK SYSTEM</span>
                <span className="window-live"><i /> LIVE PRODUCT</span>
              </div>
              <div className="home-feature-image">
                <Picture
                  image={leadShot.src}
                  sizes="(min-width: 1024px) 92vw, 100vw"
                  eager
                  alt={leadShot.alt}
                  width={leadShot.kind === 'wide' ? 2940 : 758}
                  height={leadShot.kind === 'wide' ? 1604 : 1400}
                />
                <span className="home-feature-index">One directive. Then the data. <span>↗</span></span>
                <span className="hero-proof-float"><strong>44</strong><span>API routes</span><i>20-table schema</i></span>
              </div>
              <div className="home-feature-caption">
                <div><span className="home-overline">{leadProject.category} · {leadProject.year}</span><h2>{leadProject.title}</h2></div>
                <p>{leadProject.tagline}</p>
              </div>
            </div>
          </Link>

          <div className="home-proof-strip" aria-label="Engineering outcomes">
            {proof.map((stat) => (
              <div className="home-proof-item" key={stat.label}>
                <strong>{stat.value}<small>{stat.suffix}</small></strong>
                <span>{stat.label}</span>
              </div>
            ))}
            <Link to="/experience" className="home-proof-link">How I got here <span aria-hidden="true">↗</span></Link>
          </div>
        </Shell>
        <a className="home-scroll-cue" href="#index"><span aria-hidden="true" /> Scroll to explore</a>
      </section>

      <section className="band band-mist home-proof" aria-label="Selected engineering outcomes">
        <Shell>
          <div className="home-proof-heading"><span>Built in production. Used by real teams.</span><span>2023 — 2026</span></div>
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
