const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** '2025-11' -> 'Nov 2025'. 'present' passes through as 'Present'. */
export function formatMonth(value: string): string {
  if (value === 'present') return 'Present';
  const [year, month] = value.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

/** '2025-11' -> '2025'. 'present' -> 'Now'. */
export function formatYear(value: string): string {
  return value === 'present' ? 'Now' : value.slice(0, 4);
}

export function yearRange(start: string, end: string): string {
  const from = formatYear(start);
  const to = formatYear(end);
  return from === to ? from : `${from} – ${to}`;
}

export function fullRange(start: string, end: string): string {
  return `${formatMonth(start)} – ${formatMonth(end)}`;
}
