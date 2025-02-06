import ModelView from "./modelView";

class Loader extends ModelView {
    private loader_reference = document.querySelector(".loader")!! as HTMLElement;

    hide(): void {
        console.log("hide loader");
        this.loader_reference.classList.remove("show");
    }

    init(): void {
        console.log("not implemented");
    }

    show(): void {
        console.log("show loader");
        this.loader_reference.classList.add("show");
    }

    /**
     * Update the loader progress
     * @param value The progress value
     */
    update(value: number): void {
        value = Math.round(value * 100) / 100;
        console.log("loader progress: ", value * 100 + "%");
        this.loader_reference.style.width = `${value * 100}%`;
    }
}

const loaderInstance: Loader = new Loader();
export {Loader, loaderInstance}