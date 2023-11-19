/*
 * Created on Wed Aug 23 2023
 * Author: Connor Doman
 */

import { shuffle } from "../array";
import { BlockController, ControllerProperties } from "../dom";
import { getImageColor, imageToBase64 } from "../files";
import { randomInRange, randomIntInRange } from "../math";
import ProjectsMarqueeController from "./projects-marquee-controller";

interface SelectedProject {
    name: string;
    url: URL;
    color: string;
}

export class ScrollingProjectsBlock {
    block: HTMLElement;
    projectNameHeading: HTMLHeadingElement;
    blurb: HTMLElement;
    projectImage: HTMLImageElement;
    viewProjectButton: HTMLElement;

    projectData: SelectedProject[];
    currentProject: SelectedProject;
    randomProjectOrder: number[];

    constructor(block: HTMLElement) {
        this.block = block;

        this.projectNameHeading = block.querySelector(".selected-project-name") as HTMLHeadingElement;
        this.blurb = block.querySelector(".project-blurb") as HTMLElement;
        this.projectImage = block.querySelector(".project-image") as HTMLImageElement;
        this.viewProjectButton = block.querySelector(".view-button") as HTMLElement;

        this.currentProject = {
            name: "Our Projects",
            url: new URL("#not-found", window.location.href),
            color: "#131313",
        };

        this.gatherProjectData();
        this.precalculateColors();
        this.shuffleProjectOrder();
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

            const name = link.innerHTML;
            if (seenProjects.includes(name)) continue;
            seenProjects.push(name);

            const url = new URL(link.href);

            projectData.push({ name, url, color: "#131313" });
        }

        this.projectData = projectData;
    }

    async precalculateColors() {
        if (!this.projectData) return;

        for (const project of this.projectData) {
            while (!project.color) {
                try {
                    const imageColor: string = await getImageColor(project.url.href);

                    project.color = imageColor;
                } catch (err: any) {
                    console.log("Error:", err);
                }
            }
        }
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
}

export default class ScrollingProjectsController extends BlockController {
    name: string;
    debug: boolean = true;

    scrollingProjectsBlockClassName: string;

    marqueeRefreshRateMilliseconds: number = 12.5; // ms
    randomProjectRateMilliseconds: number = 5000; // ms
    marqueeIntervalId: number | null = null;
    randomProjectIntervalId: number | null = null;

    bufferImage: HTMLImageElement = new Image();

    blocks: NodeListOf<HTMLElement>;
    block: HTMLElement | null;
    blurb: HTMLElement | null = null;
    projectImage: HTMLImageElement | null = null;
    viewProjectButton: HTMLElement | null = null;

    marqueeControllers: ProjectsMarqueeController[] = [];
    canvasContainers: HTMLElement[] = [];
    projectNameHeadings: HTMLHeadingElement[] = [];
    blurbs: HTMLElement[] = [];
    projectImages: HTMLImageElement[] = [];
    viewProjectButtons: HTMLElement[] = [];
    highlightedProjectNames: string[] = [];

    highglightedProjectName: string;

    canvas: HTMLCanvasElement | null = null;

    colorCache: Map<string, string> = new Map<string, string>();

    isInitialized: boolean;

    constructor(scrollingProjectsBlockClassName: string) {
        super();
        this.name = "ScrollingProjectsController";

        if (!scrollingProjectsBlockClassName) throw new Error("Scrolling projects block class name not provided");
        else if (scrollingProjectsBlockClassName[0] === ".")
            scrollingProjectsBlockClassName = scrollingProjectsBlockClassName.slice(1);

        this.scrollingProjectsBlockClassName = scrollingProjectsBlockClassName;

        this.highglightedProjectName = "";
    }

    async precalculateColors(block: HTMLElement) {
        // if (!this.block) return;

        const allImages: NodeListOf<HTMLImageElement> = block.querySelectorAll(".project-ribbon ul li img");

        if (!allImages) {
            this.log("No projects found");
            return false;
        }

        const uniqueSources: string[] = [];
        for (let i = 0; i < allImages.length; i++) {
            const img = allImages[i];
            if (!img) continue;

            if (uniqueSources.includes(img.src)) continue;
            uniqueSources.push(img.src);

            // const base64Data: string = await imageToBase64(img.src);
            // this.determineMainColorForImage(img);
        }

        for (const source of uniqueSources) {
            try {
                const imageColor: string = await getImageColor(source);

                this.colorCache.set(source, imageColor);
                this.log(imageColor);
            } catch (err: any) {
                this.log("Error:", err);
            }
        }

        for (let i = 0; i < allImages.length; i++) {
            const img = allImages[i];
            if (!img) continue;

            const color = this.colorCache.get(img.src);
            if (!color) continue;

            img.setAttribute("data-color", color);
        }
    }

    setup() {
        this.blocks = document.querySelectorAll("." + this.scrollingProjectsBlockClassName);
        this.block = document.querySelector(`.${this.scrollingProjectsBlockClassName}`) as HTMLDivElement;

        if (this.invalid(this.blocks.length)) {
            this.log("No scrolling projects block found.");
            return;
        }

        this.log(`Found ${this.blocks.length} scrolling projects blocks.`);

        // this.prepareCanvas();
        this.blocks.forEach((block: HTMLElement, i: number) => {
            if (!block) return;

            this.precalculateColors(block);

            const canvasContainer = block.querySelector(".canvas-container") as HTMLElement;
            const selectedProjectHeading = block.querySelector(".selected-project-name") as HTMLHeadingElement;
            const blurb = block.querySelector(".project-blurb") as HTMLElement;
            const projectImage = block.querySelector(".project-image") as HTMLImageElement;
            const viewProjectButton = block.querySelector(".view-button") as HTMLElement;

            if (!canvasContainer || !selectedProjectHeading || !blurb || !projectImage || !viewProjectButton) {
                this.err("No blurb, project image, or view project button found");
                return;
            }

            this.canvasContainers[i] = canvasContainer;
            this.projectNameHeadings[i] = selectedProjectHeading;
            this.blurbs[i] = blurb;
            this.projectImages[i] = projectImage;
            this.viewProjectButtons[i] = viewProjectButton;

            const marqueeController = new ProjectsMarqueeController(canvasContainer);
            marqueeController.setup();
            this.marqueeControllers[i] = marqueeController;

            this.randomProjectIntervalId = window.setInterval(() => {
                while (!this.selectRandomProject(i));
            }, this.randomProjectRateMilliseconds);
        });

        this.log(
            `Accessory elements? ${
                this.blurbs.length > 0 && this.projectImages.length > 0 && this.viewProjectButtons.length > 0
            }`
        );

        this.isInitialized = true;
    }

    selectRandomProject(blockIndex: number) {
        this.log("Selecting random project...");
        const blockElements = this.getBlockElements(blockIndex);
        if (!blockElements) return false;

        const { block, blurb, projectImage, viewProjectButton } = blockElements;

        if (!blurb || !projectImage || !viewProjectButton) {
            this.log("No blurb, project image, or view project button found");
            return false;
        }
        projectImage.style.opacity = "0";

        const allProjects = block.querySelectorAll(".project-ribbon ul li");
        if (!allProjects) {
            this.log("No projects found");
            return false;
        }

        const randomProject = allProjects[randomIntInRange(0, allProjects.length - 1)];
        if (!randomProject) {
            this.log("No random project found");
            return false;
        }
        const randomProjectLink = randomProject.querySelector("a");
        const randomProjectName = randomProjectLink?.innerHTML;
        const randomProjectUrl = randomProjectLink?.href;
        if (!randomProjectName) {
            this.log("No name found");
            return false;
        } else if (randomProjectName === this.highglightedProjectName) {
            this.log("Need to pick a different project.");
            return false;
        }
        this.highlightedProjectNames[blockIndex] = randomProjectName;
        this.projectNameHeadings[blockIndex].innerHTML = randomProjectName;
        block.setAttribute("data-project", randomProjectName);
        viewProjectButton.querySelector("a")?.setAttribute("href", randomProjectUrl || "#not-found");

        const link = randomProject.querySelector("a");
        if (!link) {
            this.log("No link found");
            return false;
        }

        const img = randomProject.querySelector("img");
        if (!img) {
            this.log("No image found");
            return false;
        }

        link.classList.add("highlight-link");

        const color = img.getAttribute("data-color");

        const imgX = randomInRange(0.5, 0.5);
        const imgY = randomInRange(0.5, 0.5);

        projectImage.src = img.src;

        projectImage.addEventListener("load", (e) => {
            if (!e.target) return;

            const elmt = e.target as HTMLImageElement;
            elmt.style.left = `${imgX * 100}%`;
            elmt.style.top = `${imgY * 100}%`;
            elmt.style.opacity = "1";
        });

        this.log("color:", color);
        blurb.style.setProperty("--project-blurb-color", color);

        return true;
    }

    onMouseMove(e: MouseEvent, blockIndex: number) {
        // if mouse is intersecting with project blurb backing, move view button to those coordinates. do not run if mouse is not intersecting with project blurb backing
        const blockElements = this.getBlockElements(blockIndex);
        if (!blockElements) return;

        const { block, viewProjectButton } = blockElements;

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

    getBlockElements(blockIndex: number) {
        const block = this.blocks[blockIndex];
        if (!block) return;

        const blurb = this.blurbs[blockIndex];
        const projectImage = this.projectImages[blockIndex];
        const viewProjectButton = this.viewProjectButtons[blockIndex];

        if (!blurb || !projectImage || !viewProjectButton) {
            this.log("No blurb, project image, or view project button found");
            return;
        }

        return { block, blurb, projectImage, viewProjectButton };
    }
}
