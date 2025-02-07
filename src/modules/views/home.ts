import modelView from "./modelView";
import {DataView} from "../dataset";

class Home extends modelView {
    hide(): void {
        console.log("not implemented");
    }

    init(): void {
        console.log("init home");
        const data_view = DataView.home;
        document.querySelector(".home .page-title")!!.innerHTML = data_view.title;
        document.querySelector(".home .page-akatitle")!!.innerHTML = data_view.subtitle;
        document.querySelector(".home .page-subtitle")!!.innerHTML = data_view.subtitle2;
    }

    show(): void {
        console.log("not implemented");
    }

}

const homeInstance: Home = new Home();
export {Home, homeInstance}