import modelView, { ViewConfig } from "./modelView";
import { DataView } from "../dataset";
import { soundSystemInstance } from "../soundsystem";
import { navigationInstance } from "../navigation";

/**
 * Menu Interface
 * @interface Menu
 * @property {string} title - The title of the menu item
 * @property {string} link - The link of the menu item
 */
interface Menu {
    title: string;
    link: string;
}

class Menu extends modelView {
    private menu_reference: HTMLElement | null = null;
    private menu_button_reference: HTMLElement | null = null;

    constructor() {
        const config: ViewConfig = {
            id: "menu",
            template: `
                <div class="menu">
                    <ul class="menu-items"></ul>
                </div>
            `,
            isPage: false
        };
        super(config);
    }

    hide(): void {
        console.log("hide menu");
        if (!this.menu_reference) {
            this.menu_reference = this.getElement();
        }
        if (!this.menu_button_reference) {
            this.menu_button_reference = document.querySelector(".menu-button");
        }
        if (this.menu_reference) {
            this.menu_reference.classList.remove("show");
        }
        if (this.menu_button_reference) {
            this.menu_button_reference.classList.remove("active");
        }
    }

    init(): void {
        console.log("init menu");
        this.menu_reference = this.getElement();
        this.menu_button_reference = document.querySelector(".menu-button");

        // Dynamically create menu items
        let [header_menu_components, footer_menu_components, menu_components] = this.generateMenuItems();

        // Loading into DOM
        const headerMenu = document.querySelector(".header-menu .menu-items");
        const footerMenu = document.querySelector(".footer-menu .menu-items");
        const menuItems = this.menu_reference?.querySelector(".menu-items");

        if (headerMenu) headerMenu.innerHTML = header_menu_components;
        if (footerMenu) footerMenu.innerHTML = footer_menu_components;
        if (menuItems) menuItems.innerHTML = menu_components;

        // Set events
        this.setClickEvents();
    }

    /**
     * Generate menu items
     * @returns {[string, string, string]} - header_menu_components, footer_menu_components, menu_components
     */
    private generateMenuItems(): [string, string, string] {
        let header_menu_components: string = "";
        let footer_menu_components: string = "";
        let menu_components: string = "";
        DataView.menu.forEach(function (menu_item: Menu, index: number) {
            header_menu_components += `<li class="menu-item menu-${menu_item.link}" data-link="${menu_item.link}">${index === 0 ? "" : " | "}${menu_item.title}</li>`;
            if (menu_item.link !== "home") {
                footer_menu_components += `<li class="menu-item menu-${menu_item.link}" data-link="${menu_item.link}">${menu_item.title}</li>`;
            }
            menu_components += `<li class="data-detail-container menu-item menu-${menu_item.link}" data-link="${menu_item.link}">${menu_item.title}</li>`;
        });
        return [header_menu_components, footer_menu_components, menu_components];
    }

    private setClickEvents(): void {
        // Redirect Events
        document.querySelectorAll(".menu-item").forEach(item => {
            item.addEventListener("click", () => {
                const link = item.getAttribute("data-link");
                if (!link) {
                    return;
                }
                console.log(`menu-item clicked: ${link}`);
                soundSystemInstance.playClick();
                navigationInstance.go(link);
            });
        });
        // Toggle Menu
        document.querySelector(".menu-button")!!.addEventListener("click", () => {
            soundSystemInstance.playClick();
            if (document.querySelector(".menu-button")!!.classList.contains("active")) {
                this.hide();
            } else {
                this.show();
            }
        })
    }

    show(): void {
        console.log("show menu");
        if (!this.menu_reference) {
            this.menu_reference = this.getElement();
        }
        if (!this.menu_button_reference) {
            this.menu_button_reference = document.querySelector(".menu-button");
        }
        if (this.menu_reference) {
            this.menu_reference.classList.add("show");
        }
        if (this.menu_button_reference) {
            this.menu_button_reference.classList.add("active");
        }
    }

}

const menuInstance: Menu = new Menu();
export { Menu, menuInstance }