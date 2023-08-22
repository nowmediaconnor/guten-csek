/*
 * Created on Sat Aug 19 2023
 * Author: Connor Doman
 */

import { constrain } from "./math";
import { pad } from "./strings";

export interface CarouselItem {
    title: string;
    description: string;
    index: number;
}

export default class CarouselController {
    carouselClass: string;
    numItems: number;
    activeIndex: number;
    carouselBlock: HTMLElement | null;
    carousel: HTMLElement | null;
    progressNumerator: HTMLElement | null;
    progressDenominator: HTMLElement | null;
    barProgress: HTMLElement | null;

    constructor(carouselClass: string) {
        this.carouselClass = carouselClass.startsWith(".") ? carouselClass : `.${carouselClass}`;
        this.numItems = 0;
        this.activeIndex = 0;

        this.carouselBlock = document.querySelector(this.carouselClass);

        if (this.carouselBlock) {
            this.carousel = this.carouselBlock.querySelector(".carousel");

            this.log("Found carousel");
            this.setup();
        }
    }

    setup() {
        if (!this.carouselBlock) {
            this.log("No carousel block found");
            return;
        }
        this.progressNumerator = this.carouselBlock.querySelector(".carousel-slider-progress .start");
        this.progressDenominator = this.carouselBlock.querySelector(".carousel-slider-progress .stop");
        this.barProgress = this.carouselBlock.querySelector(".carousel-slider-progress .bar .progress");

        const carouselItems = this.carouselBlock.querySelectorAll(".carousel-item");
        this.numItems = carouselItems.length;

        this.updateNumerator(pad(this.activeIndex + 1, 2));
        this.updateDenominator(pad(this.numItems, 2));
        this.updateBarProgress();

        this.addEventListeners();
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

    log(...msg: any) {
        console.log(`[Carousel Controller]`, ...msg);
    }
}
