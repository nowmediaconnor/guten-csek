/*
 * Created on Wed Aug 23 2023
 * Author: Connor Doman
 */

import { shuffle } from "../array";
import { BlockController, ControllerProperties } from "../dom";
import { getImageColor, imageToBase64 } from "../files";
import { randomInRange, randomIntInRange } from "../math";

export default class ScrollingProjectsController extends BlockController {
    name: string;

    debug: boolean = true;

    scrollingProjectsBlockClassName: string;

    marqueeRefreshRateMilliseconds: number = 12.5; // ms
    randomProjectRateMilliseconds: number = 5000; // ms
    marqueeIntervalId: number | null = null;
    randomProjectIntervalId: number | null = null;

    bufferImage: HTMLImageElement = new Image();

    scrollingProjectsBlock: HTMLElement | null;
    blurb: HTMLElement | null = null;
    projectImage: HTMLImageElement | null = null;
    viewProjectButton: HTMLElement | null = null;

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

    async precalculateColors() {
        if (!this.scrollingProjectsBlock) return;

        const allImages: NodeListOf<HTMLImageElement> =
            this.scrollingProjectsBlock.querySelectorAll(".project-ribbon ul li img");

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
        this.scrollingProjectsBlock = document.querySelector(
            `.${this.scrollingProjectsBlockClassName}`
        ) as HTMLDivElement;

        if (this.invalid(this.scrollingProjectsBlock)) {
            this.log("No scrolling projects block found.");
            return;
        }

        // this.prepareCanvas();
        this.precalculateColors();

        this.blurb = this.scrollingProjectsBlock.querySelector(".project-blurb");
        this.projectImage = this.scrollingProjectsBlock.querySelector(".project-image");
        this.viewProjectButton = this.scrollingProjectsBlock.querySelector(".view-button");
        // this.prepareRibbons(this.scrollingProjectsBlock);

        this.randomProjectIntervalId = window.setInterval(() => {
            while (!this.selectRandomProject());
        }, this.randomProjectRateMilliseconds);

        this.isInitialized = true;
    }

    prepareRibbons(projectsBlock: HTMLElement) {
        const containers: NodeListOf<HTMLElement> = projectsBlock.querySelectorAll(".project-ribbon");

        for (let i = 0; i < containers.length; i++) {
            const evenRow = i % 2 === 0;

            const ribbon = containers[i];

            if (!evenRow) {
                ribbon.classList.add("reverse");
            }

            const speed = randomIntInRange(3, 3) * 0.125;

            const ribbonRect = ribbon.getBoundingClientRect();
            const list = ribbon.querySelector("ul");

            if (!list) continue;

            const allListItems = list.querySelectorAll("li");
            const shuffledListItems = shuffle(Array.from(allListItems));

            list.innerHTML = "";
            for (const item of shuffledListItems) {
                if (!item) continue;

                list.appendChild(item);
                const dash = document.createElement("li");
                dash.innerHTML = "&nbsp;&mdash;&nbsp;";
                list.appendChild(dash);
            }

            let currentOffset = 0;

            const animateMarquee = (direction: number) => {
                direction = Math.sign(direction);

                if (direction === 0) return;

                const endListItem = list.querySelector("li:first-child");

                if (!endListItem) return;

                const endListItemRect = endListItem.getBoundingClientRect();
                const endListItemSide = direction > 0 ? endListItemRect.right : endListItemRect.left;
                const containerSide = direction > 0 ? ribbonRect.left : ribbonRect.right;

                switch (direction) {
                    case 1:
                        if (endListItemSide < containerSide) {
                            currentOffset = -1;
                            list.appendChild(endListItem);
                        }
                        list.style.left = `${currentOffset}px`;
                        break;
                    case -1:
                        if (endListItemSide > containerSide) {
                            currentOffset = 1;
                            list.appendChild(endListItem);
                        }
                        list.style.right = `${currentOffset}px`;
                        break;
                }

                currentOffset -= speed;
            };

            // this.marqueeIntervalId = window.setInterval(() => {
            //     animateMarquee(evenRow ? 1 : -1);
            // }, this.marqueeRefreshRateMilliseconds);
        }
    }

    clearHighlightedLinks() {
        if (!this.scrollingProjectsBlock) return;
        const highlights = this.scrollingProjectsBlock.querySelectorAll(".highlight-link");
        if (highlights.length > 0) {
            for (const link of highlights) {
                link.classList.remove("highlight-link");
            }
        }
    }

    selectRandomProject() {
        this.log("Selecting random project...");

        // this.clearHighlightedLinks();

        if (!this.blurb || !this.projectImage || !this.viewProjectButton) {
            this.log("No blurb, project image, or view project button found");
            return false;
        }
        this.projectImage.style.opacity = "0";

        const allProjects = this.scrollingProjectsBlock?.querySelectorAll(".project-ribbon ul li");
        if (!allProjects) {
            this.log("No projects found");
            return false;
        }

        const randomProject = allProjects[randomIntInRange(0, allProjects.length - 1)];
        if (!randomProject) {
            this.log("No random project found");
            return false;
        }

        const name = randomProject.querySelector("a")?.innerHTML;
        if (!name) {
            this.log("No name found");
            return false;
        } else if (name === this.highglightedProjectName) {
            this.log("Need to pick a different project.");
            return false;
        }
        this.highglightedProjectName = name;
        this.scrollingProjectsBlock?.setAttribute("data-project", name);

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

        const blurbRect = this.blurb.getBoundingClientRect();
        const imgX = randomInRange(0.5, 0.5);
        const imgY = randomInRange(0.5, 0.5);
        const linkX = randomInRange(0.75, 0.75);
        const linkY = randomInRange(0.75, 0.75);

        this.projectImage.src = img.src;

        this.projectImage.addEventListener("load", (e) => {
            if (!e.target) return;

            const elmt = e.target as HTMLImageElement;
            elmt.style.left = `${imgX * 100}%`;
            elmt.style.top = `${imgY * 100}%`;
            elmt.style.opacity = "1";
        });

        this.log("color:", color);
        this.blurb?.style.setProperty("--project-blurb-color", color);

        return true;
    }

    setBlurbImage(img: HTMLImageElement) {
        if (!this.projectImage) return;

        this.projectImage.src = img.src;

        this.projectImage.addEventListener("load", (e) => {
            if (!e.target) return;
            const elmt = e.target as HTMLElement;
            elmt.style.color = "red";
        });
    }

    onMouseMove(e: MouseEvent) {
        // if mouse is intersecting with project blurb backing, move view button to those coordinates. do not run if mouse is not intersecting with project blurb backing
        if (!this.scrollingProjectsBlock || !this.viewProjectButton) return;

        const blockRect = this.scrollingProjectsBlock.getBoundingClientRect();

        const x = e.clientX;
        const y = e.clientY;

        if (x < blockRect.left || x > blockRect.right || y < blockRect.top || y > blockRect.bottom) return;

        this.viewProjectButton.style.left = `${x - blockRect.left}px`;
        this.viewProjectButton.style.top = `${y - blockRect.top}px`;
    }
}
