/*
 * Created on Wed Aug 23 2023
 * Author: Connor Doman
 */

import { BlockController } from "../dom";
import { getImageColor } from "../files";
import ProjectsMarqueeController from "./projects-marquee-controller";

interface SelectedProject {
    name: string;
    url: URL;
    imageUrl: URL;
    color: string;
}

export class ScrollingProjectsBlock {
    static readonly nextProjectDelayMs: number = 10000;
    static readonly retryColorDelayMs: number = 250;
    static readonly defaultColor: string = "#e9ebea";

    block: HTMLElement;
    canvasContainer: HTMLElement;
    projectNameHeading: HTMLHeadingElement;
    blurb: HTMLElement;
    projectImage: HTMLImageElement;
    viewProjectButton: HTMLElement;

    marqueeController: ProjectsMarqueeController;

    projectData: SelectedProject[];
    currentProject: SelectedProject;
    randomProjectOrder: number[];

    currentProjectIndex: number = 0;
    updateProjectIntervalId: number = -1;

    fadedOut: boolean = false;

    observer: IntersectionObserver;

    constructor(block: HTMLElement) {
        this.block = block;

        this.canvasContainer = block.querySelector(".canvas-container") as HTMLElement;
        this.projectNameHeading = block.querySelector(".selected-project-name") as HTMLHeadingElement;
        this.blurb = block.querySelector(".project-blurb") as HTMLElement;
        this.projectImage = block.querySelector(".project-image") as HTMLImageElement;
        this.viewProjectButton = block.querySelector(".view-button") as HTMLElement;

        this.currentProject = {
            name: "Our Projects",
            url: new URL("#not-found", window.location.href),
            imageUrl: new URL("#not-found", window.location.href),
            color: ScrollingProjectsBlock.defaultColor,
        };

        this.marqueeController = new ProjectsMarqueeController(this.canvasContainer);
    }

    get blockElements() {
        return {
            block: this.block,
            canvasContainer: this.canvasContainer,
            projectNameHeading: this.projectNameHeading,
            blurb: this.blurb,
            projectImage: this.projectImage,
            viewProjectButton: this.viewProjectButton,
        };
    }

    setup() {
        this.prepObserver();
        this.gatherProjectData();
        this.precalculateColors();
        this.shuffleProjectOrder();
        this.update();
        this.marqueeController.setup();

        // document.addEventListener("visibilitychange", () => {
        //     if (document.visibilityState === "visible" && this.fadedOut) {
        //         this.start();
        //     }
        // });
    }

    prepObserver() {
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0,
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.log("Starting scrolling projects block");
                    this.start();
                } else {
                    this.log("Stopping scrolling projects block");
                    this.stop();
                }
            });
        }, observerOptions);

        this.observer.observe(this.block);
    }

    gatherProjectData() {
        const allProjects = this.block.querySelectorAll(".project-ribbon ul li");
        if (!allProjects) {
            this.projectData = [];
            return;
        }

        const seenProjects: string[] = [];
        const projectData: SelectedProject[] = [];
        for (let i = 0; i < allProjects.length; i++) {
            const project = allProjects[i];
            if (!project) continue;

            const link = project.querySelector("a");
            if (!link) continue;

            const imageSrc = project.querySelector("img")?.src;
            if (!imageSrc) continue;

            const name = link.innerHTML;
            if (seenProjects.includes(name)) continue;
            seenProjects.push(name);

            const url = new URL(link.href);
            const imageUrl = new URL(imageSrc);

            projectData.push({ name, url, imageUrl, color: ScrollingProjectsBlock.defaultColor });
        }

        this.projectData = projectData;
    }

    async precalculateColors() {
        if (!this.projectData) {
            this.log("Tried to find colors, no project data found");
            return;
        }

        for (const project of this.projectData) {
            try {
                const imageColor: string = await getImageColor(project.imageUrl.href);
                this.log(`Found color for ${project.name}:`, imageColor);
                project.color = imageColor;
            } catch (err: any) {
                console.error("Error:", err);
            }
        }

        this.log({ projectData: this.projectData });
    }

    shuffleProjectOrder() {
        const shuffled: number[] = [];
        const used = new Set<number>();

        while (shuffled.length < this.projectData.length) {
            const index = Math.floor(Math.random() * this.projectData.length);

            if (!used.has(index)) {
                used.add(index);
                shuffled.push(index);
            }
        }

        this.randomProjectOrder = shuffled;
    }

    updateCurrentProject() {
        if (!this.projectData) return;

        const index = this.randomProjectOrder[this.currentProjectIndex];
        const project = this.projectData[index];

        this.currentProject = project;
    }

    nextProject() {
        this.currentProjectIndex = (this.currentProjectIndex + 1) % this.projectData.length;
        this.updateCurrentProject();
    }

    previousProject() {
        this.currentProjectIndex = (this.currentProjectIndex - 1) % this.projectData.length;
        this.updateCurrentProject();
    }

    update() {
        this.updateCurrentProject();
        this.fadeOut();
        this.projectImage.addEventListener("transitionend", () => {
            this.updateShowcasedElements();
            this.fadeIn();
        });
    }

    updateShowcasedElements() {
        this.canvasContainer.setAttribute("data-project", this.currentProject.name);
        this.projectNameHeading.innerHTML = this.currentProject.name;
        this.blurb.style.setProperty("--project-blurb-color", this.currentProject.color);
        this.projectImage.src = this.currentProject.imageUrl.href;
        this.viewProjectButton.querySelector("a")?.setAttribute("href", this.currentProject.url.href);
    }

    fadeOutProjectImage() {
        this.projectImage.style.opacity = "0";
    }

    fadeInProjectImage() {
        this.projectImage.style.opacity = "1";
    }

    fadeOut() {
        this.fadeOutProjectImage();
        this.projectNameHeading.style.opacity = "0";
        this.fadedOut = true;
    }

    fadeIn() {
        this.fadeInProjectImage();
        this.projectNameHeading.style.opacity = "1";
        this.fadedOut = false;
    }

    start() {
        this.updateProjectIntervalId = window.setInterval(() => {
            this.nextProject();
            this.update();
        }, ScrollingProjectsBlock.nextProjectDelayMs);
    }

    stop() {
        window.clearInterval(this.updateProjectIntervalId);
    }

    log(...args: any[]) {
        console.log(`[${this.constructor.name}]`, ...args);
    }
}

export default class ScrollingProjectsController extends BlockController {
    name: string;
    debug: boolean = true;
    blocks: NodeListOf<HTMLElement>;

    scrollingProjectsBlockClassName: string;

    projectsBlocks: ScrollingProjectsBlock[] = [];

    isInitialized: boolean;

    constructor(scrollingProjectsBlockClassName: string) {
        super();
        this.name = "ScrollingProjectsController";

        if (!scrollingProjectsBlockClassName) throw new Error("Scrolling projects block class name not provided");
        else if (scrollingProjectsBlockClassName[0] === ".")
            scrollingProjectsBlockClassName = scrollingProjectsBlockClassName.slice(1);

        this.scrollingProjectsBlockClassName = scrollingProjectsBlockClassName;
    }

    setup() {
        this.blocks = document.querySelectorAll("." + this.scrollingProjectsBlockClassName);

        if (this.invalid(this.blocks.length)) {
            this.log("No scrolling projects block found.");
            return;
        }

        this.log(`Found ${this.blocks.length} scrolling projects blocks.`);

        // this.prepareCanvas();
        this.blocks.forEach((block: HTMLElement, i: number) => {
            if (!block) return;

            const scrollingProjectsBlock = new ScrollingProjectsBlock(block);
            scrollingProjectsBlock.setup();
            this.projectsBlocks[i] = scrollingProjectsBlock;
        });

        this.isInitialized = true;
    }

    onMouseMove(e: MouseEvent, blockIndex: number) {
        // if mouse is intersecting with project blurb backing, move view button to those coordinates. do not run if mouse is not intersecting with project blurb backing
        const scrollingProjectsBlock = this.projectsBlocks[blockIndex];
        if (!scrollingProjectsBlock) return;

        const { block, viewProjectButton } = scrollingProjectsBlock.blockElements;

        const blockRect = block.getBoundingClientRect();
        const buttonRect = viewProjectButton.getBoundingClientRect();

        const buttonHalfWidth = buttonRect.width / 2;
        const buttonHalfHeight = buttonRect.height / 2;

        const x = e.clientX;
        const y = e.clientY;

        if (x < blockRect.left || x > blockRect.right || y < blockRect.top || y > blockRect.bottom) return;

        const newX = x - blockRect.left;
        const newY = y - blockRect.top;

        viewProjectButton.style.left = `${newX}px`;
        viewProjectButton.style.top = `${newY}px`;

        if (newX < buttonHalfWidth) viewProjectButton.style.left = `${buttonHalfWidth}px`;
        else if (newX > blockRect.width - buttonHalfWidth)
            viewProjectButton.style.left = `${blockRect.width - buttonHalfWidth}px`;

        if (newY < buttonHalfHeight) viewProjectButton.style.top = `${buttonHalfHeight}px`;
        else if (newY > blockRect.height - buttonHalfHeight)
            viewProjectButton.style.top = `${blockRect.height - buttonHalfHeight}px`;
    }

    onScroll(e: Event, pos: number): void {}
}
