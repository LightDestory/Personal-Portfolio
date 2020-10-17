import {viewInstance, Views} from "./views";
import AppCore from "./core";
import webGLInstance from "./webgl";
import {Loader} from "./views/loader";
import from = gsap.from;
import {ProjectDetail} from "./views/projectDetail";
import {DataView} from "./dataset";

class Navigation{
    static currentProjectID: number = 0;
    // navigation between sections and pages
    go(state: string): void {
        if (AppCore.state === state) {
            return null;
        }
        console.log("Change state requested. From " + AppCore.state + " to " + state);
        // navigation logic
        const toPath = state.split('/'), fromPath = AppCore.state.split('/');
        let toSection, toPage, fromSection, fromPage;
        toSection = toPath[0] ? toPath[0] : null;
        toPage = toPath[1] ? toPath[1] : null;
        fromSection = fromPath[0] != "loading" ? fromPath[0] : null;
        fromPage = fromPath[1] ? fromPath[1] : null;
        if (toSection) {
            console.log("section", toSection);
        }
        if (toPage) {
            console.log("page", toPage);
        }
        // close the menu if open
        viewInstance.getView(Views.MENU_VIEW).hide();
        // handle leaving old state
        if (fromSection) {
            if (fromSection !== "projects") {
                viewInstance.hidePage(fromSection);
            } else {
                if (fromPage) {
                    viewInstance.hidePage("project-detail");
                } else {
                    viewInstance.hidePage("projects");
                }
            }
        }
        // handle entering new state
        const docTitleRef = toPage ? "detailTitle" : "pageTitle";
        const loader_tmp: Loader = (<Loader>viewInstance.getView(Views.LOADER_VIEW));
        document.title = DataView[toSection][docTitleRef];
        AppCore.state = state;
        if (!toPage) {
            webGLInstance.go(toSection);
            viewInstance.showPage(toSection);
        } else {
            // projects detail
            Navigation.currentProjectID = toPage;
            loader_tmp.update(.0);
            loader_tmp.show();
            setTimeout(function () {
                (<ProjectDetail>viewInstance.getView(Views.PRJD_VIEW)).load(toPage);
            }, 800);
            webGLInstance.go("projectDetail");
            setTimeout(function () {
                loader_tmp.update(.7);
            }, 500);
            setTimeout(function () {
                viewInstance.showPage("project-detail");
                loader_tmp.update(1.0);
                loader_tmp.hide()
            }, 1000);
        }
        // update loaded icon default image
        let rem = state === "home" ? "home-bar-hide" : "home-bar-show";
        let add = state === "home" ? "home-bar-show" : "home-bar-hide";
        const top_bar = document.querySelector(".top-bar").classList;
        const bot_bar = document.querySelector(".bottom-bar").classList;
        const header = document.querySelector(".header").classList;
        const footer_menu = document.querySelector(".footer-menu").classList;
        setTimeout(function () {
            top_bar.remove(rem);
            top_bar.add(add);
            bot_bar.remove(rem);
            bot_bar.add(add);
            if (state === "home") {
                header.remove("show");
                footer_menu.add("show");
            } else {
                header.add("show");
                footer_menu.remove("show");
            }
        }, 500);
        // hide / show anything globally here
        setTimeout(function () {
            document.querySelector("html").scrollTop = 0;
            document.querySelector("body").scrollTop = 0;
        }, 50);
    }

    readyToStart() {
        console.log("READY... GO!");
        viewInstance.getView(Views.LOADER_VIEW).hide();
        viewInstance.getView(Views.HEADER_VIEW).show();
        this.go("home");
    }
}
const navigationInstance: Navigation = new Navigation();
export {Navigation, navigationInstance};