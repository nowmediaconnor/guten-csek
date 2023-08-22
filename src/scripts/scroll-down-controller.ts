/*
 * Created on Mon Aug 21 2023
 * Author: Connor Doman
 */

export default class ScrollDownController {
    scrollDownElement: HTMLElement | null;
    parentScrollTarget: HTMLElement | null;
    constructor(scrollDownId: string, parentScrollTargetSelector: string) {
        if (!scrollDownId) throw new Error("Scroll down id not provided");
        if (!parentScrollTargetSelector) throw new Error("Parent scroll target selector not provided");

        this.scrollDownElement = document.getElementById(scrollDownId);
        this.parentScrollTarget = document.querySelector(parentScrollTargetSelector);

        if (this.scrollDownElement && this.parentScrollTarget) {
            this.addEventListeners();
        }
    }

    addEventListeners() {
        window.addEventListener("scroll", () => {
            this.update();
        });
    }

    update() {
        if (!this.parentScrollTarget || !this.scrollDownElement) return;
        const scrollTargetRect = this.parentScrollTarget.getBoundingClientRect();

        this.log({ bottom: scrollTargetRect.bottom });

        if (scrollTargetRect.bottom <= 0) {
            this.scrollDownElement.style.opacity = "0";
            return;
        }
        this.scrollDownElement.style.opacity = "1";
    }

    log(...msg: any[]) {
        if (false) console.log("[Scroll Down Controller]", ...msg);
    }
}
