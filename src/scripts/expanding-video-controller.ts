/*
 * Created on Tue Aug 22 2023
 * Author: Connor Doman
 */

import { getSiblings } from "./dom";

export default class ExpandingVideoController {
    debug: boolean = true;
    expandingVideos: NodeListOf<HTMLElement>;

    constructor(expandingVideoClassName: string) {
        this.expandingVideos = document.querySelectorAll(expandingVideoClassName);

        if (this.expandingVideos.length > 0) {
            this.log(`Found ${this.expandingVideos.length} expanding videos`);
            this.setup();
        } else {
            this.log("No expanding videos found.");
        }
    }

    log(...msg: any[]) {
        if (this.debug) console.log("[ExpandingVideoController]", ...msg);
    }

    setup() {
        this.addScrollEventListener();
    }

    expandVideo(container: HTMLElement) {
        container.classList.add("expanded");
        const otherElements = getSiblings(container);

        if (otherElements.length === 0) {
            this.log("No siblings found");
            return;
        }
        otherElements.forEach((elmt: Node) => (elmt as HTMLElement).classList.add("disappear"));
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
