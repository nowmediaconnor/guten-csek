/*
 * Created on Tue Aug 22 2023
 * Author: Connor Doman
 */

import { getSiblings, ControllerProperties, BlockController } from "../dom";
import { randomIntInRange } from "../math";

export default class ExpandingVideoController extends BlockController {
    name: string;
    debug: boolean = false;
    blockClassName: string;
    expandingVideos: NodeListOf<HTMLElement>;
    isInitialized: boolean;
    floatingImages: NodeListOf<HTMLElement>;
    blocks: NodeListOf<HTMLElement>;

    static scrollThreshold: number = 150;

    constructor(blockClassName: string) {
        super();
        this.name = "ExpandingVideoController";
        this.blockClassName = blockClassName;
    }

    setup() {
        const block = document.querySelector(this.blockClassName);

        if (this.invalid(block)) {
            this.log("No expanding video block found.");
            return;
        }

        this.expandingVideos = block?.querySelectorAll(".expanding-video-container") as NodeListOf<HTMLElement>;

        if (this.invalid(this.expandingVideos.length > 0)) {
            this.log("No expanding videos found.");
            return;
        } else {
            this.log(`Found ${this.expandingVideos.length} expanding videos`);
        }

        this.floatingImages = block?.querySelectorAll(".floating-image") as NodeListOf<HTMLElement>;

        this.floatingImages.forEach((image: HTMLElement) => {
            image.style.animationDelay = `${randomIntInRange(100, 750)}ms`;
        });

        this.addScrollEventListener();
        this.isInitialized = true;
    }

    expandVideo(container: HTMLElement) {
        this.log("Expanding video...");
        container.classList.add("expanded");
        const otherElements = getSiblings(container);

        if (otherElements.length === 0) {
            this.log("No siblings found");
            return;
        }
        otherElements.forEach((elmt: Node) => {
            (elmt as HTMLElement).classList.add("disappear");
        });
    }

    retractVideo(container: HTMLElement) {
        container.classList.remove("expanded");
        const otherElements = getSiblings(container);

        if (otherElements.length === 0) {
            this.log("No siblings found");
            return;
        }
        otherElements.forEach((elmt: Node) => (elmt as HTMLElement).classList.remove("disappear"));
    }

    onScroll(pos: number) {
        if (this.expandingVideos.length === 0) return;

        this.expandingVideos.forEach((container: HTMLElement) => {
            const parent = container.parentElement;
            if (!parent) return;

            const rect = parent.getBoundingClientRect();
            // this.log(JSON.stringify(rect, null, 4));
            if (rect.top <= ExpandingVideoController.scrollThreshold) {
                this.expandVideo(container);
            } else {
                this.retractVideo(container);
            }
        });
    }

    addScrollEventListener() {
        window.addEventListener("scroll", () => {
            const pos = window.scrollY;
            this.onScroll(pos);
        });
    }
}
