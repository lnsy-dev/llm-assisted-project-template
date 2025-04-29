# Test info

- Name: Modal Component >> modal should have a semi-transparent overlay
- Location: /Users/lindseymysse/Code/llm-assisted-project-template/tests/components/modal-component.test.js:83:3

# Error details

```
Error: expect(received).toBeCloseTo(expected, precision)

Expected: 0.5
Received: 0

Expected precision:    1
Expected difference: < 0.05
Received difference:   0.5
    at /Users/lindseymysse/Code/llm-assisted-project-template/tests/components/modal-component.test.js:100:15
```

# Page snapshot

```yaml
- button "Open Modal"
- button "×"
- navigation:
  - link "search":
    - /url: "#search"
  - link "index":
    - /url: "#index"
  - link "projects":
    - /url: "#projects"
  - link "settings":
    - /url: "#settings"
- text: Search
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Modal Component', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     await page.goto('http://localhost:3000');
   6 |   });
   7 |
   8 |   test('should have a visible open button', async ({ page }) => {
   9 |     const openButton = page.locator('#openModal');
   10 |     await expect(openButton).toBeVisible();
   11 |     await expect(openButton).toHaveText('Open Modal');
   12 |   });
   13 |
   14 |   test('should show modal when open button is clicked', async ({ page }) => {
   15 |     const openButton = page.locator('#openModal');
   16 |     const modal = page.locator('#testModal .overlay');
   17 |     
   18 |     // Verify modal is initially hidden
   19 |     await expect(modal).toHaveCSS('display', 'none');
   20 |     
   21 |     // Click open button
   22 |     await openButton.click();
   23 |     
   24 |     // Verify modal is now visible
   25 |     await expect(modal).toHaveCSS('display', 'flex');
   26 |   });
   27 |
   28 |   test('modal should be positioned in the center of the viewport', async ({ page }) => {
   29 |     const openButton = page.locator('#openModal');
   30 |     const modalContent = page.locator('#testModal .content');
   31 |     
   32 |     // Open the modal
   33 |     await openButton.click();
   34 |     
   35 |     // Get viewport dimensions
   36 |     const viewport = await page.viewportSize();
   37 |     const viewportCenterX = viewport.width / 2;
   38 |     const viewportCenterY = viewport.height / 2;
   39 |     
   40 |     // Get modal content dimensions and position
   41 |     const modalBox = await modalContent.boundingBox();
   42 |     
   43 |     // Calculate modal center
   44 |     const modalCenterX = modalBox.x + (modalBox.width / 2);
   45 |     const modalCenterY = modalBox.y + (modalBox.height / 2);
   46 |     
   47 |     // Allow for some margin of error (20px)
   48 |     const margin = 20;
   49 |     
   50 |     // Verify modal content is centered
   51 |     expect(Math.abs(modalCenterX - viewportCenterX)).toBeLessThan(margin);
   52 |     expect(Math.abs(modalCenterY - viewportCenterY)).toBeLessThan(margin);
   53 |   });
   54 |
   55 |   test('modal should have a close button (X) that is visible', async ({ page }) => {
   56 |     const openButton = page.locator('#openModal');
   57 |     const closeButton = page.locator('#testModal .close');
   58 |     
   59 |     // Open the modal
   60 |     await openButton.click();
   61 |     
   62 |     // Verify close button exists and is visible
   63 |     await expect(closeButton).toBeVisible();
   64 |     await expect(closeButton).toHaveText('×');
   65 |   });
   66 |
   67 |   test('modal should close when close button is clicked', async ({ page }) => {
   68 |     const openButton = page.locator('#openModal');
   69 |     const modal = page.locator('#testModal .overlay');
   70 |     const closeButton = page.locator('#testModal .close');
   71 |     
   72 |     // Open the modal
   73 |     await openButton.click();
   74 |     await expect(modal).toHaveCSS('display', 'flex');
   75 |     
   76 |     // Click close button
   77 |     await closeButton.click();
   78 |     
   79 |     // Verify modal is hidden
   80 |     await expect(modal).toHaveCSS('display', 'none');
   81 |   });
   82 |
   83 |   test('modal should have a semi-transparent overlay', async ({ page }) => {
   84 |     const openButton = page.locator('#openModal');
   85 |     const overlay = page.locator('#testModal .overlay');
   86 |     
   87 |     // Open the modal
   88 |     await openButton.click();
   89 |     
   90 |     // Get the computed background color
   91 |     const backgroundColor = await overlay.evaluate(el => 
   92 |       window.getComputedStyle(el).backgroundColor
   93 |     );
   94 |     
   95 |     // Check if it's rgba(0, 0, 0, 0.5) or equivalent
   96 |     const [r, g, b, a] = backgroundColor.match(/[\d.]+/g).map(Number);
   97 |     expect(r).toBe(0);
   98 |     expect(g).toBe(0);
   99 |     expect(b).toBe(0);
> 100 |     expect(a).toBeCloseTo(0.5, 1);
      |               ^ Error: expect(received).toBeCloseTo(expected, precision)
  101 |   });
  102 | }); 
```