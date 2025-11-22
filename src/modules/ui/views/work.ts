import modelView, { ViewConfig } from "./modelView";
import { DataView } from "../../data/Dataset";

class Work extends modelView {
    constructor() {
        const config: ViewConfig = {
            id: "work",
            template: `
                <div class="work page hide">
                    <div class="page-title" data-aos='zoom-in' data-aos-duration="1000" data-aos-delay="200">
                        <span class="title-text"></span>
                        <div class="page-subtitle" data-aos='zoom-in' data-aos-duration="1000" data-aos-delay="400"></div>
                    </div>
                    <div class="feature">
                        <img alt="Work Image" class='lazy feature-image'/>
                    </div>
                </div>
            `,
            isPage: true
        };
        super(config);
    }

    hide(): void {
        console.log("not implemented");
    }

    show(): void {
        console.log("not implemented");
    }

    init(): void {
        console.log("init work");
        const collection = DataView.work;
        const element = this.getElement();

        if (!element) return;

        const pageTitle = element.querySelector(".page-title .title-text");
        const pageSubtitle = element.querySelector(".page-subtitle");
        const featureImage = element.querySelector(".feature .feature-image");

        if (pageTitle) pageTitle.innerHTML = collection.title;
        if (pageSubtitle) pageSubtitle.innerHTML = collection.subtitle;
        if (featureImage) featureImage.setAttribute("data-src", collection.splash);
    }


}

const workInstance: Work = new Work();
export { Work, workInstance }