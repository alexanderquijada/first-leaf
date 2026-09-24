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

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)
Chart.defaults.font.family = fonts.ui
Chart.defaults.color = colors.inkMuted
Chart.defaults.animation = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : Chart.defaults.animation

export { Chart }
