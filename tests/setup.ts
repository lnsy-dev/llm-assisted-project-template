import { JSDOM } from 'jsdom';

// Import global styles
import '../index.css';
import '../components/modal-component/modal-component.css';

// Set up JSDOM environment
let dom;
if (typeof window === 'undefined') {
  const { JSDOM } = await import('jsdom');
  dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost:3000',
    pretendToBeVisual: true
  });

  // @ts-ignore - JSDOM types don't perfectly match browser types
  global.document = dom.window.document;
  // @ts-ignore - JSDOM types don't perfectly match browser types
  global.window = dom.window;
  // @ts-ignore - JSDOM types don't perfectly match browser types
  global.navigator = dom.window.navigator;
}

// Set up the global environment
if (dom) {
  Object.defineProperty(globalThis, 'window', {
    value: dom.window,
    writable: true,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(globalThis, 'document', {
    value: dom.window.document,
    writable: true,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(globalThis, 'HTMLElement', {
    value: dom.window.HTMLElement,
    writable: true,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(globalThis, 'customElements', {
    value: dom.window.customElements,
    writable: true,
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(globalThis, 'KeyboardEvent', {
    value: dom.window.KeyboardEvent,
    writable: true,
    enumerable: true,
    configurable: true
  });
}

// Import the component to register custom elements
import '../components/tab-nav/tab-nav.js'; 