/*
 * Created on Wed Aug 23 2023
 * Author: Connor Doman
 */

import { shuffle } from "./array";
import { getImageColor, imageToBase64 } from "./files";
import { randomIntInRange } from "./math";

export default class ScrollingProjectsController {
    debug: boolean = true;

    marqueeRefreshRateMilliseconds: number = 12.5; // ms
    randomProjectRateMilliseconds: number = 10000; // ms
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

    constructor(scrollingProjectsBlockClassName: string) {
        if (!scrollingProjectsBlockClassName) throw new Error("Scrolling projects block class name not provided");
        else if (scrollingProjectsBlockClassName[0] === ".")
            scrollingProjectsBlockClassName = scrollingProjectsBlockClassName.slice(1);

        this.scrollingProjectsBlock = document.querySelector(`.${scrollingProjectsBlockClassName}`);
        this.highglightedProjectName = "";
        this.setup();
    }

    log(...msg: any[]) {
        if (!this.debug) return;
        console.log("[ScrollingProjectsController]\n", ...msg);
    }

    prepareCanvas() {
        const canvas: HTMLCanvasElement =
            (document.getElementById("buffer-canvas") as HTMLCanvasElement) ??
            (document.createElement("canvas") as HTMLCanvasElement);

        canvas.setAttribute("id", "buffer-canvas");
        canvas.style.display = "none";
        canvas.width = 1;
        canvas.height = 1;

        this.canvas = canvas;

        document.body.appendChild(this.canvas);
    }

    resetCanvas() {
        if (!this.canvas) return;
        this.canvas.width = 1;
        this.canvas.height = 1;
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
            const imageColor: string = await getImageColor(source);

            this.colorCache.set(source, imageColor);
            this.log(imageColor);
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
        if (!this.scrollingProjectsBlock) {
            this.log("No scrolling projects block found");
            return;
        }

        this.prepareCanvas();
        this.precalculateColors();

        this.blurb = this.scrollingProjectsBlock.querySelector(".project-blurb");
        this.projectImage = this.scrollingProjectsBlock.querySelector(".project-image");
        this.viewProjectButton = this.scrollingProjectsBlock.querySelector(".view-button");

        const containers: NodeListOf<HTMLElement> = this.scrollingProjectsBlock.querySelectorAll(".project-ribbon");

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

            this.marqueeIntervalId = window.setInterval(() => {
                animateMarquee(evenRow ? 1 : -1);
            }, this.marqueeRefreshRateMilliseconds);
        }

        this.randomProjectIntervalId = window.setInterval(() => {
            while (!this.selectRandomProject());
        }, this.randomProjectRateMilliseconds);
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

        this.clearHighlightedLinks();

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
        const imgX = randomIntInRange(0, blurbRect.width);
        const imgY = randomIntInRange(0, blurbRect.width);

        this.projectImage.src = img.src;

        this.projectImage.addEventListener("load", (e) => {
            if (!e.target) return;
            const elmt = e.target as HTMLElement;
            elmt.style.left = `${(imgX / blurbRect.width) * 100}%`;
            elmt.style.top = `${(imgY / blurbRect.width) * 100}%`;
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

    determineMainColorForImage(img: HTMLImageElement): void {
        if (!this.canvas) return;

        this.canvas.width = img.width;
        this.canvas.height = img.height;

        const ctx = this.canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        const worker = new Worker("/wp-content/plugins/guten-csek/src/scripts/image-worker.js");

        worker.postMessage(imageData);
        worker.onmessage = (e) => {
            const color = e.data;

            this.log("color:", color);
            img.setAttribute("data-color", color);
        };

        // const data = imageData.data;

        // const colors = new Map<string, number>();

        // const pollingRate = 10;

        // for (let i = 0; i < data.length; i += 4 * pollingRate) {
        //     const r = data[i];
        //     const g = data[i + 1];
        //     const b = data[i + 2];
        //     const a = data[i + 3];

        //     if (a === 0) continue;

        //     const color = `rgb(${r}, ${g}, ${b})`;
        //     if (colors.has(color)) {
        //         colors.set(color, colors.get(color)! + 1);
        //     } else {
        //         colors.set(color, 1);
        //     }
        // }

        // const sortedColors = new Map([...colors.entries()].sort((a, b) => b[1] - a[1]));

        // const color = sortedColors.keys().next().value;
        // if (!color) return "rgb(0,0,0)";

        // return color;
        return;
    }
}
