import modelView, { ViewConfig } from "./modelView";
import { soundSystemInstance } from "../../services/SoundSystem";
import { Navigation, navigationInstance } from "../../core/Navigation";
import { projectsInstance } from "./projects";
import { DataView } from "../../data/Dataset";

class ProjectDetail extends modelView {
    constructor() {
        const config: ViewConfig = {
            id: "project-detail",
            template: `
                <div class="project-detail page hide">
                    <div class="page-subtitle" data-aos='zoom-in' data-aos-duration="1000" data-aos-delay="400"></div>
                    <div class="page-title" data-aos='zoom-in' data-aos-duration="1000" data-aos-delay="200"></div>
                    <div class="feature" data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='50' data-aos-duration='1000'
                         data-aos-delay='50'>
                        <img class="projectDetailImage lazy" alt="Project Image"/>
                    </div>
                    <div class="detail-title section-title" data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='50'
                         data-aos-duration='1000'
                         data-aos-delay='50'></div>
                    <!-- projectDetails data -->
                    <div class="description" data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='50'
                         data-aos-duration='1000'
                         data-aos-delay='50'></div>
                    <div class='data-container details-container' data-aos='fade-in'></div>
                    <!-- projectDetails nav-controls -->
                    <div class="bottom-nav">
                        <div class="ctlbutton bottom-back">&#8672; prev</div>
                        <div class="ctlbutton bottom-up">back to projects</div>
                        <div class="ctlbutton bottom-next">next &#8674;</div>
                    </div>
                </div>
            `,
            isPage: true
        };
        super(config);
    }

    hide(): void {
        console.log("not implemented");
    }

    init(): void {
        console.log("init project detail");
        const element = this.getElement();
        if (!element) return;

        // next project navigation
        const nextBtn = element.querySelector(".bottom-next");
        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                soundSystemInstance.playClick();
                this.goNext();
            });
        }

        // previous project navigation
        const backBtn = element.querySelector(".bottom-back");
        if (backBtn) {
            backBtn.addEventListener("click", () => {
                soundSystemInstance.playClick();
                this.goBack();
            });
        }

        // return project index navigation
        const upBtn = element.querySelector(".bottom-up");
        if (upBtn) {
            upBtn.addEventListener("click", () => {
                soundSystemInstance.playClick();
                navigationInstance.go("projects");
            });
        }

        const img = element.querySelector("img");
        if (img) {
            img.addEventListener("error", () => {
                img.setAttribute("src", DataView.projects.placeHolder);
            });
        }
    }

    load(projectID: number): void {
        const element = this.getElement();
        if (!element) return;

        const collection = projectsInstance.getProjectData(projectID - 1);
        const name = String(collection.name).replace(/-/g, " ").replace(/_/g, " ");
        const description = collection.description == null ? "No description has been set for the repository" : collection.description;
        console.log("loading project detail from data id:", projectID);

        const pageTitle = element.querySelector(".page-title");
        const pageSubtitle = element.querySelector(".page-subtitle");
        const img = element.querySelector("img");
        const detailTitle = element.querySelector(".detail-title");
        const descriptionEl = element.querySelector(".description");

        if (pageTitle) pageTitle.innerHTML = `${name}`;
        if (pageSubtitle) pageSubtitle.innerHTML = "Detail of";
        if (img) img.setAttribute("src", `assets/images/projects/${collection.id}.jpg`);
        if (detailTitle) detailTitle.innerHTML = "[ Brief ]";
        if (descriptionEl) descriptionEl.innerHTML = `<p>${description}</p>`;

        // getting useful data
        const tags = DataView.projects.projectDetailTags;
        let component = "";
        for (const [key, value] of Object.entries(tags)) {
            component += `<div class="data-detail-container detail detail-${key}"><span class="detail-title">${key}</span><span class="detail-data">${eval(String(value))}</span></div>`;
        }

        const detailsContainer = element.querySelector(".details-container");
        if (detailsContainer) {
            detailsContainer.innerHTML = component;
        }
    }

    goNext() {
        const current = Navigation.currentProjectID;
        if (current < projectsInstance.getProjectsQuantity()) {
            console.log(`project detail nexting to ${current + 1}`);
            navigationInstance.go(`projects/${current + 1}`);
        } else {
            console.log("project detail nexting to 1");
            navigationInstance.go(`projects/1`);
        }
    }

    goBack() {
        const current = Navigation.currentProjectID;
        const qta = projectsInstance.getProjectsQuantity();
        if (current > 1) {
            console.log(`project detail backing to ${current - 1}`);
            navigationInstance.go(`projects/${current - 1}`);
        } else {
            console.log(`project detail backing to ${qta}`);
            navigationInstance.go(`projects/${qta}`);
        }
    }

    show(): void {
        console.log("not implemented");
    }

}

const projectDetailInstance: ProjectDetail = new ProjectDetail();
export { ProjectDetail, projectDetailInstance }