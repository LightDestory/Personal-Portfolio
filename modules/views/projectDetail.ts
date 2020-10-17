import modelView from "./modelView";
import {soundSystemInstance} from "../soundsystem";
import {Navigation, navigationInstance} from "../navigation";
import {projectsInstance} from "./projects";
import {DataView} from "../dataset";
class ProjectDetail extends modelView {
    hide(): void {
        console.log("not implemented");
    }

    init(): void {
        console.log("init project detail");
        // next project navigation
        document.querySelector(".project-detail .bottom-next").addEventListener("click", () => {
            soundSystemInstance.playClick();
            this.goNext();
        });
        // previous project navigation
        document.querySelector(".project-detail .bottom-back").addEventListener("click", () => {
            soundSystemInstance.playClick();
            this.goBack();
        });
        // return project index navigation
        document.querySelector(".project-detail .bottom-up").addEventListener("click", () => {
            soundSystemInstance.playClick();
            navigationInstance.go("projects");
        });
        document.querySelector(".project-detail img").addEventListener("error", () => {
            document.querySelector(".project-detail img").setAttribute("src", DataView.projects.placeHolder);
        });
    }
    load(projectID: number): void {
        const collection = projectsInstance.getProjectData(projectID - 1);
        const name = String(collection.name).replace(/-/g, " ").replace(/_/g, " ");
        const description = collection.description == null ? "No description has been set for the repository" : collection.description;
        console.log("loading project detail from data id:", projectID);
        document.querySelector(".project-detail .page-title").innerHTML = `${name}`;
        document.querySelector(".project-detail .page-subtitle").innerHTML = "Detail of";
        document.querySelector(".project-detail img").setAttribute("src", `assets/images/projects/${collection.id}.jpg`);
        document.querySelector(".project-detail .detail-title").innerHTML = "[ Brief ]";
        document.querySelector(".project-detail .description").innerHTML = `<p>${description}</p>`;
        // getting useful data
        const tags = DataView.projects.projectDetailTags;
        let component = "";
        for (const [key, value] of Object.entries(tags)) {
            component += `<div class="data-detail-container detail detail-${key}"><span class="detail-title">${key}</span><span class="detail-data">${eval(String(value))}</span></div>`;
        }
        document.querySelector(".project-detail .details-container").innerHTML = component;
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
    goBack () {
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
export {ProjectDetail, projectDetailInstance}