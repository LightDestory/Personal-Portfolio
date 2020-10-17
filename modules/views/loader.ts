import ModelView from "./modelView";
class Loader extends ModelView {
    hide(): void {
        console.log("hide loader");
        document.querySelector(".loader").classList.remove("show");
    }

    init(): void {
        console.log("not implemented");
    }

    show(): void {
        console.log("show loader");
        document.querySelector(".loader").classList.add("show");
    }

    update(v: number): void {
        const value = Math.round(v * 100) / 100;
        console.log("loader progress: ", value * 100 + "%");
        document.querySelector(".loader")['style'].width = `${value * 100}%`;
    }
}
const loaderInstance: Loader= new Loader();
export {Loader, loaderInstance}