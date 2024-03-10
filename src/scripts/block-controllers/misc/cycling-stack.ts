/*
 * Created on Sat Mar 09 2024
 * Author: Connor Doman
 */

import { BlockController } from "../../dom/block-controller";

export default class CyclingStackController extends BlockController {
    static animationDurationMS: number = 2500; // ms

    private wordsList: HTMLDivElement;
    private words: NodeListOf<HTMLSpanElement>;
    private currentIndex: number;
    private cycleInterval: number;

    setup(): boolean {
        this.debug = false;

        this.wordsList = this.block.querySelector(".words-list");
        this.validate(this.wordsList !== undefined, "Words list not found.", "Words list found.");

        if (!this.wordsList.hasAttribute("data-current-index")) {
            this.wordsList.setAttribute("data-current-index", "0");
        }

        this.words = this.wordsList.querySelectorAll(".cycling-word");
        this.validate(this.words.length > 0, "No words found.", "Words found.");

        // this.currentIndex = Number(this.wordsList.getAttribute("data-current-index"));
        this.currentIndex = 0;

        this.info("Setting up cycling stack. Current index:", this.currentIndex);
        this.info("Words:", this.words);

        this.words[
            this.currentIndex
        ].style.animation = `csekSlideAndFadeIn ${CyclingStackController.animationDurationMS}ms`;

        return true;
    }

    private revolve(): void {
        // clear current word
        this.words[this.currentIndex].style.animation = "";
        this.words[this.currentIndex].style.opacity = "0";

        // update index
        const nextIndex: number = (this.currentIndex + 1) % this.words.length;

        // set next word
        this.words[nextIndex].style.animation = `csekSlideAndFadeIn ${CyclingStackController.animationDurationMS}ms`;

        // update index attribute
        // this.wordsList.setAttribute("data-current-index", nextIndex.toString());

        this.currentIndex = nextIndex;
    }

    private start(): void {
        this.info("Starting cycling stack.");
        this.cycleInterval = window.setInterval(() => {
            this.revolve();
        }, CyclingStackController.animationDurationMS);
    }

    private stop(): void {
        this.info("Stopping cycling stack.");
        window.clearInterval(this.cycleInterval);
    }

    onEnterViewport(): void {
        this.start();
    }
    onExitViewport(): void {
        this.stop();
    }

    onMouseMove(e: MouseEvent): void {}
    onMouseEnter(e: MouseEvent): void {}
    onMouseLeave(e: MouseEvent): void {}
    onClick(x: number, y: number): void {}
    onPageScroll(scrollY: number): void {}
    onPageResize(width: number, height: number): void {}
    onPageLoad(): void {}
}
