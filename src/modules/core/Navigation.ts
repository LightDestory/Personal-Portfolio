import { viewInstance, Views } from "../ui/ViewsManager";
import AppCore from "./AppCore";
import webGLInstance from "../graphics/WebGL";
import { Loader } from "../ui/views/loader";
import { ProjectDetail } from "../ui/views/projectDetail";
import { DataView } from "../data/Dataset";

class Navigation {
    static currentProjectID: number = 0;

    // navigation between sections and pages
    go(state: string): void {
        // Do not change state if it is the same
        if (AppCore.state === state) {
            return;
        }
        console.log("Change state requested. From " + AppCore.state + " to " + state);
        // navigation logic
        const [destination_path, destination_sub_path] = state.split('/', 2);
        const [source_path, source_sub_path] = AppCore.state.split('/', 2);
        // close the menu if open
        viewInstance.getView(Views.MENU_VIEW).hide();
        // handle leaving old state
        if (source_path == Views.PRJ_VIEW && source_sub_path) {
            viewInstance.hidePage(Views.PRJD_VIEW);
        }
        else {
            if (source_path !== "loading") {
                viewInstance.hidePage(source_path);
            }
        }
        // handle entering new state
        const docTitleRef = destination_sub_path ? "detailTitle" : "pageTitle";
        const loader_tmp: Loader = (<Loader>viewInstance.getView(Views.LOADER_VIEW));
        document.title = DataView[destination_path][docTitleRef];
        AppCore.state = state;
        if (!destination_sub_path) {
            webGLInstance.go(destination_path!!);
            viewInstance.showPage(destination_path!!);
        } else {
            // projects detail
            Navigation.currentProjectID = parseInt(destination_sub_path);
            loader_tmp.update(.0);
            loader_tmp.show();
            setTimeout(function () {
                (<ProjectDetail>viewInstance.getView(Views.PRJD_VIEW)).load(Navigation.currentProjectID);
            }, 800);
            webGLInstance.go(Views.PRJD_VIEW);
            setTimeout(function () {
                loader_tmp.update(.7);
            }, 500);
            setTimeout(function () {
                viewInstance.showPage(Views.PRJD_VIEW);
                loader_tmp.update(1.0);
                loader_tmp.hide()
            }, 1000);
        }
        // update loaded icon default image
        let rem = state === Views.HOME_VIEW ? "home-bar-hide" : "home-bar-show";
        let add = state === Views.HOME_VIEW ? "home-bar-show" : "home-bar-hide";
        const top_bar = document.querySelector(".top-bar")!!.classList;
        const bot_bar = document.querySelector(".bottom-bar")!!.classList;
        const header = document.querySelector(".header")!!.classList;
        const footer_menu = document.querySelector(".footer-menu")!!.classList;
        setTimeout(function () {
            top_bar.remove(rem);
            top_bar.add(add);
            bot_bar.remove(rem);
            bot_bar.add(add);
            if (state === Views.HOME_VIEW) {
                header.remove("show");
                footer_menu.add("show");
            } else {
                header.add("show");
                footer_menu.remove("show");
            }
        }, 500);
        // hide / show anything globally here
        setTimeout(function () {
            document.querySelector("html")!!.scrollTop = 0;
            document.querySelector("body")!!.scrollTop = 0;
        }, 50);
    }

    /**
     * Start the website showcase by redirecting to the home page
     */
    readyToStart(): void {
        console.log("READY... GO!");
        viewInstance.getView(Views.LOADER_VIEW).hide();
        viewInstance.getView(Views.HEADER_VIEW).show();
        this.go(Views.HOME_VIEW);
    }
}

const navigationInstance: Navigation = new Navigation();
export { Navigation, navigationInstance };