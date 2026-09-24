// First Leaf design tokens: the one source of truth for color and type.
// Values come from BRIEF.md §6. Change them here (brief first), never inline.
// applyTokens() writes them to :root as CSS variables; theme.ts feeds them to Vuetify.

export const colors = {
  cream: '#F5F0E6', // page background
  paper: '#FFFDF8', // cards on cream
  panel: '#0E1C15', // deep green-black data panels
  panelRaised: '#16291F', // cards inside panels
  ink: '#15130F', // main text (16.3:1 on cream)
  inkMuted: '#4F4A40', // secondary text (7.8:1 on cream)
  forest: '#1F5C3B', // links, key numbers, primary buttons (7.0:1 on cream)
  leaf: '#276B43', // accents (5.7:1 on cream)
  lime: '#C6F36B', // highlights, buttons with ink text, lines on panels
  mint: '#DDEFD9', // soft fills behind forest text
  onPanel: '#B9C7BE', // secondary text on panels (10.0:1 on panel)
  terracotta: '#A8431E', // "Needs you" severity, losses (always with icon + words)
  mustard: '#7A5C00', // "Heads-up" severity
  // Extra categorical colors for charts (tested for color blindness, BRIEF.md §6)
  sky: '#8FD3FF',
  periwinkle: '#6B7FD7',
  coral: '#F08A5D',
} as const

// One color per fund, for charts. Never a one-hue ramp.
export const chartColors = {
  'FL-BROAD': colors.lime,
  'FL-WORLD': colors.sky,
  'FL-BOND': colors.periwinkle,
  'FL-GREEN': colors.coral,
  'FL-CALM': colors.cream,
} as const

// Font stacks. Swapping in licensed Klim fonts later means changing these three lines.
export const fonts = {
  display: "'Newsreader Variable', Georgia, 'Times New Roman', serif",
  text: "'Newsreader Variable', Georgia, 'Times New Roman', serif",
  ui: "'Hanken Grotesk Variable', system-ui, -apple-system, 'Segoe UI', sans-serif",
} as const

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())

/** CSS variables: --color-cream, --color-ink-muted, --chart-fl-broad, --font-display, … */
export function cssVariables(): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [k, v] of Object.entries(colors)) vars[`--color-${kebab(k)}`] = v
  for (const [k, v] of Object.entries(chartColors)) vars[`--chart-${k.toLowerCase()}`] = v
  for (const [k, v] of Object.entries(fonts)) vars[`--font-${k}`] = v
  return vars
}

export function applyTokens(root: HTMLElement = document.documentElement) {
  for (const [k, v] of Object.entries(cssVariables())) root.style.setProperty(k, v)
}
