import ModelView from "./views/modelView";
import {loaderInstance} from "./views/loader";
import headerInstance from "./views/header";
import {menuInstance} from "./views/menu";
import AppCore from "./core";
import AOS from 'aos';
import {Utils, utilsInstance} from "./utils";
import {projectsInstance} from "./views/projects";
import {homeInstance} from "./views/home";
import {infoInstance} from "./views/info";
import {platformsInstance} from "./views/platforms";
import {thanksInstance} from "./views/thanks";
import {projectDetailInstance} from "./views/projectDetail";
class Views {
    static LOADER_VIEW: string = "loader";
    static HEADER_VIEW: string = "header";
    static MENU_VIEW: string = "menu";
    static HOME_VIEW: string = "home";
    static INFO_VIEW: string = "info";
    static PRJ_VIEW: string = "projects";
    static PRJD_VIEW: string = "project-Detail";
    static PLAT_VIEW: string = "platforms";
    static THK_VIEW: string = "thanks";
    private collection: {[key: string] : ModelView} = {
        "loader": loaderInstance,
        "header": headerInstance,
        "menu": menuInstance,
        "home": homeInstance,
        "info": infoInstance,
        "projects": projectsInstance,
        "project-Detail": projectDetailInstance,
        "platforms": platformsInstance,
        "thanks": thanksInstance
    }

    init(): void {
        Object.keys(this.collection).forEach(element => {
            if(element!=="loader"){
                this.collection[element].init();
            }
        });
    }
    showPage(page: string): void {
        console.log(`show ${page}`);
        const p = document.querySelector(`.${page}`).classList;
        p.remove("hide");
        setTimeout(function () {
            p.add("show");
            AOS.refresh();
        }, 100);
        const title = document.querySelector(`.${page} .page-title`).classList;
        const subtitle = document.querySelector(`.${page} .page-subtitle`).classList;
        title.remove("aos-animate");
        subtitle.remove("aos-animate");
        setTimeout(function () {
            title.add("aos-animate");
            subtitle.add("aos-animate");
        }, 500);
        if (page === "projects") {
            if (!projectsInstance.isFetchOnProgress() && !projectsInstance.isFetchComplete()) {
                console.log('error on fetching repositories, retrying...');
                utilsInstance.showToast("Unable to get response from GitHub API. Retrying...", 3000, Utils.TOAST_ERROR);
                projectsInstance.fetchData();
            } else if (projectsInstance.isFetchOnProgress()) {
                utilsInstance.showToast("Due to slow network the fetching is still on progress. Come back later!", 8000, Utils.TOAST_INFORMATION);
            }
        }
    }
    hidePage(page: string): void {
        console.log(`hide ${page}`);
        const p = document.querySelector(`.${page}`).classList;
        p.remove("show");
        document.querySelector(`.${page} .page-title`).classList.remove("aos-animate");
        document.querySelector(`.${page} .page-subtitle`).classList.remove("aos-animate");
        if (page === "project-detail") {
            setTimeout(function () {
                document.querySelector(`.${page} .details-container`).innerHTML = "";
            }, 500);
            // if we are going from a detail page to the same detail page, dont hide it from DOM
            if (AppCore.state === "projects") {
                return null;
            }
        }
        // hide page from DOM
        setTimeout(function () {
            p.add("hide");
        }, 1000);
    }

    getView(name: string): ModelView {
        let view: ModelView;
        if(name===Views.LOADER_VIEW){
            view = this.collection[Views.LOADER_VIEW];
        } else if(name===Views.HEADER_VIEW) {
            view = this.collection[Views.HEADER_VIEW];
        } else if(name===Views.MENU_VIEW) {
            view = this.collection[Views.MENU_VIEW];
        }
        else if(name===Views.HOME_VIEW) {
            view = this.collection[Views.HOME_VIEW];
        }
        else if(name===Views.INFO_VIEW) {
            view = this.collection[Views.INFO_VIEW];
        }
        else if(name===Views.PRJ_VIEW) {
            view = this.collection[Views.PRJ_VIEW];
        }
        else if(name===Views.PRJD_VIEW) {
            view = this.collection[Views.PRJD_VIEW];
        }
        else if(name===Views.PLAT_VIEW) {
            view = this.collection[Views.PLAT_VIEW];
        }
        else if(name===Views.THK_VIEW) {
            view = this.collection[Views.THK_VIEW];
        }
        return view;
    }
}
const viewInstance: Views = new Views();
export {Views, viewInstance}