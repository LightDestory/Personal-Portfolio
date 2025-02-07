import modelView from "./modelView";
import {DataView} from "../dataset";

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
    hide(): void {
        console.log("not implemented");
    }

    show(): void {
        console.log("not implemented");
    }

    init(): void {
        console.log("init thanks");
        const collection = DataView.thanks;
        document.querySelector(".thanks .page-title")!!.innerHTML = collection.title;
        document.querySelector(".thanks .page-subtitle")!!.innerHTML = collection.subtitle;
        document.querySelector(".thanks .feature .feature-image")!!.setAttribute("data-src", collection.splash);
        document.querySelector(".thanks .poweredBy-title")!!.innerHTML = "[ Powered by ]";
        document.querySelector(".thanks .thanks-title")!!.innerHTML = "[ Thanks to ]";
        let component = "";
        // importing poweredBy data
        (collection.poweredBy as Acknowledgement[]).forEach(element => {
            component += this.generateAckComponent(element);
        });
        document.querySelector(".thanks .poweredBy-container")!!.innerHTML = component;
        component = "";
        // importing thanksLifeSaving data
        (collection.thanksForLifeSaving as Acknowledgement[]).forEach(element => {
            component += this.generateAckComponent(element);
        });
        document.querySelector(".thanks .thanks-container")!!.innerHTML = component;
    }

    /**
     * Generate the acknowledgement HTML component
     * @param ack The acknowledgement data from the dataset
     * @returns The HTML component as a string
     */
    private generateAckComponent(ack: Acknowledgement): string {
        const link = ack.link ? `href='${ack.link}'` : "";
        return `<div data-aos='fade-up' data-aos-easing='ease-in-out' data-aos-offset='0' data-aos-duration='1000' data-aos-delay='0' class="data-detail-container detail"><span class="detail-title">${ack.name}</span><span class="detail-data">${ack.text}</span><a class="data-detail-button detail-link" ${link} target="_blank">Learn more...</a></div>`;
    }

}

const thanksInstance: Thanks = new Thanks();
export {Thanks, thanksInstance}