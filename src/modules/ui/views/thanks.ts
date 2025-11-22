import modelView, { ViewConfig } from "./modelView";
import { DataView } from "../../data/Dataset";

/**
 * Type for Acknowledgements
 * @interface Acknowledgement
 * @property {string} name - The name of the acknowledgement
 * @property {string} text - The text of the acknowledgement
 * @property {string} link - The link of the acknowledgement
 * @property {string} friendlyName - The friendly name of the acknowledgement
 */
interface Acknowledgement {
    name: string;
    text: string;
    link: string;
}


class Thanks extends modelView {
    constructor() {
        const config: ViewConfig = {
            id: "thanks",
            template: `
                <div class="thanks page hide">
                    <div class="page-title" data-aos='zoom-in' data-aos-duration="1000" data-aos-delay="200">
                        <span class="title-text"></span>
                        <div class="page-subtitle" data-aos='zoom-in' data-aos-duration="1000" data-aos-delay="400"></div>
                    </div>
                    <div data-aos='zoom-in' data-aos-easing='ease-in-out' data-aos-offset='50' data-aos-duration='1000'
                         data-aos-delay='50' class="feature">
                        <img alt="Thanks Image" class='lazy feature-image'/>
                    </div>
                    <!-- poweredBy list -->
                    <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='50' data-aos-duration='1000'
                         data-aos-delay='50' class="poweredBy-title section-title"></div>
                    <div class='data-container thanks-page-container poweredBy-container' data-aos='fade-in'></div>
                    <!-- thanks list -->
                    <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='50' data-aos-duration='1000'
                         data-aos-delay='50' class="thanks-title section-title"></div>
                    <div class='data-container thanks-page-container thanks-container' data-aos='fade-in'></div>
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
        console.log("init thanks");
        const collection = DataView.thanks;
        const element = this.getElement();

        if (!element) return;

        const pageTitle = element.querySelector(".page-title .title-text");
        const pageSubtitle = element.querySelector(".page-subtitle");
        const featureImage = element.querySelector(".feature .feature-image");
        const poweredByTitle = element.querySelector(".poweredBy-title");
        const thanksTitle = element.querySelector(".thanks-title");

        if (pageTitle) pageTitle.innerHTML = collection.title;
        if (pageSubtitle) pageSubtitle.innerHTML = collection.subtitle;
        if (featureImage) featureImage.setAttribute("data-src", collection.splash);
        if (poweredByTitle) poweredByTitle.innerHTML = "[ Powered by ]";
        if (thanksTitle) thanksTitle.innerHTML = "[ Thanks to ]";

        let component = "";
        // importing poweredBy data
        (collection.poweredBy as Acknowledgement[]).forEach(element => {
            component += this.generateAckComponent(element);
        });

        const poweredByContainer = element.querySelector(".poweredBy-container");
        if (poweredByContainer) {
            poweredByContainer.innerHTML = component;
        }

        component = "";
        // importing thanksLifeSaving data
        (collection.thanksForLifeSaving as Acknowledgement[]).forEach(element => {
            component += this.generateAckComponent(element);
        });

        const thanksContainer = element.querySelector(".thanks-container");
        if (thanksContainer) {
            thanksContainer.innerHTML = component;
        }
    }

    /**
     * Generate the acknowledgement HTML component
     * @param ack The acknowledgement data from the dataset
     * @returns The HTML component as a string
     */
    private generateAckComponent(ack: Acknowledgement): string {
        const link = ack.link ? `href='${ack.link}'` : "";
        return `<div data-aos='fade-up' data-aos-easing='ease-in-out' data-aos-offset='0' data-aos-duration='1000' data-aos-delay='0' class="data-detail-container detail"><span class="detail-title">${ack.name}</span><span class="detail-data">${ack.text}</span><a class="data-detail-button detail-link" ${link} target="_blank">More...</a></div>`;
    }

}

const thanksInstance: Thanks = new Thanks();
export { Thanks, thanksInstance }