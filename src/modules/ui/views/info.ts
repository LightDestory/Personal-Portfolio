import modelView, { ViewConfig } from "./modelView";
import { DataView } from "../../data/Dataset";

class Info extends modelView {
    constructor() {
        const config: ViewConfig = {
            id: "info",
            template: `
                <div class="info page hide">
                    <div class="page-title" data-aos='zoom-in' data-aos-duration="1000" data-aos-delay="200"></div>
                    <div class="page-subtitle" data-aos='zoom-in' data-aos-duration="1000" data-aos-delay="400"></div>
                    <div class="feature">
                        <img alt="Bio Image" class='lazy feature-image'/>
                    </div>
                    <!-- biography -->
                    <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='400' data-aos-duration='1000'
                         data-aos-delay='50' class="bio-title section-title"></div>
                    <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='400' data-aos-duration='1000'
                         data-aos-delay='50' class="bio"></div>
                    <!-- skills -->
                    <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='300' data-aos-duration='1000'
                         data-aos-delay='50' class="skillset-title section-title"></div>
                    <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='300' data-aos-duration='1000'
                         data-aos-delay='50' class="skill-intro"></div>
                    <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='300' data-aos-duration='1000'
                         data-aos-delay='50' class='data-container skillset'></div>
                    <!-- Ethics -->
                    <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='300' data-aos-duration='1000'
                         data-aos-delay='50' class="ethic-title section-title"></div>
                    <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='300' data-aos-duration='1000'
                         data-aos-delay='50' class="ethic"></div>
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
        console.log("init info");
        const collection = DataView.info;
        const element = this.getElement();

        if (!element) return;

        const pageTitle = element.querySelector(".page-title");
        const pageSubtitle = element.querySelector(".page-subtitle");
        const featureImage = element.querySelector(".feature .feature-image");

        if (pageTitle) pageTitle.innerHTML = collection.title;
        if (pageSubtitle) pageSubtitle.innerHTML = collection.subtitle;
        if (featureImage) featureImage.setAttribute("data-src", collection.splash);

        // longer bio
        const bioTitle = element.querySelector(".bio-title");
        const bio = element.querySelector(".bio");
        if (bioTitle) bioTitle.innerHTML = "[ Biography ]";
        if (bio) bio.innerHTML = collection.biography;

        //Skills
        const skillsetTitle = element.querySelector(".skillset-title");
        const skillIntro = element.querySelector(".skill-intro");
        if (skillsetTitle) skillsetTitle.innerHTML = "[ Skills ]";
        if (skillIntro) skillIntro.innerHTML = collection.skillInfo;

        const skillSet = collection.skillSet;
        const container = element.querySelector(".skillset");

        if (container) {
            skillSet.forEach(function (skill: any, i: number) {
                const group = skill.collection;
                let component = `<div class="skill-container"><div class="skill-title">${skill.title}</div><ul class=${skill.category}>`;
                group.forEach(function (element: any) {
                    const percent = element.level * 10;
                    const strStyle = element.level === 10 ? `width:${percent}%;border-radius:50px;` : `width:${percent}%;`;
                    const noteIcon = element.note ? `<i id="icon-more-${element.friendlyName}" class="fas fa-chevron-right"></i>` : "";
                    const note = element.note ? `<div class="more-skill-container more-${element.friendlyName}">${element.note}</div>` : "";
                    component += `<div class="skillbar-container" skill="${element.friendlyName}">${noteIcon}<li class="skill-name">${element.name} <i class='${element.icon}'></i></li><div class="skillbar" style="${strStyle}"></div></div>${note}`;
                });
                component += '</ul></div>';
                if ((i + 1) % 2 === 1)
                    component += '<div class="padder"></div>';
                container.innerHTML += component;
            });
        }

        //click event
        element.querySelectorAll(".skillbar-container").forEach(item => {
            item.addEventListener("click", () => {
                const skill = item.getAttribute("skill");
                if (item.querySelector(`#icon-more-${skill}`) == null) {
                    return;
                }
                const icon = element.querySelector(`#icon-more-${skill}`)!!.classList;
                const content = element.querySelector(`.more-${skill}`) as HTMLElement;
                const hidden = icon.contains('fa-chevron-right');
                if (hidden) {
                    icon.remove('fa-chevron-right');
                    icon.add('fa-chevron-down');
                    content['style'].display = "block";
                } else {
                    icon.add('fa-chevron-right');
                    icon.remove('fa-chevron-down');
                    content['style'].display = "none";
                }
            })
        });

        //Ethic
        const ethicTitle = element.querySelector(".ethic-title");
        const ethic = element.querySelector(".ethic");
        if (ethicTitle) ethicTitle.innerHTML = "[ Ethics ]";
        if (ethic) ethic.innerHTML = collection.ethic;
    }


}

const infoInstance: Info = new Info();
export { Info, infoInstance }