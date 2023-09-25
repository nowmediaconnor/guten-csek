/*
 * Created on Sat Aug 19 2023
 * Author: Connor Doman
 */

import { BlockController, ControllerProperties } from "../dom";
import { constrain } from "../math";
import { pad } from "../strings";

export interface CarouselItem {
    title: string;
    description: string;
    index: number;
}

export default class CarouselController extends BlockController {
    name: string;
    debug: boolean = false;
    carouselClass: string;
    numItems: number;
    activeIndex: number;
    carouselBlock: HTMLElement | null;
    carousel: HTMLElement | null;
    progressNumerator: HTMLElement | null;
    progressDenominator: HTMLElement | null;
    barProgress: HTMLElement | null;
    isInitialized: boolean;

    lastZIndex: string;

    scrollableMass: HTMLElement;

    constructor(carouselClass: string) {
        super();
        this.name = "CarouselController";
        this.carouselClass = carouselClass.startsWith(".") ? carouselClass : `.${carouselClass}`;
        this.numItems = 0;
        this.activeIndex = 0;
    }

    setup() {
        this.carouselBlock = document.querySelector(this.carouselClass) as HTMLDivElement;

        if (this.invalid(this.carouselBlock)) return;

        this.lastZIndex = this.carouselBlock.style.zIndex;

        this.carousel = this.carouselBlock.querySelector(".carousel");

        this.log("Found carousel");
        // this.setup();
        this.progressNumerator = this.carouselBlock.querySelector(".carousel-slider-progress .start");
        this.progressDenominator = this.carouselBlock.querySelector(".carousel-slider-progress .stop");
        this.barProgress = this.carouselBlock.querySelector(".carousel-slider-progress .bar .progress");

        const carouselItems: NodeListOf<HTMLElement> = this.carouselBlock.querySelectorAll(".carousel-item");
        this.numItems = carouselItems.length;

        this.debug = true;
        this.addScrollableMass(carouselItems);

        this.updateNumerator(pad(this.activeIndex + 1, 2));
        this.updateDenominator(pad(this.numItems, 2));
        this.updateBarProgress();

        this.addEventListeners();
        // } else if (!this.carouselBlock) {
        //     this.log("No carousel block found");
        // }
        this.isInitialized = true;
    }

    addEventListeners() {
        if (!this.carouselBlock) return;

        this.log(this.carouselBlock.children);

        const prevButton = this.carouselBlock.querySelector(".carousel-slider-progress .prev");
        const nextButton = this.carouselBlock.querySelector(".carousel-slider-progress .next");

        if (prevButton) {
            this.log("prev button found");
            prevButton.addEventListener("click", () => {
                this.prev();
                this.log("prev");
            });
        } else {
            this.log("prev button not found");
        }

        if (nextButton) {
            this.log("next button found");
            nextButton.addEventListener("click", () => {
                this.next();
                this.log("next");
            });
        } else {
            this.log("next button not found");
        }
    }

    addScrollableMass(carouselItems: NodeListOf<HTMLElement>) {
        // add a dummy scroll block for every carousel item
        const scrollableMass = document.createElement("div");

        const dummyBlock = document.createElement("div");
        dummyBlock.classList.add("dummy-block");

        carouselItems.forEach((item, index) => {
            const dummyDupe = dummyBlock.cloneNode(true) as HTMLDivElement;
            scrollableMass.appendChild(dummyDupe);
            this.log("Adding dummy block", index);
        });
        
        this.scrollableMass = scrollableMass;
        this.carouselBlock?.parentNode?.insertBefore(this.scrollableMass, this.carouselBlock?.nextSibling);
    }

    prev() {
        if (this.activeIndex > 0) {
            this.activeIndex--;
            this.update();
        }
    }

    next() {
        if (this.activeIndex < this.numItems - 1) {
            this.activeIndex++;
            this.update();
        }
    }

    update() {
        this.log("active index:", this.activeIndex);
        if (this.carousel) {
            this.carousel.style.transform = `translateX(-${this.activeIndex * 100}vw)`;

            this.updateNumerator(pad(this.activeIndex + 1, 2));
            this.updateBarProgress();
        }
    }

    updateNumerator(val: string) {
        if (this.progressNumerator) {
            this.progressNumerator.innerText = val;
        }
    }

    updateDenominator(val: string) {
        if (this.progressDenominator) {
            this.progressDenominator.innerText = val;
        }
    }

    updateBarProgress() {
        if (this.barProgress) {
            const proportion = (this.activeIndex + 1) / this.numItems;
            this.barProgress.style.width = `${constrain(proportion, 0, 1) * 100}%`;
        }
    }

    scroll(scrollY?: number) {
        if (!this.carouselBlock || !this.scrollableMass) return;

        const blockRect = this.carouselBlock.getBoundingClientRect();
        const blockTop = blockRect.top || 0;
        const blockHeight = blockRect.height || 0;

        const scrollableMassBottom = this.scrollableMass.getBoundingClientRect().bottom || 0;

        this.log(`Block top: ${blockTop}\nBlock height: ${blockHeight}\nScrollable mass bottom: ${scrollableMassBottom}\nScrollY: ${scrollY}`);

        if (blockTop > 0 && scrollableMassBottom > window.innerHeight) {
            this.revertZIndex();
            this.carouselBlock.style.position = "sticky";
            this.scrollableMass.style.display = `block`;
        } else if (blockTop > -10 && blockTop < 10) {
            this.scrollableMass.style.display = `block`;

            if (scrollableMassBottom > window.innerHeight) {
                this.liftZIndex();
                this.carouselBlock.style.position = "sticky";
            } else if (scrollableMassBottom <= window.innerHeight) {
                this.revertZIndex();
                this.carouselBlock.style.position = "relative";
                // this.carouselBlock.style.top = `${window.innerHeight - blockHeight}px`;
            }
        } else if (blockTop < 0) {
            this.revertZIndex();
            this.carouselBlock.style.position = "relative";
            this.scrollableMass.style.display = `none`;
        }

        // this.log(`Distance to top: ${blockTop}\nScrollY: ${scrollY}`);
    }

    liftZIndex() {
        if (this.carouselBlock) {
            this.carouselBlock.style.zIndex = "40";
        }
    }

    revertZIndex() {
        if (this.carouselBlock) {
            this.carouselBlock.style.zIndex = this.lastZIndex;
        }
    }
}
