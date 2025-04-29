import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

type Fixtures = {
  page: Page;
};

// Extend the base test with custom fixtures
export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    // Set up page configuration
    await page.setViewportSize({ width: 1280, height: 720 });
    await use(page);
  }
});

// Export expect for convenience
export { expect }; 