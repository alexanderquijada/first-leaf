import { defineConfig, devices } from '@playwright/test'

// Tests run against the production build (vite preview), not the dev server,
// so they see what Vercel serves.
// A second, TEST-ONLY build reads its data from tests/fixtures/big-move/ (a week where a
// holding moved 9%), to prove the big-move alert. It is built into dist-test/, never dist/,
// and `npm run check:fixtures` proves no fixture reaches the shipped build.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', testIgnore: '**/big-move/**', use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4173' } },
    { name: 'big-move', testMatch: '**/big-move/**', use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4174' } },
  ],
  webServer: [
    {
      command: 'npm run build-only && npm run preview -- --port 4173 --strictPort',
      url: 'http://localhost:4173',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'FL_DATA_DIR=tests/fixtures/big-move npx vite build --outDir dist-test/big-move --emptyOutDir --logLevel error && npx vite preview --outDir dist-test/big-move --port 4174 --strictPort',
      url: 'http://localhost:4174',
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
})
