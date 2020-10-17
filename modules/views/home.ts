import modelView from "./modelView";
import {DataView} from "../dataset";
class Home extends modelView {
    hide(): void {
        console.log("not implemented");
    }

    init(): void {
        console.log("init home");
        const collection = DataView.home;
        document.querySelector(".home .page-title").innerHTML = collection.title;
        document.querySelector(".home .page-akatitle").innerHTML = collection.subtitle;
        document.querySelector(".home .page-subtitle").innerHTML = collection.subtitle2;
    }

    show(): void {
        console.log("not implemented");
    }

}
const homeInstance: Home = new Home();
export {Home, homeInstance}