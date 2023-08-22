/*
 * Created on Tue Aug 22 2023
 * Author: Connor Doman
 */

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
    }

    retractVideo(container: HTMLElement) {
        container.classList.remove("expanded");
    }

    onScroll(pos: number) {
        if (this.expandingVideos.length === 0) return;

        this.expandingVideos.forEach((container: HTMLElement) => {
            const parent = container.parentElement;
            if (!parent) return;

            const rect = parent.getBoundingClientRect();
            this.log(JSON.stringify(rect, null, 4));
            if (rect.top <= 200) {
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
