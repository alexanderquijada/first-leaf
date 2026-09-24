// The app's main navigation, shared by the desktop rail, the tablet tabs and
// the phone's bottom tab bar (BRIEF.md §3).

export interface NavItem {
  to: string
  /** Label in the rail and tabs. */
  label: string
  /** Shorter label for the phone's bottom tab bar. */
  short: string
  icon: string
  /** Whether the phone's bottom tab bar shows it (Funds is reached from Home). */
  onPhone: boolean
  /** Paths that count as "here" for this item on the rail and tabs. */
  matches: (path: string) => boolean
  /** Paths that count as "here" on the phone (Home also covers Alerts and Funds). */
  matchesOnPhone: (path: string) => boolean
}

import copy from './copy.json'

const N = copy.nav
const under = (base: string) => (p: string) => p === base || p.startsWith(base + '/')

export const mainNav: NavItem[] = [
  {
    to: '/',
    ...N.home,
    icon: 'mdi-home-outline',
    onPhone: true,
    matches: (p) => p === '/' || under('/alerts')(p),
    matchesOnPhone: (p) => p === '/' || under('/alerts')(p) || under('/funds')(p),
  },
  { to: '/activity', ...N.activity, icon: 'mdi-format-list-bulleted', onPhone: true, matches: under('/activity'), matchesOnPhone: under('/activity') },
  { to: '/funds', ...N.funds, icon: 'mdi-chart-donut', onPhone: false, matches: under('/funds'), matchesOnPhone: () => false },
  { to: '/story', ...N.story, icon: 'mdi-book-open-page-variant-outline', onPhone: true, matches: under('/story'), matchesOnPhone: under('/story') },
  { to: '/practice', ...N.practice, icon: 'mdi-flask-outline', onPhone: true, matches: under('/practice'), matchesOnPhone: under('/practice') },
  { to: '/learn', ...N.learn, icon: 'mdi-alphabetical-variant', onPhone: true, matches: under('/learn'), matchesOnPhone: under('/learn') },
]
