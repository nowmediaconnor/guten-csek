/*
 * Created on Sat Mar 09 2024
 * Author: Connor Doman
 */

import BlockController from "../block-controller";
import { getSiblings } from "../../../dom";
import { randomIntInRange } from "../../../math";

export default class ExpandingMediaController extends BlockController {
    static scrollThreshold: number = 150;

    private expandingMedia: NodeListOf<HTMLElement>;
    private floatingImages: NodeListOf<HTMLElement>;

    setup(): boolean {
        this.expandingMedia = this.block.querySelectorAll(".expanding-video-container");
        this.validate(
            this.expandingMedia.length > 0,
            "No expanding media found.",
            `${this.expandingMedia.length} expanding media items found.`
        );

        this.floatingImages = this.block?.querySelectorAll(".floating-image");
        this.floatingImages.forEach((image: HTMLElement) => {
            image.style.animationDelay = `${randomIntInRange(100, 750)}ms`;
        });

        return true;
    }

    private expandVideo(container: HTMLElement) {
        this.info("Expanding video...");

        container.classList.add("expanded");

        const otherElements = getSiblings(container);
        if (otherElements.length === 0) {
            this.warn("No siblings found");
            return;
        }
        otherElements.forEach((elmt: Node) => {
            (elmt as HTMLElement).classList.add("disappear");
        });
    }

    private retractVideo(container: HTMLElement) {
        this.info("Retracting video...");

        container.classList.remove("expanded");

        const otherElements = getSiblings(container);
        if (otherElements.length === 0) {
            this.warn("No siblings found");
            return;
        }
        otherElements.forEach((elmt: Node) => (elmt as HTMLElement).classList.remove("disappear"));
    }

    onPageScroll(scrollY: number): void {
        if (this.expandingMedia.length === 0) return;

        if (!this.inViewport) {
            this.info("Not in viewport, skipping...");
            return;
        }

        this.expandingMedia.forEach((container: HTMLElement) => {
            const parent = container.parentElement;
            if (!parent) return;

            const rect = parent.getBoundingClientRect();
            if (rect.top <= ExpandingMediaController.scrollThreshold) {
                this.expandVideo(container);
            } else {
                this.retractVideo(container);
            }
        });
    }

    onMouseMove(e: MouseEvent): void {}
    onMouseEnter(e: MouseEvent): void {}
    onMouseLeave(e: MouseEvent): void {}
    onClick(x: number, y: number): void {}
    onPageResize(width: number, height: number): void {}
    onPageLoad(): void {}
    onEnterViewport(): void {}
    onExitViewport(): void {}
}
