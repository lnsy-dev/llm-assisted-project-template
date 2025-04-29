import { JSDOM } from 'jsdom';

// Create a basic JSDOM instance
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');

// Set up the global environment
const { window } = dom;
const { document } = window;

// Define global properties
Object.defineProperties(global, {
  window: {
    value: window,
    writable: true,
    configurable: true
  },
  document: {
    value: document,
    writable: true,
    configurable: true
  },
  HTMLElement: {
    value: window.HTMLElement,
    writable: true,
    configurable: true
  },
  customElements: {
    value: window.customElements,
    writable: true,
    configurable: true
  }
});

// Import global styles
import '../../index.css';
import '../../components/modal-component/modal-component.css';

// Import and register components
import '../../components/modal-component/modal-component.js';
import '../../components/tab-nav/tab-nav.js'; 