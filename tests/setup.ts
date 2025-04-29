import { JSDOM } from 'jsdom';

// Create a new JSDOM instance with proper configuration
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost:3636',
  pretendToBeVisual: true,
  resources: 'usable'
});

// Set up the global environment with proper typing
const { window } = dom;
const { document } = window;

// Define global properties with proper typing
Object.defineProperties(global, {
  window: {
    value: window,
    writable: true,
    enumerable: true,
    configurable: true
  },
  document: {
    value: document,
    writable: true,
    enumerable: true,
    configurable: true
  },
  HTMLElement: {
    value: window.HTMLElement,
    writable: true,
    enumerable: true,
    configurable: true
  },
  customElements: {
    value: window.customElements,
    writable: true,
    enumerable: true,
    configurable: true
  },
  Event: {
    value: window.Event,
    writable: true,
    enumerable: true,
    configurable: true
  },
  CustomEvent: {
    value: window.CustomEvent,
    writable: true,
    enumerable: true,
    configurable: true
  },
  KeyboardEvent: {
    value: window.KeyboardEvent,
    writable: true,
    enumerable: true,
    configurable: true
  },
  MouseEvent: {
    value: window.MouseEvent,
    writable: true,
    enumerable: true,
    configurable: true
  }
});

// Import global styles
import '../index.css';
import '../components/modal-component/modal-component.css';

// Import and register components
import '../components/tab-nav/tab-nav.js';
import '../components/modal-component/modal-component.js'; 