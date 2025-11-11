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
    private allProjectsHTML: { element: any, html: string, name: string, isFork: boolean }[] = [];

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
                    <!-- search box -->
                    <div class="search-container" data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='5' data-aos-duration='1000' data-aos-delay='100'>
                        <i class="fas fa-search search-icon"></i>
                        <input type="text" class="search-input" placeholder="Search projects...">
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

    async fetchData(): Promise<void> {
        console.log('async fetch repositories');
        this.fetchOnProgress = true;

        try {
            // Fetch user data
            const userResponse = await fetch(DataView.projects.githubUserAPI);
            if (!userResponse.ok) {
                throw Error(userResponse.statusText);
            }
            this.userData = await userResponse.json();

            // Fetch all repository pages
            let allRepos: any[] = [];
            let page = 1;
            let hasMorePages = true;

            while (hasMorePages) {
                const reposUrl = `${DataView.projects.githubProjectsAPI}&page=${page}`;
                console.log(`Fetching repositories page ${page}...`);

                const reposResponse = await fetch(reposUrl);
                if (!reposResponse.ok) {
                    throw Error(reposResponse.statusText);
                }

                const repos = await reposResponse.json();

                if (repos.length === 0) {
                    hasMorePages = false;
                } else {
                    allRepos = allRepos.concat(repos);
                    page++;
                }
            }

            console.log(`Total repositories fetched: ${allRepos.length}`);
            this.projectsData = allRepos;
            this.fetchComplete = true;
            this.loadData();
        } catch (error) {
            console.log(error);
        } finally {
            this.fetchOnProgress = false;
        }
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
            this.allProjectsHTML = [];
            this.projectsData.forEach((repoElement: any, i: number) => {
                const desc = `${String(repoElement.description) === "null" ? "No description has been set for the repository" : String(repoElement.description).substr(0, 64)}&hellip;`;
                const name = `${String(repoElement.name).replace(/-/g, " ").replace(/_/g, " ")}`;
                const str = `<div data-aos='fade-up' data-aos-easing='ease-in-out' data-aos-offset='0' data-aos-duration='1000' data-aos-delay='0' class='data-container list-item project-item'><img alt="Repository Image" class='lazy' data-src='assets/images/projects/${repoElement.id}.jpg'/><div class="info"><div class='title'>${name}</div><div class='text'><p>${desc}<p></div></div><div class="links"><div class='data-detail-container detail' data-link='projects/${i + 1}'>More</div></div></div>`;

                // Store project data for filtering
                this.allProjectsHTML.push({
                    element: repoElement,
                    html: str,
                    name: name.toLowerCase(),
                    isFork: repoElement['fork']
                });

                if (!repoElement['fork']) {
                    projects.innerHTML += str;
                } else {
                    forks.innerHTML += str;
                }
            });
        }

        // Setup search functionality
        const searchInput = element.querySelector(".search-input") as HTMLInputElement;
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                const query = (e.target as HTMLInputElement).value;
                this.filterProjects(query);
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

    private fuzzyMatch(pattern: string, str: string): boolean {
        pattern = pattern.toLowerCase();
        str = str.toLowerCase();

        let patternIdx = 0;
        let strIdx = 0;

        while (patternIdx < pattern.length && strIdx < str.length) {
            if (pattern[patternIdx] === str[strIdx]) {
                patternIdx++;
            }
            strIdx++;
        }

        return patternIdx === pattern.length;
    }

    private filterProjects(query: string): void {
        const element = this.getElement();
        if (!element) return;

        const projects = element.querySelector(".projects-content") as HTMLElement;
        const forks = element.querySelector(".contributions-content") as HTMLElement;

        if (!projects || !forks) return;

        if (!query.trim()) {
            // Show all projects
            projects.innerHTML = '';
            forks.innerHTML = '';
            this.allProjectsHTML.forEach(project => {
                if (!project.isFork) {
                    projects.innerHTML += project.html;
                } else {
                    forks.innerHTML += project.html;
                }
            });
        } else {
            // Filter projects with fuzzy search
            projects.innerHTML = '';
            forks.innerHTML = '';
            this.allProjectsHTML.forEach(project => {
                if (this.fuzzyMatch(query, project.name)) {
                    if (!project.isFork) {
                        projects.innerHTML += project.html;
                    } else {
                        forks.innerHTML += project.html;
                    }
                }
            });
        }

        // Re-assign click handlers
        element.querySelectorAll(".project-item .links .detail").forEach(item => {
            item.addEventListener("click", () => {
                soundSystemInstance.playClick();
                const link = item.getAttribute("data-link")!!;
                console.log("project-item clicked: ", link);
                navigationInstance.go(link);
            })
        });

        // Re-apply placeholder inject
        element.querySelectorAll(".list-item img").forEach(image => {
            image.addEventListener("error", () => {
                image.setAttribute("src", DataView.projects.placeHolder);
            });
        });

        // Update lazyload
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