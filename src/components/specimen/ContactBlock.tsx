import { profile } from '../../content/portfolio';
import { Eyebrow, Shell } from './primitives';

export function ContactBlock({ index = '06 — Contact' }: { index?: string }) {
  return (
    <section className="band band-runtime section contact-band" id="contact">
      <Shell>
        <div className="section-head">
          <p className="eyebrow section-head__index">{index}</p>
          <h2 className="h2 section-head__title">
            Available for <em>Summer 2027</em>.
          </h2>
          <p className="small section-head__note">
            Backend, platform or applied AI. Based in New York; open to relocation.
          </p>
        </div>

        <div style={{ marginTop: 'clamp(40px, 5vw, 72px)' }}>
          <Eyebrow>Direct</Eyebrow>
          <a className="contact__email" href={`mailto:${profile.email}`} style={{ marginTop: 12 }}>
            {profile.email}
          </a>
        </div>

        <p className="mono" style={{ marginTop: 'clamp(28px, 4vw, 40px)' }}>
          {profile.location} · Eastern Time · replies within a day
        </p>
      </Shell>
    </section>
  );
}
