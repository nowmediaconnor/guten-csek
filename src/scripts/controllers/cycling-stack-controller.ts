/*
 * Created on Sat Nov 04 2023
 * Author: Connor Doman
 */

import { BlockController } from "../dom";

export default class CyclingStackController extends BlockController {
    static blockClassName: string = "cycling-stack";
    static animationDurationMS: number = 2500; // ms

    blocks: NodeListOf<HTMLElement>;
    block: HTMLElement;

    constructor() {
        super();
        this.name = "CyclingStackController";
    }

    setup(): void {
        this.debug = true;

        this.blocks = document.querySelectorAll("." + CyclingStackController.blockClassName);

        this.blocks.forEach((cyclingStack) => {
            const wordsList = cyclingStack.querySelector(".words-list") as HTMLDivElement;
            const words = cyclingStack.querySelectorAll(".cycling-word") as NodeListOf<HTMLSpanElement>;

            if (!wordsList?.hasAttribute("data-current-index")) {
                wordsList.setAttribute("data-current-index", "0");
            }

            const currentIndex: number = Number(wordsList?.getAttribute("data-current-index"));

            this.log("Setting up cycling stack. Current index:", currentIndex);
            this.log("Words:", words);

            words[currentIndex].style.animation = `csekSlideAndFadeIn ${CyclingStackController.animationDurationMS}ms`;
        });

        this.start();

        this.isInitialized = true;
    }

    revolve(wordsList: HTMLDivElement): void {
        const words = wordsList.querySelectorAll(".cycling-word") as NodeListOf<HTMLSpanElement>;
        const currentIndex: number = Number(wordsList.getAttribute("data-current-index"));

        // clear current word
        words[currentIndex].style.animation = "";
        words[currentIndex].style.opacity = "0";

        // update index
        const nextIndex: number = (Number(currentIndex) + 1) % words.length;

        // set next word
        words[nextIndex].style.animation = `csekSlideAndFadeIn ${CyclingStackController.animationDurationMS}ms`;

        // update index attribute
        wordsList.setAttribute("data-current-index", nextIndex.toString());
    }

    start(): void {
        this.blocks.forEach((cyclingStack) => {
            // setTimeout(() => {
            const wordsList = cyclingStack.querySelector(".words-list") as HTMLDivElement;
            setInterval(() => {
                this.revolve(wordsList);
            }, CyclingStackController.animationDurationMS);
            // }, CyclingStackController.animationDurationMS);
        });
    }

    onMouseMove(e: MouseEvent, blockIndex: number): void {}

    onScroll(e: Event, pos: number): void {}
}
