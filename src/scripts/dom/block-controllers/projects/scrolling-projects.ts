/*
 * Created on Sat Mar 09 2024
 * Author: Connor Doman
 */

import { getImageColor } from "../../../files";
import { MarqueeCanvas } from "../../../marquee/marquee";
import { Strip } from "../../../marquee/row";
import BlockController from "../block-controller";

interface SelectedProject {
    name: string;
    url: URL;
    imageUrl: URL;
    color: string;
}

export default class ScrollingProjectsController extends BlockController {
    static readonly NEXT_PROJECT_DELAY_MS: number = 10000;
    static readonly RETRY_COLOR_DELAY_MS: number = 250;
    static readonly DEFAULT_COLOR: string = "#E9EBEA";

    debug: boolean = true;

    private projectNameHeading: HTMLHeadingElement;
    private projectBlurb: HTMLElement;
    private projectImage: HTMLImageElement;
    private viewProjectButton: HTMLElement;

    private fadedOut: boolean;

    private marquee: MarqueeCanvas;
    private marqueeCanvasContainer: HTMLElement;
    private marqueeInterval: number;
    private projectNames: Set<string>;

    private projectData: SelectedProject[];
    private currentProject: SelectedProject;
    private randomProjectOrder: number[];

    private currentProjectIndex: number;
    private updateInterval: number;

    setup(): boolean {
        this.marqueeCanvasContainer = this.block.querySelector(".canvas-container") as HTMLElement;
        const validBlock = this.validate(this.marqueeCanvasContainer, "No canvas container found.");
        if (!validBlock) return false;

        this.currentProjectIndex = 0;
        this.projectNameHeading = this.block.querySelector(".selected-project-name") as HTMLHeadingElement;
        this.projectBlurb = this.block.querySelector(".project-blurb") as HTMLElement;
        this.projectImage = this.block.querySelector(".project-image") as HTMLImageElement;
        this.viewProjectButton = this.block.querySelector(".view-button") as HTMLElement;

        this.currentProject = {
            name: "Our Projects",
            url: new URL("#not-found", window.location.href),
            imageUrl: new URL("#not-found", window.location.href),
            color: ScrollingProjectsController.DEFAULT_COLOR,
        };

        this.gatherProjectData();
        this.precalculateColors();
        this.shuffleProjectOrder();
        this.update();
        this.prepMarqueeData();

        return true;
    }

    private gatherProjectData() {
        const allProjects = this.block.querySelectorAll(".project-ribbon ul li");
        this.validate(allProjects.length > 0, "No projects found.");

        const seenProjects: Set<string> = new Set();
        const projectData: SelectedProject[] = [];
        for (let i = 0; i < allProjects.length; i++) {
            const project = allProjects[i];
            if (!project) continue;

            const link = project.querySelector("a");
            const image = project.querySelector("img");
            if (!link || !image) continue;

            const name = link.innerText;

            if (seenProjects.has(name)) continue;
            seenProjects.add(name);

            const url = new URL(link.href);
            const imageUrl = new URL(image.src);

            projectData.push({ name, url, imageUrl, color: ScrollingProjectsController.DEFAULT_COLOR });
        }

        this.projectData = projectData;
    }

    private async precalculateColors() {
        if (!this.projectData) return;

        for (const project of this.projectData) {
            try {
                const imageColor: string = await getImageColor(project.imageUrl.href);
                project.color = imageColor;
            } catch (error: any) {
                this.error(error.message, error.stack);
            }
        }
    }

    private shuffleProjectOrder() {
        const shuffled: number[] = [];
        const used = new Set<number>();

        while (shuffled.length < this.projectData.length) {
            const randomIndex = Math.floor(Math.random() * this.projectData.length);
            if (used.has(randomIndex)) continue;

            shuffled.push(randomIndex);
            used.add(randomIndex);
        }

        this.randomProjectOrder = shuffled;
    }

    private update() {
        this.updateCurrentProject();
        this.fadeOut();
        this.projectImage.addEventListener("transitionend", () => {
            this.updateProjectShowcase();
            this.fadeIn();
        });
    }

    private updateCurrentProject() {
        if (!this.projectData || this.projectData.length === 0) return;

        const index = this.randomProjectOrder[this.currentProjectIndex];
        const project = this.projectData[index];

        this.warn(`Updating to project ${project.name} at index ${index} (current index: ${this.currentProjectIndex})`);

        this.currentProject = project;
    }

    private updateProjectShowcase() {
        this.marqueeCanvasContainer.setAttribute("data-project", this.currentProject.name);
        this.projectNameHeading.innerHTML = this.currentProject.name;
        this.projectBlurb.style.setProperty("--project-blurb-color", this.currentProject.color);
        this.projectImage.src = this.currentProject.imageUrl.href;
        this.viewProjectButton.querySelector("a")?.setAttribute("href", this.currentProject.url.href);
    }

    private nextProject() {
        this.currentProjectIndex = (this.currentProjectIndex + 1) % this.projectData.length;
        this.updateCurrentProject();
    }

    private previousProject() {
        this.currentProjectIndex = (this.currentProjectIndex - 1) % this.projectData.length;
        this.updateCurrentProject();
    }

    private fadeOutProjectImage() {
        this.projectImage.style.opacity = "0";
    }

    private fadeInProjectImage() {
        this.projectImage.style.opacity = "1";
    }

    private fadeOut() {
        this.fadeOutProjectImage();
        this.projectNameHeading.style.opacity = "0";
        this.fadedOut = true;
    }

    private fadeIn() {
        this.fadeInProjectImage();
        this.projectNameHeading.style.opacity = "1";
        this.fadedOut = false;
    }

    private startProjectCycling() {
        this.updateInterval = window.setInterval(() => {
            this.nextProject();
            this.update();
        }, ScrollingProjectsController.NEXT_PROJECT_DELAY_MS);
    }

    private stopProjectCycling() {
        window.clearInterval(this.updateInterval);
    }

    private prepMarqueeData() {
        const projectsArea = this.block.querySelector(".projects") as HTMLElement;

        if (projectsArea) {
            projectsArea.style.display = "none";
        }

        this.getProjectNamesFromBlock(projectsArea);
        this.prepareMarquee();
    }

    private getProjectNamesFromBlock(projectsArea: HTMLElement) {
        const projectLinks: NodeListOf<HTMLAnchorElement> = projectsArea.querySelectorAll(".projects ul li a");

        if (projectLinks.length === 0) {
            this.error("No project links found");
            return;
        }

        this.projectNames = new Set();

        Array.from(projectLinks).forEach((link: HTMLAnchorElement) => {
            const innerText = link.innerText;

            if (!innerText) return;

            this.projectNames.add(innerText);
        });
    }

    private prepareMarquee() {
        if (this.marquee) {
            this.marquee.destroy();
        }

        const blockRect = this.marqueeCanvasContainer.getBoundingClientRect();
        const blockWidth = blockRect.width;
        const blockHeight = blockRect.height;

        Strip.wordSpacing = 64;
        this.marquee = new MarqueeCanvas(this.marqueeCanvasContainer, blockWidth, blockHeight, 3);
        this.marquee.placeCanvas(0, 0);
        this.marquee.separator = "\u2014"; // em dash
        this.marquee.words = Array.from(this.projectNames);
        this.marquee.setup();
    }

    private startMarquee() {
        this.marqueeInterval = window.setInterval(() => {
            try {
                this.marquee.activeWord = this.block.getAttribute("data-project") || "";

                this.marquee.update();
                this.marquee.draw();
            } catch (err: any) {
                this.error(err.message, err.stack);
                this.stopMarquee();
            }
        }, 32);
    }

    private stopMarquee() {
        window.clearInterval(this.marqueeInterval);
    }

    onEnterViewport(): void {
        this.startProjectCycling();
        this.startMarquee();
    }
    onExitViewport(): void {
        this.stopProjectCycling();
        this.stopMarquee();
    }

    onPageResize(width: number, height: number): void {
        this.prepareMarquee();
    }

    onMouseMove(e: MouseEvent): void {
        // if mouse is intersecting with project blurb backing, move view button to those coordinates. do not run if mouse is not intersecting with project blurb backing
        const block = this.block;
        const viewProjectButton = this.viewProjectButton;

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

    onMouseEnter(e: MouseEvent): void {}
    onMouseLeave(e: MouseEvent): void {}
    onClick(x: number, y: number): void {}
    onPageScroll(scrollY: number): void {}
    onPageLoad(): void {}
}
