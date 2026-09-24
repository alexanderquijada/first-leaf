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
    VBtn: { class: 'text-none', style: 'letter-spacing: 0' },
  },
})

createApp(App).use(router).use(vuetify).mount('#app')
