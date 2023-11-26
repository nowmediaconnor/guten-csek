/*
 * Created on Tue Aug 22 2023
 * Author: Connor Doman
 */

import { constrain } from "../math";
import { pad } from "../strings";
import { BlockController } from "../dom";
import VimeoVideo from "../vimeo";
import Player from "@vimeo/player";

// needs to control carousel
// needs to control dialog

export default class VideoCarouselController extends BlockController {
    blocks: NodeListOf<HTMLElement>;
    name: string;
    debug: boolean = false;
    videoCarouselClassName: string;
    activeIndex: number;
    numItems: number;
    videoCarousel: HTMLElement | null;
    videoBlocks: NodeListOf<HTMLElement> | null;
    videoDialog: HTMLDialogElement | null;
    progressNumerator: HTMLElement | null;
    progressDenominator: HTMLElement | null;
    barProgress: HTMLElement | null;
    videoStrip: HTMLElement | null;
    videoPlayButton: HTMLAnchorElement | null;
    videoCloseButton: HTMLAnchorElement | null;
    isInitialized: boolean;

    vimeoVideos: VimeoVideo[];

    currentVimeoPlayer: Player | null;

    constructor(videoCarouselClassName: string) {
        super();
        this.name = "VideoCarouselController";
        if (!videoCarouselClassName) throw new Error("Video carousel class name not provided");
        if (videoCarouselClassName[0] === ".") videoCarouselClassName = videoCarouselClassName.slice(1);

        this.videoCarouselClassName = videoCarouselClassName;
        this.activeIndex = 0;
        this.vimeoVideos = [];
    }

    setup() {
        this.debug = true;

        this.videoCarousel = document.querySelector(`.${this.videoCarouselClassName}`) as HTMLDivElement;
        if (this.invalid(this.videoCarousel)) {
            this.log("No video carousel found.");
            return;
        }

        this.log("Found video carousel");

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

        this.videoBlocks = this.videoCarousel.querySelectorAll(".video-block");
        this.numItems = this.videoBlocks?.length;

        this.progressDenominator.innerText = pad(this.numItems, 2);
        this.update();

        this.log("Found video dialog");
        this.log("Found video strip");
        this.log("Found progress numerator");
        this.log("Found progress denominator");
        this.log("Found bar progress");

        this.addEventListeners();

        this.prepareThumbnails();

        this.isInitialized = true;
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

    async prepareThumbnails() {
        if (!this.videoBlocks) return;
        this.log("Preparing thumbnails");

        // this.videoBlocks.forEach((block) => {
        let idx = 0;
        for (const block of this.videoBlocks) {
            const vimeoThumbnail = block.querySelector(".vimeo-thumbnail");

            if (vimeoThumbnail) {
                const url = vimeoThumbnail.getAttribute("data-vimeo-url") ?? "";

                const video = new VimeoVideo(url, 1920, 1080, false);
                this.vimeoVideos[idx] = video;
                await video.updateVideoData();
                const thumbnail = video.apiResponseData?.thumbnail_url ?? "";
                vimeoThumbnail.setAttribute("src", thumbnail);
            }
            idx++;
        }
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
            const player = this.videoDialog.querySelector(".player") as HTMLElement;

            if (!player) return;

            player.innerHTML = "";

            const vimeoVideo = this.vimeoVideos[this.activeIndex];
            if (vimeoVideo) {
                player.innerHTML = vimeoVideo.apiResponseData?.html ?? "";
                this.currentVimeoPlayer = vimeoVideo.createPlayer(player);
            } else if (!vimeoVideo) {
                const internalVideo = document.createElement("video");
                const currentSource = this.videoStrip
                    ?.querySelector(`.video-block:nth-child(${this.activeIndex + 1}) video source`)
                    ?.cloneNode(true);

                if (internalVideo && currentSource) {
                    internalVideo.appendChild(currentSource);
                    player.appendChild(internalVideo);
                    this.log("video updated");
                }
            }

            this.videoDialog.addEventListener("close", () => {
                player.innerHTML = "";
            });
        }
    }

    openVideoPlayer() {
        this.update();
        if (this.videoDialog) {
            this.videoDialog.showModal();
            document.body.style.filter = "brightness(0.5)";
            document.body.style.overflow = "hidden";

            const internalVideo = this.videoDialog.querySelector("video");

            if (internalVideo) {
                internalVideo.play();
                this.log("video playing");
            } else if (this.currentVimeoPlayer) {
                this.currentVimeoPlayer.play();
                this.log("vimeo video playing");
            } else {
                this.log("no video found");
            }
        }
    }

    closeVideoPlayer() {
        this.update();
        if (this.videoDialog) {
            this.videoDialog.close();
            document.body.style.filter = "none";
            // document.body.style.overflow = "scroll";
        }
    }

    onMouseMove(e: MouseEvent, blockIndex: number): void {}
}
