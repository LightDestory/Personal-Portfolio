import ModelView, { ViewConfig } from "./modelView";
import { soundSystemInstance } from "../../services/SoundSystem";
import { navigationInstance } from "../../core/Navigation";
import { Views } from "../ViewsManager";

class Header extends ModelView {
    private header_classes: DOMTokenList | null = null;

    constructor() {
        const config: ViewConfig = {
            id: "header",
            template: `
                <div class="header">
                    <img class="logo" src="./assets/images/favicons/favicon-150x150.png" alt="Logo">
                    <div class="header-menu">
                        <ul class="menu-items"></ul>
                    </div>
                    <div class="menu-button">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `,
            isPage: false
        };
        super(config);
    }

    hide(): void {
        console.log("hide header");
        if (!this.header_classes) {
            const element = this.getElement();
            if (element) {
                this.header_classes = element.classList;
            }
        }
        if (this.header_classes) {
            this.header_classes.remove("show");
            this.header_classes.remove("shade");
        }
    }

    init(): void {
        console.log("init header");
        const element = this.getElement();
        if (!element) return;

        this.header_classes = element.classList;

        const logo = element.querySelector(".logo");
        if (logo) {
            logo.addEventListener("click", () => {
                console.log('logo clicked');
                soundSystemInstance.playClick();
                navigationInstance.go(Views.HOME_VIEW);
            });
        }
    }

    show(): void {
        console.log("show header");
        if (!this.header_classes) {
            const element = this.getElement();
            if (element) {
                this.header_classes = element.classList;
            }
        }
        if (this.header_classes) {
            this.header_classes.add("show");
            this.header_classes.add("shade");
        }
    }
}

const headerInstance: Header = new Header();
export default headerInstance;