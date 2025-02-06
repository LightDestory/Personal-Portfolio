import ModelView from "./modelView";
import {soundSystemInstance} from "../soundsystem";
import {navigationInstance} from "../navigation";
import {Views} from "../views";

class Header extends ModelView {

    private header_classes = document.querySelector(".header")!!.classList;
    hide(): void {
        console.log("hide header");
        this.header_classes.remove("show");
        this.header_classes.remove("shade");
    }

    init(): void {
        console.log("init header");
        document.querySelector(".logo")!!.addEventListener("click", () => {
            console.log('logo clicked');
            soundSystemInstance.playClick();
            navigationInstance.go(Views.HOME_VIEW);
        });
    }

    show(): void {
        console.log("show header");
        this.header_classes.add("show");
        this.header_classes.add("shade");
    }
}

const headerInstance: Header = new Header();
export default headerInstance;