import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import '@/shared/tokens/fonts'
import '@/shared/tokens/base.css'
import { applyTokens } from '@/shared/tokens/tokens'
import { firstLeaf } from '@/shared/tokens/theme'

import App from './App.vue'
import router from './router'

applyTokens()

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'firstLeaf',
    themes: { firstLeaf },
  },
  defaults: {
    // Sentence-case buttons, no Material all-caps.
    // Pill buttons (BRIEF.md §6: lime pill buttons, the Finovia reference).
    VBtn: { class: 'text-none', style: 'letter-spacing: 0', rounded: 'pill' },
  },
})

createApp(App).use(router).use(vuetify).mount('#app')
