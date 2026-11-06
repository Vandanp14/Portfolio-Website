import { experience } from '../content/portfolio';
import { Meta } from './primitives';

export function Experience() {
  return (
    <ol>
      {experience.map((role, index) => (
        <li key={role.company} className={index === 0 ? '' : 'mt-12 border-t border-[var(--line)] pt-12'}>
          <h2 className="t-section text-[var(--text)]">
            {role.company}, {role.title}
          </h2>
          <Meta className="mt-1">
            {role.period} · {role.location}
          </Meta>
          <p className="mt-4 text-[var(--text-2)]">{role.summary}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--text-2)] marker:text-[var(--text-3)]">
            {role.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <Meta className="mt-4">{role.stack.join(', ')}</Meta>
        </li>
      ))}
    </ol>
  );
}
