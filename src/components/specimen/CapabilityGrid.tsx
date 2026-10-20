import { skillGroups } from '../../content/portfolio';
import { SectionHead, Shell, TextLink } from './primitives';

const SHOWN = ['Backend & distributed systems', 'Front end', 'AI & data'];

export function CapabilityGrid() {
  const groups = SHOWN.map((title) => skillGroups.find((group) => group.title === title)).filter(
    (group): group is (typeof skillGroups)[number] => Boolean(group),
  );

  return (
    <section className="band band-paper section">
      <Shell>
        <SectionHead
          index="04 — Toolkit"
          title={
            <>
              Selected for the <em>problem</em>, not the trend.
            </>
          }
          note="Python and TypeScript most days, Elixir when the system has to stay up, C and C++ when the answer lives close to the metal."
        />

        <div className="caps" style={{ marginTop: 'clamp(32px, 4vw, 56px)' }}>
          {groups.map((group) => (
            <div className="cap" key={group.title}>
              <p className="h3">{group.title}</p>
              <p className="small" style={{ marginTop: 6 }}>
                {group.note}
              </p>
              <ul className="cap__list">
                {group.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 40 }}>
          <TextLink to="/about">Education, recognition and the rest of the toolkit</TextLink>
        </p>
      </Shell>
    </section>
  );
}
