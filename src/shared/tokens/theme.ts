import type { ThemeDefinition } from 'vuetify'
import { colors } from './tokens'

// The First Leaf light theme for Vuetify. Colors come from tokens.ts only.
export const firstLeaf: ThemeDefinition = {
  dark: false,
  colors: {
    background: colors.cream,
    surface: colors.paper,
    'on-background': colors.ink,
    'on-surface': colors.ink,
    primary: colors.forest,
    'on-primary': colors.paper,
    secondary: colors.leaf,
    'on-secondary': colors.paper,
    error: colors.terracotta,
    warning: colors.mustard,
    info: colors.forest,
    success: colors.leaf,
    cream: colors.cream,
    paper: colors.paper,
    panel: colors.panel,
    'on-panel': colors.onPanel,
    'panel-raised': colors.panelRaised,
    ink: colors.ink,
    'ink-muted': colors.inkMuted,
    forest: colors.forest,
    leaf: colors.leaf,
    lime: colors.lime,
    'on-lime': colors.ink,
    mint: colors.mint,
    terracotta: colors.terracotta,
    mustard: colors.mustard,
  },
  variables: {
    // Vuetify draws text at 87% / 60% opacity by default, which quietly lowers
    // contrast. Our muted color is its own token, so text stays fully opaque.
    'high-emphasis-opacity': 1,
    'medium-emphasis-opacity': 1,
  },
}
