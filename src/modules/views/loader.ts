import ModelView, { ViewConfig } from "./modelView";

class Loader extends ModelView {
    private loader_reference: HTMLElement | null = null;

    constructor() {
        const config: ViewConfig = {
            id: "loader",
            template: `<div class="loader"></div>`,
            isPage: false
        };
        super(config);
    }

    hide(): void {
        console.log("hide loader");
        if (!this.loader_reference) {
            this.loader_reference = this.getElement();
        }
        if (this.loader_reference) {
            this.loader_reference.classList.remove("show");
        }
    }

    init(): void {
        console.log("not implemented");
        this.loader_reference = this.getElement();
    }

    show(): void {
        console.log("show loader");
        if (!this.loader_reference) {
            this.loader_reference = this.getElement();
        }
        if (this.loader_reference) {
            this.loader_reference.classList.add("show");
        }
    }

    /**
     * Update the loader progress
     * @param value The progress value
     */
    update(value: number): void {
        value = Math.round(value * 100) / 100;
        console.log("loader progress: ", value * 100 + "%");
        if (!this.loader_reference) {
            this.loader_reference = this.getElement();
        }
        if (this.loader_reference) {
            this.loader_reference.style.width = `${value * 100}%`;
        }
    }
}

const loaderInstance: Loader = new Loader();
export { Loader, loaderInstance }