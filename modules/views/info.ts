import modelView from "./modelView";
import {DataView} from "../dataset";
class Info extends modelView{
    hide(): void {
        console.log("not implemented");
    }

    show(): void {
        console.log("not implemented");
    }

    init(): void {
        console.log("init info");
        const collection = DataView.info;
        document.querySelector(".info .page-title").innerHTML = collection.title;
        document.querySelector(".info .page-subtitle").innerHTML = collection.subtitle;
        document.querySelector(".info .feature .feature-image").setAttribute("data-src", collection.splash);
        // longer bio
        document.querySelector(".info .bio-title").innerHTML = "[ Biography ]";
        document.querySelector(".info .bio").innerHTML = collection.biography;
        //Skills
        document.querySelector(".info .skillset-title").innerHTML = "[ Skills ]";
        document.querySelector(".info .skill-intro").innerHTML = collection.skillInfo;
        const skillSet = collection.skillSet;
        const container = document.querySelector(".skillset");
        skillSet.forEach(function (skill, i) {
            const group = skill.collection;
            let component = `<div class="skill-container"><div class="skill-title">${skill.title}</div><ul class=${skill.category}>`;
            group.forEach(function (element) {
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
        //click event
        document.querySelectorAll(".skillbar-container").forEach(item => {
            item.addEventListener("click", () => {
                const skill = item.getAttribute("skill");
                if (item.querySelector(`#icon-more-${skill}`) == null) {
                    return;
                }
                const icon = document.querySelector(`#icon-more-${skill}`).classList;
                const content = document.querySelector(`.more-${skill}`);
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
        document.querySelector(".info .ethic-title").innerHTML = "[ Ethics ]";
        document.querySelector(".info .ethic").innerHTML = collection.ethic;
    }



}

const infoInstance: Info = new Info();
export {Info, infoInstance}