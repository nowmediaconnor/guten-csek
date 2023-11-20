/*
 * Created on Tue Aug 22 2023
 * Author: Connor Doman
 */

import { Curtains } from "../curtainify";
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

    scrollLocked: boolean;
    scrollLockPos: number;
    videoExpanded: boolean;

    curtains: Curtains;

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

        if (block) {
            this.curtains = new Curtains(block as HTMLElement);
            this.curtains.setup();
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

    onScroll(e: Event, pos: number) {
        this.curtains.onScroll(e, pos);

        if (this.expandingVideos.length === 0) return;

        this.expandingVideos.forEach((container: HTMLElement) => {
            const parent = container.parentElement;
            if (!parent) return;

            const rect = parent.getBoundingClientRect();

            if (rect.top <= ExpandingVideoController.scrollThreshold) {
                this.expandVideo(container);
            } else {
                this.retractVideo(container);
            }
        });
    }

    onMouseMove(e: MouseEvent, blockIndex: number): void {}

    beforeReload() {
        window.scrollTo(0, 0);
    }
}
