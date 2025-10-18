/**
 * Configuration interface for views
 * @interface ViewConfig
 * @property {string} id - The unique identifier for the view (used as CSS class)
 * @property {string} template - The HTML template for the view
 * @property {boolean} isPage - Whether this view is a page (with page class and hide/show animations)
 */
export interface ViewConfig {
    id: string;
    template: string;
    isPage: boolean;
}

export default abstract class ModelView {
    protected config: ViewConfig;

    constructor(config: ViewConfig) {
        this.config = config;
    }

    /**
     * Get the view configuration
     * @returns The view configuration
     */
    getConfig(): ViewConfig {
        return this.config;
    }

    /**
     * Get the view's DOM element
     * @returns The view's DOM element or null if not found
     */
    protected getElement(): HTMLElement | null {
        return document.querySelector(`.${this.config.id}`);
    }

    // Init the view
    abstract init(): void;
    // Show the view
    abstract show(): void;
    // Hide the view
    abstract hide(): void;
}