import modelView from "./modelView";
import {DataView} from "../dataset";
import {soundSystemInstance} from "../soundsystem";
import {navigationInstance} from "../navigation";
import AppCore from "../core";
class Projects extends modelView {
    private fetchOnProgress: boolean = false;
    private userData: any;
    private projectsData: any;
    private fetchComplete: boolean = false;
    hide(): void {
        console.log("not implemented");
    }

    init(): void {
        console.log("init projects");
        const collection = DataView.projects;
        // Titles
        document.querySelector(".projects .page-title").innerHTML = collection.title;
        document.querySelector(".projects .page-subtitle").innerHTML = collection.subtitle;
        document.querySelector(".projects .projects-title").innerHTML = "[ Projects ]";
        document.querySelector(".projects .contributions-title").innerHTML = "[ Contributions ]";
        // async load of projects
        this.fetchData();
    }

    fetchData(): void {
        console.log('async fetch repositories');
        this.fetchOnProgress = true;
        fetch(DataView.projects.githubUserAPI)
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then(response => {
                this.userData = response;
                return fetch(DataView.projects.githubProjectsAPI)
            })
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then(response => {
                this.projectsData = response;
                this.fetchComplete = true;
                this.loadData();
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                this.fetchOnProgress = false;
            });
    }

    private loadData(): void{
        // generating user-card
        document.querySelector(".github-card").innerHTML = `<img class="github-card-avatar lazy" src="" alt="Profile Image" data-src="${this.userData.avatar_url}" alt="${this.userData.name}"><div class="github-card-title">${this.userData.name} (${this.userData.login})</div><div class="github-card-content"><div class="data-detail-container github-card-element"><a href="https://github.com/${this.userData.login}?tab=repositories"><strong>${this.userData.public_repos}</strong><br/>Repos</a></div><div class="data-detail-container github-card-element"><a href="https://github.com/${this.userData.login}?tab=following"><strong>${this.userData.following}</strong><br/>Following</a></div><div class="data-detail-container github-card-element"><a href="https://github.com/${this.userData.login}?tab=followers"><strong>${this.userData.followers}</strong><br/>Followers</a></div></div>`;
        // loading repositories
        const projects = document.querySelector(".projects-content");
        const forks = document.querySelector(".contributions-content");
        this.projectsData.forEach(function (element, i) {
            const desc = `${String(element.description) === "null" ? "No description has been set for the repository" : String(element.description).substr(0, 64)}&hellip;`;
            const name = `${String(element.name).replace(/-/g, " ").replace(/_/g, " ")}`;
            const str = `<div data-aos='fade-up' data-aos-easing='ease-in-out' data-aos-offset='0' data-aos-duration='1000' data-aos-delay='0' class='data-container list-item project-item'><img alt="Repository Image" class='lazy' data-src='assets/images/projects/${element.id}.jpg'/><div class="info"><div class='title'>${name}</div><div class='text'><p>${desc}<p></div></div><div class="links"><div class='data-detail-container detail' data-link='projects/${i + 1}'>More</div></div></div>`;
            if (!element['fork']) {
                projects.innerHTML += str;
            } else {
                forks.innerHTML += str;
            }
        });
        // assign click handlers
        document.querySelectorAll(".project-item .links .detail").forEach(item => {
            item.addEventListener("click", () => {
                soundSystemInstance.playClick();
                const link = item.getAttribute("data-link");
                console.log("project-item clicked: ", link);
                navigationInstance.go(link);
            })
        });
        // placeholder inject
        document.querySelectorAll(".list-item img").forEach(image => {
            image.addEventListener("error", () => {
                image.setAttribute("src", DataView.projects.placeHolder);
            });
        });
        //lazyload update
        AppCore.lazyload.update();
    }

    show(): void {
        console.log("not implemented");
    }

    isFetchOnProgress(): boolean {
        return this.fetchOnProgress;
    }

    getProjectData(projectID: number): any {
        return this.projectsData[projectID];
    }

    getProjectsQuantity(): number {
        return this.projectsData.length;
    }

    isFetchComplete(): boolean {
        return this.fetchComplete;
    }

}
const projectsInstance: Projects = new Projects();
export {Projects, projectsInstance}