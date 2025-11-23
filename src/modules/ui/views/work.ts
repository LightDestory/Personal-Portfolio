import modelView, { ViewConfig } from "./modelView";
import { DataView } from "../../data/Dataset";

interface TimelineItem {
    date: string;
    title: string;
    subtitle?: string;
    description: string;
    authors?: string;
    abstract?: string;
    link?: string;
    type?: "paper" | "journal";
}

interface TimelineCategory {
    category: string;
    items: TimelineItem[];
}

class Work extends modelView {
    constructor() {
        const config: ViewConfig = {
            id: "work",
            template: `
                <div class="work page hide">
                    <div class="page-title" data-aos='zoom-in' data-aos-duration="1000" data-aos-delay="200">
                        <span class="title-text"></span>
                        <div class="page-subtitle" data-aos='zoom-in' data-aos-duration="1000" data-aos-delay="400"></div>
                    </div>
                    <div class="feature">
                        <img alt="Work Image" class='lazy feature-image'/>
                    </div>
                    <!-- notes -->
                    <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='350' data-aos-duration='1000'
                         data-aos-delay='50' class="work-note-title section-title"></div>
                    <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='350' data-aos-duration='1000'
                         data-aos-delay='50' class="work-notes"></div>
                    <!-- timeline -->
                    <div class="timeline-container" data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='50' data-aos-duration='1000' data-aos-delay='50'></div>
                </div>
            `,
            isPage: true
        };
        super(config);
    }

    hide(): void {
        console.log("not implemented");
    }

    show(): void {
        console.log("not implemented");
    }

    init(): void {
        console.log("init work");
        const collection = DataView.work;
        const element = this.getElement();

        if (!element) return;

        const pageTitle = element.querySelector(".page-title .title-text");
        const pageSubtitle = element.querySelector(".page-subtitle");
        const featureImage = element.querySelector(".feature .feature-image");
        const workNoteTitle = element.querySelector(".work-note-title");
        const workNotes = element.querySelector(".work-notes");
        const timelineContainer = element.querySelector(".timeline-container");

        if (pageTitle) pageTitle.innerHTML = collection.title;
        if (pageSubtitle) pageSubtitle.innerHTML = collection.subtitle;
        if (featureImage) featureImage.setAttribute("data-src", collection.splash);
        if (workNoteTitle) workNoteTitle.innerHTML = "[ Notes ]";
        if (workNotes && collection.notes) workNotes.innerHTML = collection.notes;

        if (timelineContainer && collection.timeline) {
            let html = "";
            (collection.timeline as TimelineCategory[]).forEach(cat => {
                html += `<div class="timeline-category">
                            <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='350' data-aos-duration='1000'
                                data-aos-delay='50' class="section-title">[ ${cat.category} ]</div>
                            <div data-aos='fade-in' data-aos-easing='ease-in-out' data-aos-offset='350' data-aos-duration='1000'
                                data-aos-delay='50' class="timeline-items">`;

                cat.items.forEach(item => {
                    const isPublication = item.authors !== undefined;
                    html += `<div class="timeline-item">
                                <div class="timeline-marker"></div>
                                <div class="timeline-content">
                                    <div class="timeline-header-row">
                                        <div class="timeline-date">${item.date}</div>
                                        ${item.type ? `<span class="timeline-type badge-${item.type}">${item.type}</span>` : ''}
                                    </div>
                                    <h4 class="timeline-title">${item.title}</h4>
                                    ${item.subtitle ? `<p class="timeline-subtitle">${item.subtitle}</p>` : ""}`;

                    if (isPublication) {
                        if (item.authors) {
                            html += `<p class="timeline-authors"><strong>Authors:</strong> ${item.authors}</p>`;
                        }
                        if (item.link && item.link !== "#") {
                            html += `<div class="timeline-link"><a href="${item.link}" target="_blank" class="timeline-btn">View Publication <i class="fas fa-external-link-alt"></i></a></div>`;
                        }
                        if (item.abstract) {
                            html += `<div class="timeline-accordion">
                                        <div class="accordion-header">
                                            <span>Abstract</span>
                                            <i class="fas fa-chevron-down"></i>
                                        </div>
                                        <div class="accordion-content">
                                            <p>${item.abstract}</p>
                                        </div>
                                     </div>`;
                        }
                    } else {
                        html += `<p class="timeline-description">${item.description}</p>`;
                    }

                    html += `   </div>
                             </div>`;
                });

                html += `   </div>
                         </div>`;
            });
            timelineContainer.innerHTML = html;

            // Add event listeners for accordions
            const accordions = timelineContainer.querySelectorAll('.accordion-header');
            accordions.forEach(acc => {
                acc.addEventListener('click', function (this: HTMLElement) {
                    this.classList.toggle('active');
                    const content = this.nextElementSibling as HTMLElement;
                    if (content) {
                        if (content.style.maxHeight) {
                            content.style.maxHeight = "";
                            content.classList.remove('show');
                        } else {
                            content.classList.add('show');
                            content.style.maxHeight = content.scrollHeight + "px";
                        }
                    }
                });
            });
        }
    }
}

const workInstance: Work = new Work();
export { Work, workInstance }