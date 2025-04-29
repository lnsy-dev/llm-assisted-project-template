/// <reference types="bun-types" />

import { describe, expect, test, beforeEach } from 'bun:test';
import { HTMLElement, document, window, customElements } from 'bun:test';

// Import the component to register custom elements
import '../components/tab-nav/tab-nav.js';

describe('Tab Navigation', () => {
  let container: HTMLElement;
  let tabNavMenu: HTMLElement;
  let tabNavBody: HTMLElement;

  beforeEach(() => {
    // Setup the DOM environment
    container = document.createElement('div');
    container.id = 'app';
    document.body.appendChild(container);

    // Create tab navigation structure
    tabNavMenu = document.createElement('tab-nav-menu');
    tabNavMenu.setAttribute('target', 'nav-tabs');

    tabNavBody = document.createElement('tab-nav-body');
    tabNavBody.id = 'nav-tabs';

    // Add tab items
    const tabItems = ['search', 'index', 'projects', 'settings'];
    tabItems.forEach(name => {
      const tabItem = document.createElement('tab-nav-item');
      tabItem.setAttribute('name', name);
      tabItem.textContent = name.charAt(0).toUpperCase() + name.slice(1);
      tabNavBody.appendChild(tabItem);
    });

    container.appendChild(tabNavMenu);
    container.appendChild(tabNavBody);
  });

  test('should render all tabs', () => {
    const tabs = tabNavBody.querySelectorAll('tab-nav-item');
    expect(tabs.length).toBe(4);
    
    const tabNames = Array.from(tabs).map(tab => tab.getAttribute('name'));
    expect(tabNames).toEqual(['search', 'index', 'projects', 'settings']);
  });

  test('should set first tab as active by default', () => {
    // Force a re-render to trigger the connectedCallback
    container.innerHTML = container.innerHTML;
    const firstTab = tabNavBody.querySelector('tab-nav-item[name="search"]');
    expect(firstTab?.classList.contains('active')).toBe(true);
  });

  test('should switch tabs on click', () => {
    // Force a re-render to trigger the connectedCallback
    container.innerHTML = container.innerHTML;
    const projectsLink = tabNavMenu.querySelector('a[href="#projects"]') as HTMLAnchorElement;
    projectsLink?.click();
    
    const projectsTab = tabNavBody.querySelector('tab-nav-item[name="projects"]');
    const searchTab = tabNavBody.querySelector('tab-nav-item[name="search"]');
    
    expect(projectsTab?.classList.contains('active')).toBe(true);
    expect(searchTab?.classList.contains('active')).toBe(false);
  });

  test('should support keyboard shortcuts', () => {
    // Force a re-render to trigger the connectedCallback
    container.innerHTML = container.innerHTML;

    // Simulate Ctrl+2 keypress
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: '2',
      ctrlKey: true
    }));

    const indexTab = tabNavBody.querySelector('tab-nav-item[name="index"]');
    expect(indexTab?.classList.contains('active')).toBe(true);
    
    // Simulate Ctrl+4 keypress
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: '4',
      ctrlKey: true
    }));

    const settingsTab = tabNavBody.querySelector('tab-nav-item[name="settings"]');
    expect(settingsTab?.classList.contains('active')).toBe(true);
  });
}); 