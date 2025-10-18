import modelView, { ViewConfig } from "./modelView";
import { DataView } from "../dataset";

/**
 * Type for Platform
 * @interface Platform
 * @property {string} name - The name of the platform
 * @property {string} icon - The icon of the platform
 * @property {string} note - The note of the platform
 * @property {string} link - The link of the platform
 */
interface Platform {
    name: string;
    icon: string;
    note: string;
    link: string;
}

class Platforms extends modelView {
    constructor() {
        const config: ViewConfig = {
            id: "platforms",
            template: `
                <div class="platforms page hide">
                    <div class="page-title" data-aos='zoom-in' data-aos-duration="1000" data-aos-delay="200"></div>
                    <div class="page-subtitle" data-aos='zoom-in' data-aos-duration="1000" data-aos-delay="400"></div>
                    <div data-aos='zoom-in' data-aos-easing='ease-in-out' data-aos-offset='50' data-aos-duration='1000'
                         data-aos-delay='50' class="feature">
                        <img alt="Platforms Image" class='lazy feature-image'/>
                    </div>
                    <!-- where-I-am -->
                    <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='50' data-aos-duration='1000'
                         data-aos-delay='50' class="platforms-title section-title"></div>
                    <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='50' data-aos-duration='1000'
                         data-aos-delay='50' class="platforms-intro"></div>
                    <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='50' data-aos-duration='1000'
                         data-aos-delay='50' class="platforms-container"></div>
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
        console.log("init platforms");
        const data_view = DataView.platforms;
        const element = this.getElement();

        if (!element) return;

        const pageTitle = element.querySelector(".page-title");
        const pageSubtitle = element.querySelector(".page-subtitle");
        const featureImage = element.querySelector(".feature .feature-image");
        const platformsTitle = element.querySelector(".platforms-title");
        const platformsIntro = element.querySelector(".platforms-intro");

        if (pageTitle) pageTitle.innerHTML = data_view.title;
        if (pageSubtitle) pageSubtitle.innerHTML = data_view.subtitle;
        if (featureImage) featureImage.setAttribute("data-src", data_view.splash);
        if (platformsTitle) platformsTitle.innerHTML = "[ Where you can find me ]";
        if (platformsIntro) platformsIntro.innerHTML = data_view.platformsInfo;

        const links: Platform[] = data_view.links;
        let component = "";
        links.forEach(platform => {
            component += this.generatePlatformComponent(platform);
        });

        const platformsContainer = element.querySelector(".platforms-container");
        if (platformsContainer) {
            platformsContainer.innerHTML = component;
        }
    }

    show(): void {
        console.log("not implemented");
    }

    /**
     * Generate the platform HTML component
     * @param platform The platform data from the dataset
     * @returns The HTML component as a string
     */
    private generatePlatformComponent(platform: Platform): string {
        const link = platform.link ? `href='${platform.link}'` : "";
        return `<div data-aos='fade-up' data-aos-easing='ease-in-out' data-aos-offset='0' data-aos-duration='1000' data-aos-delay='0' class="data-container platform platform-${String(platform.name).toLowerCase()}"><div class="platform-icon"><i class="${platform.icon} fa-4x"></i></div><div class="platform-title">${platform.name}</div><div class="data-detail-container platform-link"><a ${link} target="_blank">${platform.note}</a></div></div>`
    }

}

const platformsInstance: Platforms = new Platforms();
export { Platforms, platformsInstance }