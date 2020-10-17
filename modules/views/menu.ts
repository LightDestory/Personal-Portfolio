import modelView from "./modelView";
import {DataView} from "../dataset";
import {soundSystemInstance} from "../soundsystem";
import {navigationInstance} from "../navigation";
class Menu extends modelView{

    hide(): void {
        console.log("hide menu");
        document.querySelector(".menu").classList.remove("show");
        document.querySelector(".menu-button").classList.remove("active");
    }

    init(): void {
        console.log("init menu");
        let str: string = "", str2: string = "", str3: string = "";
        DataView.menu.forEach(function (m, i) {
            const p: string = i === 0 ? "" : " | ";
            str += `<li class="menu-item menu-${m.link}" data-link="${m.link}">${p}${m.title}</li>`;
            if (m.link !== "home") {
                str2 += `<li class="menu-item menu-${m.link}" data-link="${m.link}">${m.title}</li>`;
            }
            str3 += `<li class="data-detail-container menu-item menu-${m.link}" data-link="${m.link}">${m.title}</li>`;
        });
        // loading into DOM
        document.querySelector(".header-menu .menu-items").innerHTML = str;
        document.querySelector(".footer-menu .menu-items").innerHTML = str2;
        document.querySelector(".menu .menu-items").innerHTML = str3;
        // click event
        document.querySelectorAll(".menu-item").forEach(item => {
            item.addEventListener("click", () => {
                const link = item.getAttribute("data-link");
                console.log(`menu-item clicked: ${link}`);
                soundSystemInstance.playClick();
                navigationInstance.go(link);
            });
        });
        //  click event
        document.querySelector(".menu-button").addEventListener("click", () => {
            soundSystemInstance.playClick();
            if (document.querySelector(".menu-button").classList.contains("active")) {
                // hide menu
                this.hide();
            } else {
                // show menu
                this.show();
            }
        })
    }

    show(): void {
        console.log("show menu");
        document.querySelector(".menu").classList.add("show");
        document.querySelector(".menu-button").classList.add("active");
    }

}

const menuInstance: Menu = new Menu();
export  {Menu, menuInstance}