import modelView from "./modelView";
import {DataView} from "../dataset";
class Platforms extends modelView{
    hide(): void {
        console.log("not implemented");
    }

    init(): void {
        console.log("init platforms");
        const collection =DataView.platforms;
        document.querySelector(".platforms .page-title").innerHTML = collection.title;
        document.querySelector(".platforms .page-subtitle").innerHTML = collection.subtitle;
        document.querySelector(".platforms .feature .feature-image").setAttribute("data-src", collection.splash);
        document.querySelector(".platforms .platforms-title").innerHTML = "[ Where you can find me ]";
        document.querySelector(".platforms .platforms-intro").innerHTML = collection.platformsInfo;
        const links = collection.links;
        let component = "";
        links.forEach(platform => {
            const link = platform.link ? `href='${platform.link}'` : "";
            component += `<div data-aos='fade-up' data-aos-easing='ease-in-out' data-aos-offset='0' data-aos-duration='1000' data-aos-delay='0' class="data-container platform platform-${String(platform.name).toLowerCase()}"><div class="platform-icon"><i class="${platform.icon} fa-4x"></i></div><div class="platform-title">${platform.name}</div><div class="data-detail-container platform-link"><a ${link} target="_blank">${platform.note}</a></div></div>`;
        });
        document.querySelector(".platforms .platforms-container").innerHTML = component;
    }

    show(): void {
        console.log("not implemented");
    }

}
const platformsInstance: Platforms = new Platforms();
export {Platforms, platformsInstance}