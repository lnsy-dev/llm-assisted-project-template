import { expect, test, describe, beforeEach } from 'bun:test';
import { JSDOM } from 'jsdom';

// Set up JSDOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost:3000',
  pretendToBeVisual: true
});

// Set up the global environment
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.customElements = dom.window.customElements;
global.KeyboardEvent = dom.window.KeyboardEvent;

// Import the component
import '../../components/modal-component/modal-component.js';

describe('ModalComponent', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('should be defined as a custom element', () => {
    expect(customElements.get('modal-component')).toBeDefined();
  });

  test('should render basic structure', () => {
    const modal = document.createElement('modal-component');
    document.body.appendChild(modal);
    
    // Wait for connectedCallback to run
    setTimeout(() => {
      const dialog = modal.querySelector('dialog');
      expect(dialog).toBeDefined();
      expect(dialog.getAttribute('role')).toBe('dialog');
    }, 0);
  });

  test('should show modal when show() is called', () => {
    const modal = document.createElement('modal-component');
    document.body.appendChild(modal);
    modal.show();
    const dialog = document.querySelector('modal-component dialog');
    expect(dialog.style.display).not.toBe('none');
    expect(modal.hasAttribute('open')).toBeTruthy();
  });

  test('should close modal when close() is called', () => {
    const modal = document.createElement('modal-component');
    document.body.appendChild(modal);
    modal.show();
    modal.close();
    const dialog = document.querySelector('modal-component dialog');
    expect(dialog.style.display).toBe('none');
    expect(modal.hasAttribute('open')).toBeFalsy();
  });

  test('should close when close button is clicked', () => {
    const modal = document.createElement('modal-component');
    document.body.appendChild(modal);
    modal.show();
    const closeButton = document.querySelector('modal-component .close-button');
    closeButton.click();
    const dialog = document.querySelector('modal-component dialog');
    expect(dialog.style.display).toBe('none');
  });

  test('should close when escape key is pressed', () => {
    const modal = document.createElement('modal-component');
    document.body.appendChild(modal);
    modal.show();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    const dialog = document.querySelector('modal-component dialog');
    expect(dialog.style.display).toBe('none');
  });

  test('should close when backdrop is clicked', () => {
    const modal = document.createElement('modal-component');
    document.body.appendChild(modal);
    modal.show();
    const dialog = document.querySelector('modal-component dialog');
    dialog.click();
    expect(dialog.style.display).toBe('none');
  });

  test('should have proper ARIA attributes', () => {
    document.body.innerHTML = '<modal-component></modal-component>';
    const dialog = document.querySelector('modal-component dialog');
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  test('should have proper ARIA label on close button', () => {
    document.body.innerHTML = '<modal-component></modal-component>';
    const closeButton = document.querySelector('modal-component .close-button');
    expect(closeButton.getAttribute('aria-label')).toBe('Close modal');
  });
}); 