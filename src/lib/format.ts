const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** "2026-05" to "May 2026". Returns the input unchanged if it is not YYYY-MM. */
export function formatMonth(value: string): string {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(value);
  if (!match) return value;
  return `${MONTHS[Number(match[2]) - 1]} ${match[1]}`;
}

/**
 * Human-readable date range from the content files.
 * `end: "present"` reads "Present". Returns undefined when there is nothing
 * to show, so callers can skip the line instead of printing a placeholder.
 */
export function formatRange(start?: string, end?: string): string | undefined {
  const from = start ? formatMonth(start) : undefined;
  const to = end === "present" ? "Present" : end ? formatMonth(end) : undefined;
  if (from && to) return from === to ? from : `${from} – ${to}`;
  if (from) return from;
  return to;
}
