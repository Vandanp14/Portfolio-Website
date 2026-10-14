import { profile } from '../content/portfolio';

/** Two offset squares — a layered-systems mark — beside the name. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="flex-none">
        <rect x="0.5" y="0.5" width="11" height="11" stroke="currentColor" />
        <rect x="6.5" y="6.5" width="11" height="11" fill="currentColor" />
      </svg>
      <span className="text-[19px] leading-none tracking-[-0.035em]">{profile.name}</span>
    </span>
  );
}
