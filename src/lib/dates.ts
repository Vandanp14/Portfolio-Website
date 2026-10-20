/**
 * API dates come in two shapes: calendar dates (`2026-08-14`) from the blog
 * and résumé services, and occasional full ISO timestamps. `new Date('2026-08-14')`
 * parses as UTC midnight, which renders as the previous day in the Americas, so
 * date-only values are built from their components at local noon instead.
 */
export function parseCalendarDate(value: string): Date | null {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (dateOnly) {
    const date = new Date(
      Number(dateOnly[1]),
      Number(dateOnly[2]) - 1,
      Number(dateOnly[3]),
      12,
    );
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatCalendarDate(value: string): string {
  const date = parseCalendarDate(value);
  if (!date) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
