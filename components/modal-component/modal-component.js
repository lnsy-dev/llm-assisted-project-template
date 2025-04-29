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
      
      // Check if modal should be open by default
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

    // Create a container for the existing content
    const content = document.createElement('div');
    content.className = 'content';

    // Move all existing children into the content div
    while (this.firstChild) {
      content.appendChild(this.firstChild);
    }

    // Add the close button and content to the dialog
    dialog.appendChild(closeButton);
    dialog.appendChild(content);
    
    // Clear the component and add the dialog
    this.innerHTML = '';
    this.appendChild(dialog);
  }

  setupEventListeners() {
    const dialog = this.querySelector('dialog');
    const closeButton = this.querySelector('.close-button');

    closeButton.addEventListener('click', () => {
      this.close();
    });

    // Close on escape key
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });

    // Close on backdrop click
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

// Define the custom element
if (!customElements.get('modal-component')) {
  customElements.define('modal-component', ModalComponent);
} 