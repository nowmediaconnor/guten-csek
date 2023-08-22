/*
 * Created on Tue Aug 22 2023
 * Author: Connor Doman
 */

import CarouselController from "./carousel-controller";
import { constrain } from "./math";
import { pad } from "./strings";

// needs to control carousel
// needs to control dialog

export default class VideoCarouselController {
    debug: boolean = false;
    videoCarouselClassName: string;
    activeIndex: number;
    numItems: number;
    videoCarousel: HTMLElement | null;
    videoDialog: HTMLDialogElement | null;
    progressNumerator: HTMLElement | null;
    progressDenominator: HTMLElement | null;
    barProgress: HTMLElement | null;
    videoStrip: HTMLElement | null;
    videoPlayButton: HTMLAnchorElement | null;
    videoCloseButton: HTMLAnchorElement | null;

    constructor(videoCarouselClassName: string) {
        if (!videoCarouselClassName) throw new Error("Video carousel class name not provided");
        if (videoCarouselClassName[0] === ".") videoCarouselClassName = videoCarouselClassName.slice(1);

        this.videoCarouselClassName = videoCarouselClassName;
        this.activeIndex = 0;
        this.videoCarousel = document.querySelector(`.${this.videoCarouselClassName}`);

        if (this.videoCarousel) {
            this.log("Found video carousel");
            this.setup();
        }
    }

    log(...msg: any[]) {
        if (this.debug) console.log("[VideoCarouselController]", ...msg);
    }

    setup() {
        if (!this.videoCarousel) return;

        this.videoDialog = this.videoCarousel.querySelector(".video-player");
        this.videoStrip = this.videoCarousel.querySelector(".video-strip");
        // ("#post-24 > div > section.wp-block-guten-csek-video-carousel-block > div.carousel-slider-progress > div.status > p > span.start");
        this.progressNumerator = this.videoCarousel.querySelector(".carousel-slider-progress .start");
        this.progressDenominator = this.videoCarousel.querySelector(".carousel-slider-progress .stop");
        this.barProgress = this.videoCarousel.querySelector(".carousel-slider-progress .bar .progress");

        if (!this.videoDialog) this.log("Could not find video dialog");
        if (!this.videoStrip) this.log("Could not find video strip");
        if (!this.progressNumerator) this.log("Could not find progress numerator");
        if (!this.progressDenominator) this.log("Could not find progress denominator");
        if (!this.barProgress) this.log("Could not find bar progress");

        if (!this.videoDialog || !this.progressNumerator || !this.progressDenominator || !this.barProgress) return;

        this.numItems = this.videoCarousel.querySelectorAll(".video-block")?.length;

        this.progressDenominator.innerText = pad(this.numItems, 2);
        this.update();

        this.log("Found video dialog");
        this.log("Found video strip");
        this.log("Found progress numerator");
        this.log("Found progress denominator");
        this.log("Found bar progress");

        this.addEventListeners();
    }

    addEventListeners() {
        if (!this.videoCarousel) return;

        const prevButton = this.videoCarousel.querySelector(".carousel-slider-progress .prev");
        const nextButton = this.videoCarousel.querySelector(".carousel-slider-progress .next");
        this.videoPlayButton = this.videoCarousel.querySelector(
            `.video-block:nth-child(${this.activeIndex + 1}) .video-playbutton`
        );
        this.videoCloseButton = this.videoCarousel.querySelector(".video-player .close-dialog");

        if (prevButton) {
            this.log("prev button found");
            prevButton.addEventListener("click", (e) => {
                e.preventDefault();
                this.prev();
                this.update();
                this.log("prev");
            });
        } else {
            this.log("prev button not found");
        }

        if (nextButton) {
            this.log("next button found");
            nextButton.addEventListener("click", (e) => {
                e.preventDefault();
                this.next();
                this.update();
                this.log("next");
            });
        } else {
            this.log("next button not found");
        }

        if (this.videoCloseButton) {
            this.log("close dialog button found");
            this.videoCloseButton.addEventListener("click", (e) => {
                e.preventDefault();
                this.log("close dialog button clicked");
                this.closeVideoPlayer();
            });
        } else {
            this.log("close dialog button not found");
        }

        this.update();
    }

    update() {
        this.log("active index:", this.activeIndex);
        if (this.videoStrip && this.videoCarousel) {
            this.videoStrip.style.transform = `translateX(-${this.activeIndex * 100}vw)`;

            this.updateNumerator(pad(this.activeIndex + 1, 2));
            this.updateBarProgress();
            this.updateVideoPlayer();
            this.updatePlayButton();
        }
    }

    prev() {
        if (this.activeIndex > 0) {
            this.activeIndex--;
        }
    }

    next() {
        if (this.activeIndex < this.numItems - 1) {
            this.activeIndex++;
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

    updatePlayButton() {
        if (this.videoPlayButton && this.videoCarousel) {
            this.log("updating play button");
            this.videoPlayButton = this.videoCarousel.querySelector(
                `.video-block:nth-child(${this.activeIndex + 1}) .video-playbutton`
            );

            if (this.videoPlayButton) {
                this.log("video play button found");
                this.videoPlayButton.addEventListener("click", (e) => {
                    e.preventDefault();
                    this.log("video play button clicked");
                    this.openVideoPlayer();
                });
            } else {
                this.log("updated play button not found");
            }
        } else {
            this.log("could not find play button");
        }
    }

    updateBarProgress() {
        if (this.barProgress) {
            const proportion = (this.activeIndex + 1) / this.numItems;
            this.barProgress.style.width = `${constrain(proportion, 0, 1) * 100}%`;
        }
    }

    updateVideoPlayer() {
        if (this.videoDialog) {
            const internalVideo = this.videoDialog.querySelector("video");
            const currentSource = this.videoStrip
                ?.querySelector(`.video-block:nth-child(${this.activeIndex + 1}) video source`)
                ?.cloneNode(true);

            if (internalVideo && currentSource) {
                internalVideo.innerHTML = "";
                internalVideo.appendChild(currentSource);
                this.log("video updated");
            }

            this.videoDialog.addEventListener("close", () => {
                if (internalVideo) {
                    internalVideo.pause();
                    internalVideo.currentTime = 0;
                    this.log("video paused");
                } else {
                    this.log("no video found");
                }
            });
        }
    }

    openVideoPlayer() {
        if (this.videoDialog) {
            this.videoDialog.showModal();
            document.body.style.filter = "brightness(0.5)";
            document.body.style.overflow = "hidden";

            const internalVideo = this.videoDialog.querySelector("video");

            if (internalVideo) {
                internalVideo.play();
                this.log("video playing");
            } else {
                this.log("no video found");
            }
        }
        this.update();
    }

    closeVideoPlayer() {
        if (this.videoDialog) {
            this.videoDialog.close();
            document.body.style.filter = "none";
            document.body.style.overflow = "scroll";
        }
        this.update();
    }
}