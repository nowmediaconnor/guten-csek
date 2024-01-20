/*
 * Created on Tue Aug 22 2023
 * Author: Connor Doman
 */

import BlockController from "../../../js/block-controller";
import DOMController from "../../../js/dom-controller";
import { GutenCsek, log } from "../../../js/guten-csek";
import { getSiblings } from "../../../js/scripts/dom";
import { randomIntInRange } from "../../../js/scripts/math";
import domReady from "@wordpress/dom-ready";

export default class ExpandingVideoController extends BlockController {
    name: string;
    debug: boolean = false;
    blockClassName: string;
    expandingVideos: NodeListOf<HTMLElement>;
    isInitialized: boolean;
    floatingImages: NodeListOf<HTMLElement>;
    blocks: NodeListOf<HTMLElement>;

    scrollThreshold: number = 150;

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
            if (rect.top <= this.scrollThreshold) {
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

    onMouseMove(e: MouseEvent, blockIndex: number): void {}
}

domReady(() => {
    log("ExpandingVideoController domReady");
    const domCtrl = window["domController"] as DOMController;
    log({ domCtrl });
    (window["domController"] as DOMController).addControllerBeforeSetup(
        new ExpandingVideoController(".expanding-video-block")
    );
});
