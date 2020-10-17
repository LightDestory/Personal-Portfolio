import modelView from "./modelView";
import {DataView} from "../dataset";
class Thanks extends modelView {
    hide(): void {
        console.log("not implemented");
    }

    show(): void {
        console.log("not implemented");
    }

    init(): void {
        console.log("init thanks");
        const collection = DataView['thanks'];
        document.querySelector(".thanks .page-title").innerHTML = collection.title;
        document.querySelector(".thanks .page-subtitle").innerHTML = collection.subtitle;
        document.querySelector(".thanks .feature .feature-image").setAttribute("data-src", collection.splash);
        document.querySelector(".thanks .poweredBy-title").innerHTML = "[ Powered by ]";
        document.querySelector(".thanks .thanks-title").innerHTML = "[ Thanks to ]";
        let component = "";
        // importing poweredBy data
        collection.poweredBy.forEach(element => {
            const link = element.link ? `href='${element.link}'` : "";
            component += `<div data-aos='fade-up' data-aos-easing='ease-in-out' data-aos-offset='0' data-aos-duration='1000' data-aos-delay='0' class="data-detail-container detail poweredby-${element.friendlyName}"><span class="detail-title">${element.name}</span><span class="detail-data">${element.text}</span><a class="data-detail-button detail-link" ${link} target="_blank">Learn more...</a></div>`;
        });
        document.querySelector(".thanks .poweredBy-container").innerHTML = component;
        component = "";
        // importing thanksLifeSaving data
        collection.thanksForLifeSaving.forEach(element => {
            const link = element.link ? `href='${element.link}'` : "";
            component += `<div data-aos='fade-up' data-aos-easing='ease-in-out' data-aos-offset='0' data-aos-duration='1000' data-aos-delay='0' class="data-detail-container detail thanks-to-${element.friendlyName}"><span class="detail-title">${element.name}</span><span class="detail-data">${element.text}</span><a class="data-detail-button detail-link" ${link} target="_blank">Learn more...</a></div>`;
        });
        document.querySelector(".thanks .thanks-container").innerHTML = component;
    }

}
const thanksInstance: Thanks = new Thanks();
export {Thanks, thanksInstance}