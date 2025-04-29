import { test, expect } from '@playwright/test';

test.describe('ModalComponent', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.addScriptTag({ path: './components/modal-component/modal-component.js' });
    await page.addStyleTag({ path: './components/modal-component/modal-component.css' });
  });

  test('should be defined as a custom element', async ({ page }) => {
    const isDefined = await page.evaluate(() => {
      return customElements.get('modal-component') !== undefined;
    });
    expect(isDefined).toBeTruthy();
  });

  test('should render the dialog element', async ({ page }) => {
    await page.evaluate(() => {
      document.body.innerHTML = '<modal-component></modal-component>';
    });
    const dialog = await page.locator('modal-component dialog');
    await expect(dialog).toHaveAttribute('role', 'dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('should show modal when show() is called', async ({ page }) => {
    await page.evaluate(() => {
      const modal = document.createElement('modal-component');
      document.body.appendChild(modal);
      modal.show();
    });
    const dialog = await page.locator('modal-component dialog');
    await expect(dialog).toBeVisible();
    const isOpen = await page.evaluate(() => {
      const modal = document.querySelector('modal-component');
      return modal.hasAttribute('open');
    });
    expect(isOpen).toBeTruthy();
  });

  test('should close modal when close() is called', async ({ page }) => {
    await page.evaluate(() => {
      const modal = document.createElement('modal-component');
      document.body.appendChild(modal);
      modal.show();
      modal.close();
    });
    const dialog = await page.locator('modal-component dialog');
    await expect(dialog).not.toBeVisible();
    const isOpen = await page.evaluate(() => {
      const modal = document.querySelector('modal-component');
      return modal.hasAttribute('open');
    });
    expect(isOpen).toBeFalsy();
  });

  test('should close when close button is clicked', async ({ page }) => {
    await page.evaluate(() => {
      const modal = document.createElement('modal-component');
      document.body.appendChild(modal);
      modal.show();
    });
    const closeButton = await page.locator('modal-component .close-button');
    await closeButton.click();
    const dialog = await page.locator('modal-component dialog');
    await expect(dialog).not.toBeVisible();
  });

  test('should close when escape key is pressed', async ({ page }) => {
    await page.evaluate(() => {
      const modal = document.createElement('modal-component');
      document.body.appendChild(modal);
      modal.show();
    });
    await page.keyboard.press('Escape');
    const dialog = await page.locator('modal-component dialog');
    await expect(dialog).not.toBeVisible();
  });

  test('should close when backdrop is clicked', async ({ page }) => {
    await page.evaluate(() => {
      const modal = document.createElement('modal-component');
      document.body.appendChild(modal);
      modal.show();
    });
    const dialog = await page.locator('modal-component dialog');
    await dialog.click({ position: { x: 0, y: 0 } });
    await expect(dialog).not.toBeVisible();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.evaluate(() => {
      document.body.innerHTML = '<modal-component></modal-component>';
    });
    const dialog = await page.locator('modal-component dialog');
    await expect(dialog).toHaveAttribute('role', 'dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('should have proper ARIA label on close button', async ({ page }) => {
    await page.evaluate(() => {
      document.body.innerHTML = '<modal-component></modal-component>';
    });
    const closeButton = await page.locator('modal-component .close-button');
    await expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
  });
}); 