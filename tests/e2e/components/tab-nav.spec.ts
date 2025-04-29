import { test, expect } from '../../setup/e2e.setup';

test.describe('Tab Navigation Component', () => {
  test.beforeEach(async ({ page }) => {
    // Set up the test page with the tab navigation component
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .tab-nav-menu {
              display: flex;
              gap: 1rem;
              padding: 1rem;
              border-bottom: 1px solid #ccc;
            }
            
            .tab-nav-menu a {
              text-decoration: none;
              color: #666;
              padding: 0.5rem 1rem;
              border-radius: 4px;
            }
            
            .tab-nav-menu a.active {
              background: #007bff;
              color: white;
            }
            
            .tab-pane {
              display: none;
              padding: 1rem;
            }
            
            .tab-pane.active {
              display: block;
            }
          </style>
        </head>
        <body>
          <tab-nav-menu target="nav-tabs"></tab-nav-menu>
          <tab-nav-body id="nav-tabs">
            <tab-nav-item name="search">Search Content</tab-nav-item>
            <tab-nav-item name="index">Index Content</tab-nav-item>
            <tab-nav-item name="projects">Projects Content</tab-nav-item>
            <tab-nav-item name="settings">Settings Content</tab-nav-item>
          </tab-nav-body>

          <script>
            class TabNavMenu extends HTMLElement {
              constructor() {
                super();
              }

              connectedCallback() {
                this.render();
                this.setupEventListeners();
              }

              render() {
                const targetId = this.getAttribute('target');
                const target = document.getElementById(targetId);
                if (!target) return;

                const items = target.querySelectorAll('tab-nav-item');
                const nav = document.createElement('nav');
                nav.className = 'tab-nav-menu';

                items.forEach((item, index) => {
                  const name = item.getAttribute('name');
                  const link = document.createElement('a');
                  link.href = '#' + name;
                  link.textContent = name;
                  link.dataset.index = index;
                  nav.appendChild(link);
                });

                this.appendChild(nav);
                
                // Set first tab as active by default
                if (items.length > 0) {
                  this.setActiveTab(items[0]);
                }
              }

              setupEventListeners() {
                this.addEventListener('click', (e) => {
                  if (e.target.tagName === 'A') {
                    e.preventDefault();
                    const targetId = this.getAttribute('target');
                    const target = document.getElementById(targetId);
                    const items = target.querySelectorAll('tab-nav-item');
                    const index = parseInt(e.target.dataset.index);
                    this.setActiveTab(items[index]);
                  }
                });

                document.addEventListener('keydown', (e) => {
                  if (e.ctrlKey) {
                    const key = parseInt(e.key, 10);
                    if (key >= 1 && key <= 9) {
                      this.activateTabByIndex(key - 1);
                    } else if (e.key === '0') {
                      this.activateTabByIndex(9);
                    }
                  }
                });
              }

              clearActiveTabs() {
                const targetId = this.getAttribute('target');
                const target = document.getElementById(targetId);
                
                this.querySelectorAll('a').forEach(link => {
                  link.classList.remove('active');
                });
                
                target.querySelectorAll('tab-nav-item').forEach(item => {
                  item.classList.remove('active');
                });
              }

              setActiveTab(item) {
                this.clearActiveTabs();
                
                item.classList.add('active');
                
                const name = item.getAttribute('name');
                const link = this.querySelector('a[href="#' + name + '"]');
                if (link) {
                  link.classList.add('active');
                }
                
                this.dispatchEvent(new CustomEvent('active-tab-set', {
                  detail: { activeTab: item }
                }));
              }

              activateTabByIndex(index) {
                const targetId = this.getAttribute('target');
                const target = document.getElementById(targetId);
                const items = target.querySelectorAll('tab-nav-item');
                
                if (index >= 0 && index < items.length) {
                  this.setActiveTab(items[index]);
                }
              }
            }

            class TabNavBody extends HTMLElement {
              constructor() {
                super();
              }

              connectedCallback() {
                this.classList.add('tab-content');
              }
            }

            class TabNavItem extends HTMLElement {
              constructor() {
                super();
              }

              connectedCallback() {
                this.classList.add('tab-pane');
              }
            }

            if (!customElements.get('tab-nav-menu')) {
              customElements.define('tab-nav-menu', TabNavMenu);
            }
            if (!customElements.get('tab-nav-body')) {
              customElements.define('tab-nav-body', TabNavBody);
            }
            if (!customElements.get('tab-nav-item')) {
              customElements.define('tab-nav-item', TabNavItem);
            }
          </script>
        </body>
      </html>
    `);

    // Wait for custom elements to be defined
    await page.waitForFunction(() => 
      customElements.get('tab-nav-menu') && 
      customElements.get('tab-nav-body') && 
      customElements.get('tab-nav-item')
    );
  });

  test('should render all tabs with first tab active by default', async ({ page }) => {
    const tabLinks = page.locator('.tab-nav-menu a');
    await expect(tabLinks).toHaveCount(4);
    
    // Check if first tab is active
    const firstTab = page.locator('tab-nav-item[name="search"]');
    const firstTabLink = page.locator('.tab-nav-menu a[href="#search"]');
    
    await expect(firstTab).toHaveClass(/active/);
    await expect(firstTabLink).toHaveClass(/active/);
    await expect(firstTab).toBeVisible();
  });

  test('should switch tabs when clicking navigation links', async ({ page }) => {
    // Click the projects tab
    await page.click('.tab-nav-menu a[href="#projects"]');
    
    // Verify projects tab is active
    const projectsTab = page.locator('tab-nav-item[name="projects"]');
    const projectsLink = page.locator('.tab-nav-menu a[href="#projects"]');
    
    await expect(projectsTab).toHaveClass(/active/);
    await expect(projectsLink).toHaveClass(/active/);
    await expect(projectsTab).toBeVisible();
    
    // Verify previous tab is not active
    const searchTab = page.locator('tab-nav-item[name="search"]');
    await expect(searchTab).not.toHaveClass(/active/);
  });

  test('should switch tabs using keyboard shortcuts', async ({ page }) => {
    // Press Ctrl+2 to switch to second tab
    await page.keyboard.press('Control+2');
    
    // Verify index tab is active
    const indexTab = page.locator('tab-nav-item[name="index"]');
    const indexLink = page.locator('.tab-nav-menu a[href="#index"]');
    
    await expect(indexTab).toHaveClass(/active/);
    await expect(indexLink).toHaveClass(/active/);
    await expect(indexTab).toBeVisible();
    
    // Press Ctrl+4 to switch to fourth tab
    await page.keyboard.press('Control+4');
    
    // Verify settings tab is active
    const settingsTab = page.locator('tab-nav-item[name="settings"]');
    const settingsLink = page.locator('.tab-nav-menu a[href="#settings"]');
    
    await expect(settingsTab).toHaveClass(/active/);
    await expect(settingsLink).toHaveClass(/active/);
    await expect(settingsTab).toBeVisible();
  });

  test('should show correct content for each tab', async ({ page }) => {
    // Check initial tab content
    await expect(page.locator('tab-nav-item[name="search"]')).toContainText('Search Content');
    
    // Switch to projects tab and check content
    await page.click('.tab-nav-menu a[href="#projects"]');
    await expect(page.locator('tab-nav-item[name="projects"]')).toContainText('Projects Content');
    
    // Switch to settings tab and check content
    await page.click('.tab-nav-menu a[href="#settings"]');
    await expect(page.locator('tab-nav-item[name="settings"]')).toContainText('Settings Content');
  });

  test('should maintain tab state when switching between tabs', async ({ page }) => {
    // Click through all tabs in sequence
    const tabSequence = ['index', 'projects', 'settings', 'search'];
    
    for (const tabName of tabSequence) {
      await page.click(`.tab-nav-menu a[href="#${tabName}"]`);
      
      // Verify current tab is active
      const currentTab = page.locator(`tab-nav-item[name="${tabName}"]`);
      const currentLink = page.locator(`.tab-nav-menu a[href="#${tabName}"]`);
      
      await expect(currentTab).toHaveClass(/active/);
      await expect(currentLink).toHaveClass(/active/);
      await expect(currentTab).toBeVisible();
      
      // Verify other tabs are not active
      for (const otherTab of tabSequence.filter(t => t !== tabName)) {
        await expect(page.locator(`tab-nav-item[name="${otherTab}"]`)).not.toHaveClass(/active/);
      }
    }
  });
}); 