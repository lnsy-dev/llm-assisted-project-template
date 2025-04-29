import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  webServer: {
    command: 'bun run server.js',
    port: 5454,
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://localhost:5454',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [
    ['html', { outputFolder: 'tests/__fixtures__/test-results/playwright-report' }],
    ['json', { outputFile: 'tests/__fixtures__/test-results/test-results.json' }]
  ],
  outputDir: 'tests/__fixtures__/test-results',
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
}); 