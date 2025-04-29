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
      link.href = `#${name}`;
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

    // Keyboard shortcuts
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
    
    // Clear active state from all tab links
    this.querySelectorAll('a').forEach(link => {
      link.classList.remove('active');
    });
    
    // Clear active state from all tab items
    target.querySelectorAll('tab-nav-item').forEach(item => {
      item.classList.remove('active');
    });
  }

  setActiveTab(item) {
    this.clearActiveTabs();
    
    // Set active state on the tab item
    item.classList.add('active');
    
    // Set active state on the corresponding link
    const name = item.getAttribute('name');
    const link = this.querySelector(`a[href="#${name}"]`);
    if (link) {
      link.classList.add('active');
    }
    
    // Dispatch custom event
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

if (typeof customElements !== 'undefined') {
  customElements.define('tab-nav-menu', TabNavMenu);
  customElements.define('tab-nav-body', TabNavBody);
  customElements.define('tab-nav-item', TabNavItem);
} 