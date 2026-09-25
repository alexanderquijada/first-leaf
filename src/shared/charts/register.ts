// Chart.js setup, done once. Only the pieces First Leaf uses are registered.
import {
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { colors, fonts } from '../tokens/tokens'

// Glow (BRIEF.md §6): only a dataset marked { glow: '<color>' } glows, and only the line you
// should read first (your balance) is marked. Registered after Filler, so the fills are drawn
// before the shadow is switched on and stay crisp.
const glow = {
  id: 'flGlow',
  beforeDatasetDraw(chart: Chart, args: { index: number }) {
    const color = (chart.data.datasets[args.index] as { glow?: string }).glow
    if (!color) return
    chart.ctx.save()
    chart.ctx.shadowColor = color
    chart.ctx.shadowBlur = 12
  },
  afterDatasetDraw(chart: Chart, args: { index: number }) {
    if ((chart.data.datasets[args.index] as { glow?: string }).glow) chart.ctx.restore()
  },
}

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, glow)

/** Grain (BRIEF.md §6): a speckled fill that means "money it earned", over the flat fill for
 *  "money you put in". The texture difference is the encoding, not just the color. */
export function grainPattern(ctx: CanvasRenderingContext2D, base: string, speck: string): CanvasPattern | string {
  const tile = document.createElement('canvas')
  tile.width = tile.height = 6
  const t = tile.getContext('2d')
  if (!t) return base
  t.fillStyle = base
  t.fillRect(0, 0, 6, 6)
  t.fillStyle = speck
  for (const [x, y] of [[1, 1], [4, 2], [2, 4], [5, 5]] as const) t.fillRect(x, y, 1, 1)
  return ctx.createPattern(tile, 'repeat') ?? base
}
Chart.defaults.font.family = fonts.ui
Chart.defaults.color = colors.inkMuted
Chart.defaults.animation = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : Chart.defaults.animation

export { Chart }
