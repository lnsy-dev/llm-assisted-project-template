const config = {
  testDir: './tests',
  testMatch: '**/*.test.js',
  webServer: {
    command: 'bun run server.js',
    port: 3000,
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
};

export default config; 