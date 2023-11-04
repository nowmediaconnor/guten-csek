/*
 * Created on Sat Nov 04 2023
 * Author: Connor Doman
 */

import { BlockController } from "../dom";

export default class CyclingStackController extends BlockController {
    static blockClassName: string = "cycling-stack";
    static animationDurationMS: number = 1000; // ms

    allCyclingStacks: NodeListOf<Element>;

    constructor() {
        super();
        this.name = "CyclingStackController";
    }

    setup(): void {
        this.debug = true;

        this.allCyclingStacks = document.querySelectorAll("." + CyclingStackController.blockClassName);

        this.allCyclingStacks.forEach((cyclingStack) => {
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

        this.isInitialized = true;

        this.start();
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
        setTimeout(() => {
            this.allCyclingStacks.forEach((cyclingStack) => {
                const wordsList = cyclingStack.querySelector(".words-list") as HTMLDivElement;
                setInterval(() => {
                    this.revolve(wordsList);
                }, CyclingStackController.animationDurationMS * 2);
            });
        }, CyclingStackController.animationDurationMS);
    }
}
