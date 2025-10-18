import ModelView from "./views/modelView";
import { loaderInstance } from "./views/loader";
import headerInstance from "./views/header";
import { menuInstance } from "./views/menu";
import AppCore from "../core/AppCore";
import AOS from 'aos';
import { Utils, utilsInstance } from "../services/Utils";
import { projectsInstance } from "./views/projects";
import { homeInstance } from "./views/home";
import { infoInstance } from "./views/info";
import { platformsInstance } from "./views/platforms";
import { thanksInstance } from "./views/thanks";
import { projectDetailInstance } from "./views/projectDetail";

class Views {
    static LOADER_VIEW: string = "loader";
    static HEADER_VIEW: string = "header";
    static MENU_VIEW: string = "menu";
    static HOME_VIEW: string = "home";
    static INFO_VIEW: string = "info";
    static PRJ_VIEW: string = "projects";
    static PRJD_VIEW: string = "project-detail";
    static PLAT_VIEW: string = "platforms";
    static THK_VIEW: string = "thanks";
    private collection: { [key: string]: ModelView } = {};
    private viewsContainer: HTMLElement | null = null;

    /**
     * Register a view in the collection
     * @param name The name/key of the view
     * @param view The view instance
     */
    registerView(name: string, view: ModelView): void {
        this.collection[name] = view;
        console.log(`View registered: ${name}`);
    }

    /**
     * Initialize the views system and inject HTML templates
     */
    setupViews(): void {
        // Get or create the main container for views
        this.viewsContainer = document.querySelector("#views-container");
        if (!this.viewsContainer) {
            this.viewsContainer = document.createElement("div");
            this.viewsContainer.id = "views-container";
            document.body.appendChild(this.viewsContainer);
        }

        // Register all views
        this.registerView("loader", loaderInstance);
        this.registerView("header", headerInstance);
        this.registerView("menu", menuInstance);
        this.registerView("home", homeInstance);
        this.registerView("info", infoInstance);
        this.registerView("projects", projectsInstance);
        this.registerView("project-detail", projectDetailInstance);
        this.registerView("platforms", platformsInstance);
        this.registerView("thanks", thanksInstance);

        // Inject HTML templates into the DOM
        Object.keys(this.collection).forEach(key => {
            const view = this.collection[key];
            const config = view.getConfig();

            // Check if element already exists (for backward compatibility)
            let element = document.querySelector(`.${config.id}`);
            if (!element && config.template) {
                // Create and inject the template
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = config.template.trim();

                // Handle multiple root elements in template
                const children = Array.from(tempDiv.children);
                children.forEach(child => {
                    // Append to appropriate container
                    if (config.isPage && this.viewsContainer) {
                        this.viewsContainer.appendChild(child);
                    } else {
                        document.body.appendChild(child);
                    }
                });
            }
        });
    }

    /**
     * Initialize all views in the collection
     */
    init(): void {
        Object.keys(this.collection).forEach(element => {
            if (element !== "loader") {
                this.collection[element].init();
            }
        });
    }

    /**
     * Show the page by altering the DOM classes and refreshing AOS
     * @param page The page to show
     */
    showPage(page: string): void {
        console.log(`show ${page}`);
        const page_classes = document.querySelector(`.${page}`)!!.classList;
        page_classes.remove("hide");
        setTimeout(function () {
            page_classes.add("show");
            AOS.refresh();
        }, 100);
        const title = document.querySelector(`.${page} .page-title`)!!.classList;
        const subtitle = document.querySelector(`.${page} .page-subtitle`)!!.classList;
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

    /**
     * Hide the page by altering the DOM classes and content
     * @param page The page to hide
     */
    hidePage(page: string): void {
        console.log(`hide ${page}`);
        const page_classes = document.querySelector(`.${page}`)!!.classList;
        page_classes.remove("show");
        document.querySelector(`.${page} .page-title`)!!.classList.remove("aos-animate");
        document.querySelector(`.${page} .page-subtitle`)!!.classList.remove("aos-animate");
        if (page === "project-detail") {
            setTimeout(function () {
                document.querySelector(`.${page} .details-container`)!!.innerHTML = "";
            }, 500);
            // if we are going from a detail page to the same detail page, dont hide it from DOM
            if (AppCore.state === Views.PRJD_VIEW) {
                return;
            }
        }
        // hide page from DOM
        setTimeout(function () {
            page_classes.add("hide");
        }, 1000);
    }

    /**
     * Retrieve the view instance by name
     * @param name The name of the view
     * @returns The view instance
     */
    getView(name: string): ModelView {
        /**
         * Replacing switch statement with direct return.
         * I know it is unsafe, but it is just a simple project.
         */
        return this.collection[name];
    }
}

const viewInstance: Views = new Views();
export { Views, viewInstance }