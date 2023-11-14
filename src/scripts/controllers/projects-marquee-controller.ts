/*
 * Created on Mon Nov 13 2023
 * Author: Connor Doman
 */

import { BlockController } from "../dom";
import { MarqueeCanvas } from "../marquee/marquee";

export default class ProjectsMarqueeController extends BlockController {
    debug: boolean = true;

    blockClassName: string = ".wp-block-guten-csek-scrolling-projects-block";

    block: HTMLElement | null;

    marquee: MarqueeCanvas;

    marqueeInterval: number;

    constructor(className?: string) {
        super();
        this.name = "ProjectsMarqueeController";

        if (className) {
            this.blockClassName = className;
        }
    }

    setup(): void {
        this.block = document.querySelector(this.blockClassName);

        if (this.invalid(this.block)) {
            this.err("Block not found");
            return;
        } else if (this.block) {
            this.prepCanvas(this.block);
            this.startMarquee();
            this.isInitialized = true;
        }
    }

    prepCanvas(block: HTMLElement) {
        const projectsArea = block.querySelector(".projects") as HTMLElement;

        if (projectsArea) {
            projectsArea.style.display = "none";
        }

        const blockRect = block.getBoundingClientRect();
        const blockWidth = blockRect.width;
        const blockHeight = blockRect.height;

        const companyNames = [
            "Quantum Dynamics",
            "Pinnacle Solutions",
            "Nebula Innovations",
            "Vertex Enterprises",
            "Horizon Technologies",
        ];

        this.marquee = new MarqueeCanvas(block, blockWidth, blockHeight, 3);
        this.marquee.placeCanvas(0, 0);
        this.marquee.words = companyNames;
        this.marquee.setup();
    }

    startMarquee() {
        this.marqueeInterval = window.setInterval(() => {
            try {
                this.marquee.update();
                this.marquee.draw();
            } catch (err: any) {
                this.err(err.message, err.stack);
                this.stopMarquee();
            }

            // if (this.marquee.frameCount >= 10000) {
            //     this.marquee.resetRows();
            //     console.log("Animation looped");
            // }
        }, 16);
    }

    stopMarquee() {
        window.clearInterval(this.marqueeInterval);
    }
}
