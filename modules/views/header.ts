import ModelView from "./modelView";
import {soundSystemInstance} from "../soundsystem";
import {navigationInstance} from "../navigation";
class Header extends ModelView {
    hide(): void {
        console.log("hide header");
        const header = document.querySelector(".header").classList;
        header.remove("show");
        header.remove("shade");
    }

    init(): void {
        console.log("init header");
        document.querySelector(".logo").addEventListener("click", () => {
            console.log('logo clicked');
            soundSystemInstance.playClick();
            navigationInstance.go("home");
        });
    }

    show(): void {
        console.log("show header");
        const header = document.querySelector(".header").classList;
        header.add("show");
        header.add("shade");
    }
}
const headerInstance : Header= new Header();
export default headerInstance;