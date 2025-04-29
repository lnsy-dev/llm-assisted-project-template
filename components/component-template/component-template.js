class ComponentTemplate extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .component-template {
                    padding: 20px;
                    border: 1px solid var(--secondary-color);
                    border-radius: 4px;
                    margin: 10px 0;
                }

                .component-template h2 {
                    color: var(--primary-color);
                    margin-bottom: 10px;
                }
            </style>
            <div class="component-template">
                <h2>Component Template</h2>
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('component-template', ComponentTemplate); 