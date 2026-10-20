import { profile } from '../content/portfolio';
import { ContactBlock } from '../components/specimen/ContactBlock';
import { Eyebrow, Shell, TextLink } from '../components/specimen/primitives';

export default function ContactPage() {
  return (
    <div className="band band-paper contact-page">
      <section className="page-intro">
        <Shell>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="display page-intro__claim" style={{ marginTop: 20 }}>
            Tell me what you are <em>building</em>.
          </h1>
          <div className="page-intro__note">
            <p className="small col-6" style={{ maxWidth: '52ch' }}>
              I read every message and reply within a day. Recruiters, engineers and people with a
              hard systems problem are all welcome.
            </p>
            <p className="small col-4 start-9 align-end">
              <TextLink href={profile.linkedin}>LinkedIn</TextLink>
              <br />
              <TextLink href={profile.github}>GitHub</TextLink>
            </p>
          </div>
        </Shell>
      </section>

      <ContactBlock index="Contact" />
    </div>
  );
}
