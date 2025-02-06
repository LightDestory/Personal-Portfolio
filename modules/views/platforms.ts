import modelView from "./modelView";
import {DataView} from "../dataset";

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

    hide(): void {
        console.log("not implemented");
    }

    init(): void {
        console.log("init platforms");
        const data_view = DataView.platforms;
        document.querySelector(".platforms .page-title")!!.innerHTML = data_view.title;
        document.querySelector(".platforms .page-subtitle")!!.innerHTML = data_view.subtitle;
        document.querySelector(".platforms .feature .feature-image")!!.setAttribute("data-src", data_view.splash);
        document.querySelector(".platforms .platforms-title")!!.innerHTML = "[ Where you can find me ]";
        document.querySelector(".platforms .platforms-intro")!!.innerHTML = data_view.platformsInfo;
        const links: Platform[] = data_view.links;
        let component = "";
        links.forEach(platform => {
            component += this.generatePlatformComponent(platform);
        });
        document.querySelector(".platforms .platforms-container")!!.innerHTML = component;
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
export {Platforms, platformsInstance}