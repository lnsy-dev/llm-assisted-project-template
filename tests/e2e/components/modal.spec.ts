import { test, expect } from '../../setup/e2e.setup';

test.describe('Modal Component', () => {
  test.beforeEach(async ({ page }) => {
    // Set up the test page with the modal component
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            dialog {
              padding: 1rem;
              max-width: 80vw;
              max-height: 80vh;
              border: none;
              border-radius: 4px;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            }

            dialog::backdrop {
              background: rgba(0, 0, 0, 0.5);
            }

            .close-button {
              position: absolute;
              top: 10px;
              right: 10px;
              border: none;
              background: none;
              font-size: 24px;
              cursor: pointer;
              padding: 5px;
            }
          </style>
        </head>
        <body>
          <modal-component open>
            <h1>Dataroom</h1>
          </modal-component>
          <script>
            class ModalComponent extends HTMLElement {
              constructor() {
                super();
                this.initialized = false;
              }

              connectedCallback() {
                if (!this.initialized) {
                  this.initialized = true;
                  this.render();
                  this.setupEventListeners();
                  
                  if (this.hasAttribute('open')) {
                    this.show();
                  }
                }
              }

              static get observedAttributes() {
                return ['open'];
              }

              attributeChangedCallback(name, oldValue, newValue) {
                if (name === 'open') {
                  if (newValue === 'true') {
                    this.show();
                  } else {
                    this.close();
                  }
                }
              }

              render() {
                const dialog = document.createElement('dialog');
                dialog.setAttribute('role', 'dialog');
                dialog.setAttribute('aria-modal', 'true');

                const closeButton = document.createElement('button');
                closeButton.className = 'close-button';
                closeButton.setAttribute('aria-label', 'Close modal');
                closeButton.textContent = '×';

                const content = document.createElement('div');
                content.className = 'content';

                while (this.firstChild) {
                  content.appendChild(this.firstChild);
                }

                dialog.appendChild(closeButton);
                dialog.appendChild(content);
                
                this.innerHTML = '';
                this.appendChild(dialog);
              }

              setupEventListeners() {
                const dialog = this.querySelector('dialog');
                const closeButton = this.querySelector('.close-button');

                closeButton.addEventListener('click', () => {
                  this.close();
                });

                dialog.addEventListener('keydown', (e) => {
                  if (e.key === 'Escape') {
                    this.close();
                  }
                });

                dialog.addEventListener('click', (e) => {
                  if (e.target === dialog) {
                    this.close();
                  }
                });
              }

              show() {
                const dialog = this.querySelector('dialog');
                if (dialog) {
                  dialog.showModal();
                  this.setAttribute('open', 'true');
                }
              }

              close() {
                const dialog = this.querySelector('dialog');
                if (dialog) {
                  dialog.close();
                  this.removeAttribute('open');
                }
              }
            }

            if (!customElements.get('modal-component')) {
              customElements.define('modal-component', ModalComponent);
            }
          </script>
        </body>
      </html>
    `);

    // Wait for the custom element to be defined
    await page.waitForFunction(() => customElements.get('modal-component'));
    
    // Wait a bit for the component to render
    await page.waitForTimeout(100);
  });

  test('should show modal on page load', async ({ page }) => {
    const modal = page.locator('modal-component dialog');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
  });

  test('should close modal when close button is clicked', async ({ page }) => {
    const modal = page.locator('modal-component dialog');
    const closeButton = page.locator('modal-component .close-button');
    
    await expect(modal).toBeVisible();
    await closeButton.click();
    await expect(modal).not.toBeVisible();
  });

  test('should close modal when escape key is pressed', async ({ page }) => {
    const modal = page.locator('modal-component dialog');
    
    await expect(modal).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('should close modal when backdrop is clicked', async ({ page }) => {
    const modal = page.locator('modal-component dialog');
    
    await expect(modal).toBeVisible();
    await modal.click({ position: { x: 10, y: 10 } });
    await expect(modal).not.toBeVisible();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const modal = page.locator('modal-component dialog');
    
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
  });

  test('should contain correct content', async ({ page }) => {
    const modal = page.locator('modal-component dialog');
    const modalContent = page.locator('modal-component dialog h1');
    
    await expect(modal).toBeVisible();
    await expect(modalContent).toHaveText('Dataroom');
  });
}); 