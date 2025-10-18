import modelView, { ViewConfig } from "./modelView";
import { DataView } from "../../data/Dataset";
import { soundSystemInstance } from "../../services/SoundSystem";
import { navigationInstance } from "../../core/Navigation";
import AppCore from "../../core/AppCore";

class Projects extends modelView {
    private fetchOnProgress: boolean = false;
    private userData: any;
    private projectsData: any;
    private fetchComplete: boolean = false;

    constructor() {
        const config: ViewConfig = {
            id: "projects",
            template: `
                <div class="projects page hide">
                    <div class="page-title" data-aos='zoom-in' data-aos-duration="1000" data-aos-delay="200"></div>
                    <div class="page-subtitle" data-aos='zoom-in' data-aos-duration="1000" data-aos-delay="400"></div>
                    <div class="feature">
                        <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='5' data-aos-duration='1000'
                             data-aos-delay='5' class="data-container github-card"></div>
                    </div>
                    <!-- element list -->
                    <div class="titles-container">
                        <!-- Projects -->
                        <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='5' data-aos-duration='1000'
                             data-aos-delay='50' class="projects-title section-title"></div>
                        <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='50' data-aos-duration='1000'
                             data-aos-delay='50' class="projects-content list"></div>
                        <!-- Contributions -->
                        <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='50' data-aos-duration='1000'
                             data-aos-delay='50' class="contributions-title section-title"></div>
                        <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='50' data-aos-duration='1000'
                             data-aos-delay='50' class="contributions-content list"></div>
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
        console.log("init projects");
        const collection = DataView.projects;
        const element = this.getElement();

        if (!element) return;

        // Titles
        const pageTitle = element.querySelector(".page-title");
        const pageSubtitle = element.querySelector(".page-subtitle");
        const projectsTitle = element.querySelector(".projects-title");
        const contributionsTitle = element.querySelector(".contributions-title");

        if (pageTitle) pageTitle.innerHTML = collection.title;
        if (pageSubtitle) pageSubtitle.innerHTML = collection.subtitle;
        if (projectsTitle) projectsTitle.innerHTML = "[ Projects ]";
        if (contributionsTitle) contributionsTitle.innerHTML = "[ Contributions ]";

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

    private loadData(): void {
        const element = this.getElement();
        if (!element) return;

        // generating user-card
        const githubCard = element.querySelector(".github-card");
        if (githubCard) {
            githubCard.innerHTML = `<img class="github-card-avatar lazy" src="" alt="Profile Image" data-src="${this.userData.avatar_url}" alt="${this.userData.name}"><div class="github-card-title">${this.userData.name} (${this.userData.login})</div><div class="github-card-content"><div class="data-detail-container github-card-element"><a href="https://github.com/${this.userData.login}?tab=repositories"><strong>${this.userData.public_repos}</strong><br/>Repos</a></div><div class="data-detail-container github-card-element"><a href="https://github.com/${this.userData.login}?tab=following"><strong>${this.userData.following}</strong><br/>Following</a></div><div class="data-detail-container github-card-element"><a href="https://github.com/${this.userData.login}?tab=followers"><strong>${this.userData.followers}</strong><br/>Followers</a></div></div>`;
        }

        // loading repositories
        const projects = element.querySelector(".projects-content") as HTMLElement;
        const forks = element.querySelector(".contributions-content") as HTMLElement;

        if (projects && forks) {
            this.projectsData.forEach(function (element: any, i: number) {
                const desc = `${String(element.description) === "null" ? "No description has been set for the repository" : String(element.description).substr(0, 64)}&hellip;`;
                const name = `${String(element.name).replace(/-/g, " ").replace(/_/g, " ")}`;
                const str = `<div data-aos='fade-up' data-aos-easing='ease-in-out' data-aos-offset='0' data-aos-duration='1000' data-aos-delay='0' class='data-container list-item project-item'><img alt="Repository Image" class='lazy' data-src='assets/images/projects/${element.id}.jpg'/><div class="info"><div class='title'>${name}</div><div class='text'><p>${desc}<p></div></div><div class="links"><div class='data-detail-container detail' data-link='projects/${i + 1}'>More</div></div></div>`;
                if (!element['fork']) {
                    projects.innerHTML += str;
                } else {
                    forks.innerHTML += str;
                }
            });
        }

        // assign click handlers
        element.querySelectorAll(".project-item .links .detail").forEach(item => {
            item.addEventListener("click", () => {
                soundSystemInstance.playClick();
                const link = item.getAttribute("data-link")!!;
                console.log("project-item clicked: ", link);
                navigationInstance.go(link);
            })
        });

        // placeholder inject
        element.querySelectorAll(".list-item img").forEach(image => {
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
export { Projects, projectsInstance }