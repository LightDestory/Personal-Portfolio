import modelView, { ViewConfig } from "./modelView";
import { DataView } from "../dataset";

class Home extends modelView {
    constructor() {
        const config: ViewConfig = {
            id: "home",
            template: `
                <!-- bars -->
                <div class="home-bar top-bar"></div>
                <div class="home-bar bottom-bar"></div>
                <!-- end bars -->
                <div class="home page hide">
                    <div class="titles">
                        <div class="page-title"></div>
                        <div class="page-akatitle"></div>
                        <div class="page-subtitle"></div>
                    </div>
                </div>
                <div class="footer-menu">
                    <ul class="menu-items">
                    </ul>
                </div>
            `,
            isPage: true
        };
        super(config);
    }

    hide(): void {
        console.log("not implemented");
    }

    init(): void {
        console.log("init home");
        const data_view = DataView.home;
        const element = this.getElement();
        if (element) {
            const titleEl = element.querySelector(".page-title");
            const akaTitleEl = element.querySelector(".page-akatitle");
            const subtitleEl = element.querySelector(".page-subtitle");

            if (titleEl) titleEl.innerHTML = data_view.title;
            if (akaTitleEl) akaTitleEl.innerHTML = data_view.subtitle;
            if (subtitleEl) subtitleEl.innerHTML = data_view.subtitle2;
        }
    }

    show(): void {
        console.log("not implemented");
    }

}

const homeInstance: Home = new Home();
export { Home, homeInstance }