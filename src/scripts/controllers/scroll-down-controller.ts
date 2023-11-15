/*
 * Created on Mon Aug 21 2023
 * Author: Connor Doman
 */

import { BlockController, ControllerProperties } from "../dom";
import CircleType from "circletype";

export default class ScrollDownController extends BlockController {
    blocks: NodeListOf<HTMLElement>;
    name: string;
    scrollDownId: string;
    parentScrollTargetSelector: string;
    scrollDownElement: HTMLElement | null;
    parentScrollTarget: HTMLElement | null;
    isInitialized: boolean;

    constructor(scrollDownId: string, parentScrollTargetSelector: string) {
        super();
        this.name = "ScrollDownController";
        if (!scrollDownId) throw new Error("Scroll down id not provided");
        if (!parentScrollTargetSelector) throw new Error("Parent scroll target selector not provided");

        this.scrollDownId = scrollDownId;
        this.parentScrollTargetSelector = parentScrollTargetSelector;
    }
    setup(): void {
        this.scrollDownElement = document.getElementById(this.scrollDownId);
        this.parentScrollTarget = document.querySelector(this.parentScrollTargetSelector);

        if (this.scrollDownElement && this.parentScrollTarget) {
            new CircleType(this.scrollDownElement);
            this.addEventListeners();
        } else {
            this.log("No scroll down element");
        }
        this.isInitialized = true;
    }

    addEventListeners() {
        window.addEventListener("scroll", () => {});
    }

    scroll(scrollY?: number) {
        this.update();
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
}
