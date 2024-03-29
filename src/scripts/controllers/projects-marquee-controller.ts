/*
 * Created on Mon Nov 13 2023
 * Author: Connor Doman
 */

import { BlockController } from "../dom";
import { MarqueeCanvas } from "../marquee/marquee";
import { Strip } from "../marquee/row";

export default class ProjectsMarqueeController extends BlockController {
    debug: boolean = true;

    blockClassName: string = ".wp-block-guten-csek-scrolling-projects-block";

    blocks: NodeListOf<HTMLElement>;
    block: HTMLElement | null;

    marquee: MarqueeCanvas;

    marqueeInterval: number;

    activeWord: string;

    projectNames: string[];

    intersectionObserver: IntersectionObserver;

    constructor(block: HTMLElement) {
        super();
        this.name = "ProjectsMarqueeController";

        this.block = block;
    }

    setup(): void {
        if (this.invalid(this.block)) {
            this.err("Block not found");
            return;
        } else if (this.block) {
            this.prepCanvas(this.block);
            this.prepObserver(this.block);
            // this.startMarquee();
            this.isInitialized = true;
        }
    }

    prepCanvas(block: HTMLElement, projectNames?: string[]) {
        const projectsArea = block.querySelector(".projects") as HTMLElement;

        if (projectsArea) {
            projectsArea.style.display = "none";
        }

        const blockRect = block.getBoundingClientRect();
        const blockWidth = blockRect.width;
        const blockHeight = blockRect.height;

        if (!projectNames) this.getProjectsFromBlock();
        else if (projectNames) this.projectNames = projectNames;

        Strip.wordSpacing = 64;
        this.marquee = new MarqueeCanvas(block, blockWidth, blockHeight, 3);
        this.marquee.placeCanvas(0, 0);
        this.marquee.separator = "\u2014"; // em dash
        this.marquee.words = this.projectNames;
        this.marquee.setup();
    }

    prepObserver(block: HTMLElement) {
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0,
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.startMarquee();
                } else {
                    this.stopMarquee();
                }
            });
        }, observerOptions);

        this.intersectionObserver.observe(block);
    }

    getProjectsFromBlock() {
        const projectsArea = this.block?.querySelector(".projects") as HTMLElement;

        if (this.invalid(projectsArea)) {
            this.err("Projects area not found");
            return;
        }

        const projects: NodeListOf<HTMLAnchorElement> = projectsArea.querySelectorAll(".projects ul li a");

        if (this.invalid(projects)) {
            this.err("Projects not found");
            return;
        }

        const projectNames: string[] = [];

        for (let i = 0; i < projects.length; i++) {
            const innerText = projects[i].innerText;
            // this.log(`project ${i}: ${innerText}`);
            if (!innerText) continue;

            if (!projectNames.includes(innerText)) projectNames.push(innerText);
        }

        this.projectNames = projectNames;
    }

    startMarquee() {
        this.marqueeInterval = window.setInterval(() => {
            try {
                if (!this.block) throw new Error("Block not found");

                this.marquee.activeWord = this.block.getAttribute("data-project") || "";

                this.marquee.update();
                this.marquee.draw();
            } catch (err: any) {
                this.err(err.message, err.stack);
                this.stopMarquee();
            }
        }, 32);
    }

    stopMarquee() {
        window.clearInterval(this.marqueeInterval);
    }

    onMouseMove(e: MouseEvent, blockIndex: number): void {}
}
