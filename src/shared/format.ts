// Date formatting in First Leaf's house style (AP-style abbreviations).

const MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']
const DAYS = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.']

/** "2026-09-18" → "Sept. 18" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y!, m! - 1, d!))
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`
}

/** "2026-09-18" → "Fri., Sept. 18" */
export function formatDayDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y!, m! - 1, d!))
  return `${DAYS[date.getUTCDay()]}, ${formatDate(iso)}`
}
