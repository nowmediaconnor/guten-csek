/*
 * Created on Thu Aug 17 2023
 * Author: Connor Doman
 */

import DOMController, { BlockController } from "./dom";
import { constrain, map } from "./math";

/**
 * curtainify.js
 *
 * This script is responsible for collecting all elements inside of a curtain-reel container and applying a split on scroll effect to them, like curtains being parted.
 * Each element to apply the effect to must have the classname "curtain" but can be placed anywhere inside the curtain-reel element.
 */

console.log("Curtainify.js");

const DEBUG = false;

const log = (...msg: any[]) => {
    if (DEBUG) {
        console.log("[Curtainify.js]", ...msg);
    }
};

// const insertAfter = (newNode: Node, referenceNode: Node) => {
//     if (!referenceNode.parentNode) return;
//     referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
// };

const makeIntoLeftCurtain = (elmt: Node) => {
    const leftCurtain = document.createElement("div");
    const leftCurtainContent = elmt.cloneNode(true);
    leftCurtain.classList.add("left-curtain");

    leftCurtain.appendChild(leftCurtainContent);
    return leftCurtain;
};

const makeIntoRightCurtain = (elmt: Node) => {
    const rightCurtain = document.createElement("div");
    const rightCurtainContent = elmt.cloneNode(true);
    rightCurtain.classList.add("right-curtain");

    rightCurtain.appendChild(rightCurtainContent);
    return rightCurtain;
};

const curtainify = (contentReel: HTMLElement, contentReelItems: NodeList) => {
    contentReel.innerHTML = "";

    contentReelItems.forEach((item: Node, index) => {
        const left = makeIntoLeftCurtain(item);
        const right = makeIntoRightCurtain(item);
        const zIndex = contentReelItems.length - index;

        // if this block contains a video, force them to syncrhonize
        const leftVideo = left.querySelector("video");
        const rightVideo = right.querySelector("video");
        const threshold = 0.1;

        if (leftVideo && rightVideo) {
            leftVideo.addEventListener("timeupdate", () => {
                if (Math.abs(leftVideo.currentTime - rightVideo.currentTime) > threshold)
                    rightVideo.currentTime = leftVideo.currentTime;
            });
            rightVideo.addEventListener("timeupdate", () => {
                if (Math.abs(rightVideo.currentTime - leftVideo.currentTime) > threshold)
                    leftVideo.currentTime = rightVideo.currentTime;
            });
        }

        left.style.zIndex = zIndex.toString();
        right.style.zIndex = zIndex.toString();
        contentReel.appendChild(left);
        contentReel.appendChild(right);
    });
};

export const prepareCurtainElements = () => {
    const contentReel = document.querySelector(".curtain-reel") as HTMLElement;
    const contentReelItems = document.querySelectorAll(".curtain");

    if (!contentReel) return;

    curtainify(contentReel, contentReelItems);

    // curtainify all curtain elements

    // prepare metrics for content reel
    const contentReelContents = document.querySelectorAll(".curtain-reel > *");
    const heights: number[] = [];
    for (let i = 0; i < contentReelContents.length; i++) {
        heights.push(contentReelContents[i].getBoundingClientRect().height);
    }
    const contentReelHeight = heights.reduce((partialSum, a) => partialSum + a, 0) / 2; // divide by 2 because we have 2 of each element

    const contentReelFirstChild = contentReel.firstChild as HTMLElement;

    if (!contentReelFirstChild) return;

    const contentReelFirstChildRect = contentReelFirstChild.getBoundingClientRect();
    const contentReelTop = contentReelFirstChildRect.top;
    const contentReelBottom = contentReelFirstChildRect.bottom;

    // add scrollable mass of content to below content reel
    const contentReelScrollMass = document.createElement("div");
    contentReelScrollMass.setAttribute("id", "curtain-reel-scroll-mass");
    contentReelScrollMass.style.zIndex = "-1";
    contentReelScrollMass.style.height = `${contentReelHeight}px`;
    contentReelScrollMass.style.backgroundColor = "#131313";
    DOMController.insertAfter(contentReelScrollMass, contentReel);

    if (window.scrollY > contentReelTop) {
        window.scrollTo(0, window.scrollY - contentReelHeight);
    }

    // split curtains
    const leftCurtains = document.querySelectorAll(".left-curtain");
    const rightCurtains = document.querySelectorAll(".right-curtain");

    const shadowBlock = document.createElement("div");
    shadowBlock.classList.add("shadow-block");
    shadowBlock.style.zIndex = (contentReelContents.length + 1).toString();

    contentReel.appendChild(shadowBlock);

    const splitCurtains = (index = 0) => {
        const scrollPosition = window.scrollY;
        const scrollPositionFromTop = scrollPosition - contentReelTop - window.innerHeight * index;

        const scrollPercentage = Math.floor(constrain(scrollPositionFromTop / window.innerHeight, 0, 1) * 100) / 100;

        // effects for underlying card
        if (index < leftCurtains.length - 1) {
            const previousLeft = leftCurtains[index + 1] as HTMLElement;
            const previousRight = rightCurtains[index + 1] as HTMLElement;
            const zHeight = map(scrollPercentage, 0, 1, -0.125, 0);

            previousLeft.style.transform = `translateZ(${zHeight}rem)`;
            previousRight.style.transform = `translateZ(${zHeight}rem)`;

            const contentBlock = previousLeft.querySelector(".content-block") as HTMLElement;
            if (contentBlock) {
                const color = window.getComputedStyle(contentBlock).getPropertyValue("background-color");

                const scrollMass = document.getElementById("curtain-reel-scroll-mass");
                if (scrollMass) {
                    scrollMass.style.backgroundColor = color;
                    log({ color });
                }
            }
        }

        const left = leftCurtains[index] as HTMLElement;
        const right = rightCurtains[index] as HTMLElement;

        left.style.transform = `translateX(-${scrollPercentage * 100}%)`;
        right.style.transform = `translateX(${scrollPercentage * 100}%)`;

        shadowBlock.style.width = `${scrollPercentage * 100}%`;
        shadowBlock.style.background = `radial-gradient(transparent 40%, rgba(0,0,0,${map(
            scrollPercentage,
            0,
            1,
            0.5,
            0
        )}) 98%)`;

        return scrollPercentage;
    };

    let lastScroll = window.scrollY;
    let currentIndex = constrain(
        Math.floor(((lastScroll - contentReelTop) / contentReelHeight) * (contentReelContents.length / 2)),
        0,
        contentReelContents.length / 2 - 1
    );

    const adjustBasedOnScroll = (scroll: number) => {
        const scrollDirection = Math.floor(constrain(window.scrollY - lastScroll, -1, 1));
        lastScroll = window.scrollY;
        log("scroll position:", window.scrollY, "scroll direction:", scrollDirection);

        if (scroll === 1 && scrollDirection === 1) {
            currentIndex++;
        } else if (scroll === 0 && scrollDirection === -1) {
            currentIndex--;
        }
        currentIndex = constrain(currentIndex, 0, leftCurtains.length - 1);

        if (currentIndex === leftCurtains.length) {
            shadowBlock.style.visibility = "hidden";
        }
    };

    window.addEventListener("scroll", (e) => {
        const scroll = splitCurtains(currentIndex);
        adjustBasedOnScroll(scroll);
    });

    const initializeTranslations = (currentIndex: number) => {
        for (let i = 0; i < currentIndex; i++) {
            const left = leftCurtains[i] as HTMLElement;
            const right = rightCurtains[i] as HTMLElement;
            left.style.transform = `translateX(-100%)`;
            right.style.transform = `translateX(100%)`;
        }
    };

    const scrollInitital = splitCurtains(currentIndex);
    adjustBasedOnScroll(scrollInitital);
    initializeTranslations(currentIndex);
};

export class Curtains extends BlockController {
    debug: boolean = true;
    block: HTMLElement;

    contentReel: HTMLElement;
    contentReelItems: NodeListOf<HTMLElement>;
    reelContents: HTMLElement[];

    contentReelRect: DOMRect;

    scrollMass: HTMLElement;

    reelHeight: number;

    leftCurtains: NodeListOf<HTMLElement>;
    rightCurtains: NodeListOf<HTMLElement>;

    shadowBlock: HTMLElement;

    lastScroll: number;
    currentIndex: number;

    constructor(block: HTMLElement) {
        super();
        this.name = "Curtains";
        this.block = block;
    }

    setup() {
        if (this.invalid(!this.block.classList.contains(".curtain-reel"))) {
            this.log("Block is not a curtain reel.");
            return;
        }
        this.contentReel = this.block;
        this.contentReelItems = this.contentReel.querySelectorAll(".curtain");

        if (!this.contentReel) return;

        this.curtainify();
        this.calculateReelHeight();
        this.prepareReelRectangle();
        this.prepareScrollMass();
        this.resetScroll();
        this.prepareCurtains();
        this.prepareShadowBlock();
        this.prepareScrollPosition();

        const scrollInitial = this.splitCurtains(this.currentIndex, window.scrollY);
        this.adjustScroll(scrollInitial);
        this.initializeTranslations();

        this.isInitialized = true;
    }

    calculateReelHeight(): void {
        this.reelContents = DOMController.getImmediateSuccessors(this.contentReel);
        this.log("reel contents:", { reelContents: this.reelContents });
        const heights: number[] = [];
        this.reelContents.forEach((elmt) => {
            heights.push(elmt.getBoundingClientRect().height);
        });
        this.reelHeight = heights.reduce((partialSum, a) => partialSum + a, 0) / 2; // divide by 2 because we have 2 of each element
    }

    prepareReelRectangle(): void {
        const contentReelFirstChild = this.contentReel.firstChild as HTMLElement;

        if (!contentReelFirstChild) return;

        this.contentReelRect = contentReelFirstChild.getBoundingClientRect();
    }

    prepareScrollMass(): void {
        this.scrollMass = document.createElement("div");
        this.scrollMass.setAttribute("id", "curtain-reel-scroll-mass");
        this.scrollMass.style.zIndex = "-1";
        this.scrollMass.style.height = `${this.reelHeight}px`;
        this.scrollMass.style.backgroundColor = "var(--csek-dark)";
        DOMController.insertAfter(this.scrollMass, this.contentReel);
    }

    resetScroll(): void {
        if (window.scrollY > this.contentReelRect.top) {
            window.scrollTo(0, window.scrollY - this.reelHeight);
        }
    }

    prepareCurtains(): void {
        this.leftCurtains = this.contentReel.querySelectorAll(".left-curtain");
        this.rightCurtains = this.contentReel.querySelectorAll(".right-curtain");
    }

    prepareShadowBlock(): void {
        this.shadowBlock = document.createElement("div");
        this.shadowBlock.classList.add("shadow-block");
        this.shadowBlock.style.zIndex = (this.contentReelItems.length + 1).toString();

        this.contentReel.appendChild(this.shadowBlock);
    }

    splitCurtains(index: number = 0, scrollPos: number): number {
        const positionFromTop = scrollPos - this.contentReelRect.top - window.innerHeight * index;

        const scrollPercentage = Math.floor(constrain(positionFromTop / window.innerHeight, 0, 1) * 100) / 100;

        // effects for underlying card
        if (index < this.leftCurtains.length - 1) {
            const previousLeft = this.leftCurtains[index + 1] as HTMLElement;
            const previousRight = this.rightCurtains[index + 1] as HTMLElement;
            // argument 3 must be an exact part of 1
            const zHeight = map(scrollPercentage, 0, 1, -0.125, 0);

            previousLeft.style.transform = `translateZ(${zHeight}rem)`;
            previousRight.style.transform = `translateZ(${zHeight}rem)`;

            const contentBlock = previousLeft.querySelector(".content-block") as HTMLElement;
            if (contentBlock) {
                const color = window.getComputedStyle(contentBlock).getPropertyValue("background-color");
                this.scrollMass.style.backgroundColor = color;
            }
        }

        // spread curtains
        const left = this.leftCurtains[index] as HTMLElement;
        const right = this.rightCurtains[index] as HTMLElement;

        left.style.transform = `translateX(-${scrollPercentage * 100}%)`;
        right.style.transform = `translateX(${scrollPercentage * 100}%)`;

        // shadow block
        this.shadowBlock.style.width = `${scrollPercentage * 100}%`;
        this.shadowBlock.style.background = `radial-gradient(transparent 40%, rgba(0,0,0,${map(
            scrollPercentage,
            0,
            1,
            0.5,
            0
        )}) 98%)`;

        return scrollPercentage;
    }

    prepareScrollPosition(): void {
        const contentReelTop = this.contentReelRect.top;

        this.lastScroll = window.scrollY;
        this.currentIndex = constrain(
            Math.floor(((this.lastScroll - contentReelTop) / this.reelHeight) * (this.reelContents.length / 2)),
            0,
            this.reelContents.length / 2 - 1
        );
    }

    adjustScroll(scrollPercentage: number): void {
        const scrollDirection = Math.floor(constrain(window.scrollY - this.lastScroll, -1, 1));
        this.lastScroll = window.scrollY;

        if (scrollPercentage === 1 && scrollDirection === 1) {
            this.currentIndex++;
        } else if (scrollPercentage === 0 && scrollDirection === -1) {
            this.currentIndex--;
        }
        this.currentIndex = constrain(this.currentIndex, 0, this.leftCurtains.length - 1);

        if (this.currentIndex === this.leftCurtains.length) {
            this.shadowBlock.style.visibility = "hidden";
        }
    }

    onScroll(e: Event, pos: number) {
        const scrollPercentage = this.splitCurtains(this.currentIndex, pos);
        this.adjustScroll(scrollPercentage);
    }

    initializeTranslations(): void {
        for (let i = 0; i < this.currentIndex; i++) {
            const left = this.leftCurtains[i] as HTMLElement;
            const right = this.rightCurtains[i] as HTMLElement;
            left.style.transform = `translateX(-100%)`;
            right.style.transform = `translateX(100%)`;
        }
    }

    curtainify(): void {
        this.contentReel.innerHTML = "";

        this.contentReelItems.forEach((item: Node, index) => {
            const left = this.makeIntoLeftCurtain(item);
            const right = this.makeIntoRightCurtain(item);
            const zIndex = this.contentReelItems.length - index;

            // if this block contains a video, force them to syncrhonize
            const leftVideo = left.querySelector("video");
            const rightVideo = right.querySelector("video");
            const threshold = 0.1;

            if (leftVideo && rightVideo) {
                leftVideo.addEventListener("timeupdate", () => {
                    if (Math.abs(leftVideo.currentTime - rightVideo.currentTime) > threshold)
                        rightVideo.currentTime = leftVideo.currentTime;
                });
                rightVideo.addEventListener("timeupdate", () => {
                    if (Math.abs(rightVideo.currentTime - leftVideo.currentTime) > threshold)
                        leftVideo.currentTime = rightVideo.currentTime;
                });
            }

            left.style.zIndex = zIndex.toString();
            right.style.zIndex = zIndex.toString();
            this.contentReel.appendChild(left);
            this.contentReel.appendChild(right);
        });
    }

    makeIntoRightCurtain(elmt: Node): HTMLElement {
        const rightCurtain = document.createElement("div");
        const rightCurtainContent = elmt.cloneNode(true);
        rightCurtain.classList.add("right-curtain");

        rightCurtain.appendChild(rightCurtainContent);
        return rightCurtain;
    }

    makeIntoLeftCurtain(elmt: Node): HTMLElement {
        const leftCurtain = document.createElement("div");
        const leftCurtainContent = elmt.cloneNode(true);
        leftCurtain.classList.add("left-curtain");

        leftCurtain.appendChild(leftCurtainContent);
        return leftCurtain;
    }

    onMouseMove(e: MouseEvent, blockIndex: number): void {}
}
