import { profile } from '../../content/portfolio';
import { Link } from '../Link';
import { Shell } from './primitives';

type FooterLink = { label: string; to: string; href?: undefined } | { label: string; href: string; to?: undefined };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Site',
    links: [
      { label: 'Work', to: '/work' },
      { label: 'Experience', to: '/experience' },
      { label: 'About', to: '/about' },
      { label: 'Writing', to: '/blog' },
      { label: 'Résumé', to: '/resume' },
    ],
  },
  {
    title: 'Elsewhere',
    links: [
      { label: 'GitHub', href: profile.github },
      { label: 'LinkedIn', href: profile.linkedin },
      { label: 'Email', href: `mailto:${profile.email}` },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="band band-runtime">
      <Shell>
        <div className="footer">
          <div className="footer__top">
            <div>
              <p className="eyebrow">Portfolio — 2026</p>
              <p className="display-sm" style={{ marginTop: 14, maxWidth: '14ch' }}>
                Built to be read, not skimmed.
              </p>
              <p className="small" style={{ marginTop: 16, maxWidth: '32ch' }}>
                One engineer, three products and the decisions behind them. No template, no stock
                photography.
              </p>
            </div>

            {COLUMNS.map((column) => (
              <div className="footer__col" key={column.title}>
                <p className="eyebrow">{column.title}</p>
                <ul>
                  {column.links.map((link) =>
                    'href' in link && link.href ? (
                      <li key={link.label}>
                        <a href={link.href} target="_blank" rel="noopener noreferrer">
                          {link.label} ↗
                        </a>
                      </li>
                    ) : (
                      <li key={link.label}>
                        <Link to={link.to ?? '/'}>{link.label}</Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="footer__bottom">
            <span className="mono">
              © {year} {profile.name}
            </span>
            <span className="mono">Set in Instrument Serif, IBM Plex Sans &amp; IBM Plex Mono</span>
          </div>

          <div style={{ marginTop: 40 }}>
            <p className="footer__wordmark" aria-hidden="true">
              Vandan Patel
            </p>
            <div className="footer__spectrum" aria-hidden="true" />
          </div>
        </div>
      </Shell>
    </footer>
  );
}
