// Import all components
import './components/component-template/component-template.js';
import './components/tab-nav/tab-nav.js';
import './components/modal-component/modal-component.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialized');
    
    // Create and show splash modal
    const splashModal = document.createElement('modal-component');
    splashModal.innerHTML = `
        <h1 style="font-size: var(--font-size-4xl); margin-bottom: var(--spacing-6); text-align: center;">Dataroom</h1>
        <div style="text-align: center;">
            <button class="okay-button" style="
                padding: var(--spacing-2) var(--spacing-6);
                background-color: hsl(var(--primary-hue), var(--color-saturation), 50%);
                color: white;
                border: none;
                border-radius: var(--radius-md);
                cursor: pointer;
                font-size: var(--font-size-base);
            ">Okay</button>
        </div>
    `;
    
    document.body.appendChild(splashModal);
    
    // Show the modal after a short delay
    setTimeout(() => {
        splashModal.show();
    }, 100);
    
    // Add click handler for the okay button
    const okayButton = splashModal.querySelector('.okay-button');
    okayButton.addEventListener('click', () => {
        splashModal.close();
        // Remove the modal from DOM after animation completes
        setTimeout(() => {
            splashModal.remove();
        }, 300);
    });
}); 