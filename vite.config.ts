import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Imports only the Vuetify components we use, so the bundle stays small.
    vuetify({ autoImport: true }),
    vueDevTools(),
  ],
  resolve: {
    alias: [
      // Test-only builds (FL_DATA_DIR, used by the big-move Playwright project) read the
      // app's data from a fixture folder. The shipped build never sets it, and
      // `npm run check:fixtures` proves no fixture reaches dist/.
      ...(process.env.FL_DATA_DIR
        ? [{ find: /^@\/shared\/data\/([\w-]+\.json)$/, replacement: `${fileURLToPath(new URL(`./${process.env.FL_DATA_DIR}/`, import.meta.url))}$1` }]
        : []),
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  },
})
