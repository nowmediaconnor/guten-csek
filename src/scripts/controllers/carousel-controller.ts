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

    blockHeight: number;
    scrollOffset: number;

    carouselBlock: HTMLElement | null;
    carousel: HTMLUListElement | null;
    progressNumerator: HTMLElement | null;
    progressDenominator: HTMLElement | null;
    barProgress: HTMLElement | null;
    skipButton: HTMLElement | null;

    isInitialized: boolean;

    constructor(carouselClass: string) {
        super();
        this.name = "CarouselController";
        this.carouselClass = carouselClass.startsWith(".") ? carouselClass : `.${carouselClass}`;
        this.numItems = 0;
        this.blockHeight = 0;
    }

    setup() {
        this.carouselBlock = document.querySelector(this.carouselClass) as HTMLDivElement;

        if (this.invalid(this.carouselBlock)) return;

        this.carousel = this.carouselBlock.querySelector(".carousel");

        this.log("Found carousel");
        // this.setup();
        this.progressNumerator = this.carouselBlock.querySelector(".carousel-slider-progress .start");
        this.progressDenominator = this.carouselBlock.querySelector(".carousel-slider-progress .stop");
        this.barProgress = this.carouselBlock.querySelector(".carousel-slider-progress .bar .progress");
        this.skipButton = this.carouselBlock.querySelector(".carousel-slider-progress .skip");

        const carouselItems: NodeListOf<HTMLElement> = this.carouselBlock.querySelectorAll(".carousel-item");
        this.numItems = carouselItems.length;

        this.debug = true;

        this.addEventListeners();

        this.loadScroll();
        this.updateScroll();

        this.updateDenominator(pad(this.numItems, 2));
        this.updateProgress();

        this.isInitialized = true;
    }

    addEventListeners() {
        if (this.skipButton) {
            this.skipButton.addEventListener("click", (e) => {
                e.preventDefault();
                const skipCarousel = document.getElementById("skip-carousel");
                if (skipCarousel) {
                    skipCarousel.scrollIntoView();
                    window.scrollTo(0, window.scrollY - window.innerHeight);
                }
            });
        }
    }

    update() {}

    updateProgress() {
        if (this.barProgress) {
            const proportion = this.updateBarProgress(this.barProgress);
            this.updateNumerator(pad(Math.floor(proportion * this.numItems) + 1, 2));
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

    updateBarProgress(progressBar: HTMLElement): number {
        // const proportion = (this.activeIndex + 1) / this.numItems;
        const proportion = this.scrollOffset / this.blockHeight;
        progressBar.style.width = `${constrain(proportion, 0, 1) * 100}%`;
        return proportion;
    }

    scroll(scrollY?: number) {
        this.updateScroll(scrollY);
    }

    /**
     * Adapted from the script at: https://kyliedeboer.com/wp-content/themes/theme/_assets/scripts/plugins/featureslider.js
     * @param scrollY the current value of window.scrollY
     */
    updateScroll(scrollY?: number) {
        const carouselSlider = this.carouselBlock?.querySelector(".carousel-slider");

        if (carouselSlider && this.carouselBlock) {
            const vertScroll = scrollY || window.scrollY;

            const sliderBoundingRect = this.carouselBlock.getBoundingClientRect();

            if (sliderBoundingRect) {
                const theScrollOffset = this.carouselBlock.offsetTop - window.innerHeight;

                const theSliderScrollAmount = vertScroll - theScrollOffset - window.innerHeight;

                this.log(
                    "theScrollOffset:",
                    theScrollOffset,
                    "top:",
                    sliderBoundingRect.top,
                    "scrollY:",
                    vertScroll,
                    "theSliderScrollAmount:",
                    theSliderScrollAmount
                );

                // if (sliderBoundingRect.top <= 0 && sliderBoundingRect.bottom >= window.innerHeight)
                carouselSlider.scrollLeft = theSliderScrollAmount;
                this.scrollOffset = theSliderScrollAmount;

                this.updateProgress();
            }
        }
    }
    /**
     * Adapted from the script at: https://kyliedeboer.com/wp-content/themes/theme/_assets/scripts/plugins/featureslider.js
     */
    loadScroll() {
        if (!this.carouselBlock || !this.carousel) return;

        let slides = this.carousel.querySelectorAll("li.carousel-item") as NodeListOf<HTMLElement>;
        let numSlides = slides.length;
        let slideWidth = slides[0].offsetWidth;
        let slideHeight = slides[0].offsetHeight;

        let sliderWidth = numSlides * slideWidth;

        let offset = 1;
        let newHeight = slideHeight + (sliderWidth - window.innerWidth) * offset;

        this.blockHeight = newHeight - slideHeight;

        this.carouselBlock.style.height = `${newHeight}px`;
    }
}
