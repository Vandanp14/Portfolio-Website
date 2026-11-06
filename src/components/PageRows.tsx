import { Link } from './Link';

export type PageRow = { label: string; to: string };

/** Hairline rows, one per link, with a right arrow. */
export function PageRows({ rows }: { rows: PageRow[] }) {
  return (
    <ul className="border-b border-[var(--line)]">
      {rows.map((row) => (
        <li key={row.to}>
          <Link to={row.to} className="page-row">
            <span>{row.label}</span>
            <span aria-hidden="true" className="text-[var(--text-3)]">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
