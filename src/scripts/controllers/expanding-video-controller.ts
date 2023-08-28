/*
 * Created on Tue Aug 22 2023
 * Author: Connor Doman
 */

import { getSiblings, ControllerProperties, BlockController } from "../dom";

export default class ExpandingVideoController extends BlockController {
    name: string;
    debug: boolean = false;
    expandingVideoClassName: string;
    expandingVideos: NodeListOf<HTMLElement>;
    isInitialized: boolean;

    constructor(expandingVideoClassName: string) {
        super();
        this.name = "ExpandingVideoController";
        this.expandingVideoClassName = expandingVideoClassName;
    }

    setup() {
        this.expandingVideos = document.querySelectorAll(this.expandingVideoClassName);

        if (this.invalid(this.expandingVideos.length > 0)) {
            this.log("No expanding videos found.");
            return;
        } else {
            this.log(`Found ${this.expandingVideos.length} expanding videos`);
        }

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
            if (rect.top <= 300) {
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
