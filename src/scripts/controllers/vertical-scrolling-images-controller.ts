/*
 * Created on Mon Sep 18 2023
 * Author: Connor Doman
 */

import { BlockController, ControllerProperties } from "../dom";

export default class VerticalScrollingImagesController extends BlockController {
    name: string;
    parentScrollTargetSelector: string;
    parentScrollTarget: NodeListOf<HTMLElement> | null;
    parentScrollTargetHeight: number;
    isInitialized: boolean;
    childSelector: string;
    debug = true;

    constructor(parentScrollTargetSelector: string, childSelector: string) {
        super();
        this.name = "VerticalScrollingImagesController";
        if (!parentScrollTargetSelector) throw new Error("Parent scroll target selector not provided");
        if (!childSelector) throw new Error("Child selector not provided");

        this.parentScrollTargetSelector = parentScrollTargetSelector;
        this.childSelector = childSelector;
    }

    setup(): void {
        this.parentScrollTarget = document.querySelectorAll(this.parentScrollTargetSelector);

        if (this.parentScrollTarget) {
            this.isInitialized = true;
            this.startScrolling();
        } else {
            this.log("No parent scroll target");
        }
        this.log("Initialized");
    }

    addEventListeners() {}

    startScrolling() {
        if (!this.parentScrollTarget) return;
        this.parentScrollTarget.forEach((parentScrollTarget) => {
            const marqueeContent = parentScrollTarget.querySelector(this.childSelector) as HTMLElement;

            if (!marqueeContent) {
                this.log("No marquee content");
                return;
            }
            this.scrollMarquee(parentScrollTarget, marqueeContent);
        });
    }

    scrollMarquee(marqueeParent: HTMLElement, marqueeTrack: HTMLElement) {
        const allCards: NodeListOf<HTMLElement> = marqueeTrack.querySelectorAll(".vertical-scroll-card");

        const parentTop = marqueeParent.getBoundingClientRect().top;

        allCards.forEach((card: HTMLElement, index: number) => {
            card.style.top = `${index * 22}rem`;
        });
        // card height = 21rem
        // card margin = 1rem (x2 = 2rem)
    }
}
