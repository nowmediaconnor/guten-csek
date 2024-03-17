/*
 * Created on Sat Mar 16 2024
 * Author: Connor Doman
 */

import Player from "@vimeo/player";
import VimeoVideo from "../../../vimeo";
import BlockController from "../block-controller";
import { constrain } from "../../../math";
import { pad } from "../../../strings";

export default class VideoCarouselController extends BlockController {
    private activeIndex: number;
    private numVideos: number;

    private videoBlocks: NodeListOf<HTMLElement>;
    private videoDialog: HTMLDialogElement;
    private videoCloseButton: HTMLAnchorElement;

    private progressNumerator: HTMLElement;
    private progressDenominator: HTMLElement;
    private barProgress: HTMLElement;

    private videoStrip: HTMLElement;
    private videoPlayButton: HTMLElement;

    private vimeoVideos: VimeoVideo[];
    private currentVimeoPlayer: Player;

    debug = true;
    setup(): boolean {
        this.activeIndex = 0;
        this.vimeoVideos = [];

        this.videoBlocks = this.block.querySelectorAll(".video-block");
        if (!this.validate(this.videoBlocks.length, "No video blocks found")) return false;

        this.videoDialog = document.getElementById("video-player") as HTMLDialogElement;
        if (!this.validate(this.videoDialog, "No video dialog found")) return false;

        this.videoCloseButton = this.videoDialog.querySelector(".close-dialog");
        if (!this.validate(this.videoCloseButton, "No close button found")) return false;

        this.videoStrip = this.block.querySelector(".video-strip");
        if (!this.validate(this.videoStrip, "No video strip found")) return false;

        this.progressNumerator = this.block.querySelector(".video-carousel-slider-progress .start");
        this.progressDenominator = this.block.querySelector(".video-carousel-slider-progress .stop");
        this.barProgress = this.block.querySelector(".video-carousel-slider-progress .bar .progress");
        if (!this.validate(this.progressNumerator, "No progress numerator found")) return false;
        if (!this.validate(this.progressDenominator, "No progress denominator found")) return false;
        if (!this.validate(this.barProgress, "No bar progress found")) return false;

        this.numVideos = this.videoBlocks.length;
        this.updateDenominator(pad(this.numVideos, 2));

        this.prepareThumbnails();
        this.addEventListeners();

        return true;
    }

    update() {
        this.videoStrip.style.transform = `translateX(-${this.activeIndex * 100}vw)`;

        this.updateNumerator(pad(this.activeIndex + 1, 2));
        this.updateBarProgress();
        this.updateVideoPlayer();
        this.updatePlayButton();
    }

    async prepareThumbnails() {
        let idx = 0;
        for (const block of this.videoBlocks) {
            const vimeoThumbnail = block.querySelector(".vimeo-thumbnail[data-vimeo-url]");

            if (vimeoThumbnail) {
                const url = vimeoThumbnail.getAttribute("data-vimeo-url") ?? "";

                const video = new VimeoVideo(url, 1920, 1080, false);
                this.vimeoVideos[idx] = video;
                await video.updateVideoData();
                this.log("video data updated:", { ...video.apiResponseData });
                if (vimeoThumbnail.getAttribute("src") === "") {
                    const thumbnail = video.apiResponseData?.thumbnail_url ?? "";
                    vimeoThumbnail.setAttribute("src", thumbnail);
                }
            } else {
                this.log("vimeo data not found");
            }
            idx++;
        }
    }

    addEventListeners() {
        const prevButton = this.block.querySelector(".video-carousel-slider-progress .prev");
        const nextButton = this.block.querySelector(".video-carousel-slider-progress .next");
        if (!this.validate(prevButton, "No previous button found")) return;
        if (!this.validate(nextButton, "No next button found")) return;

        this.videoPlayButton = this.block.querySelector(
            `.video-block:nth-child(${this.activeIndex + 1}) .video-playbutton`
        );

        prevButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.prev();
            this.update();
        });

        nextButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.next();
            this.update();
        });

        this.videoCloseButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.closeVideoPlayer();
        });

        this.update();
    }

    prev() {
        this.activeIndex = (this.activeIndex - 1 + this.numVideos) % this.numVideos;
    }

    next() {
        this.activeIndex = (this.activeIndex + 1) % this.numVideos;
    }

    updateNumerator(val: string) {
        this.progressNumerator.innerText = val;
    }

    updateDenominator(val: string) {
        this.progressDenominator.innerText = val;
    }

    updatePlayButton() {
        const buttonSelector = `.video-block:nth-child(${this.activeIndex + 1}) .video-playbutton`;
        this.videoPlayButton = this.block.querySelector(buttonSelector);
        if (!this.validate(this.videoPlayButton, "No video play button found")) return;

        this.videoPlayButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.openVideoPlayer();
        });
    }

    updateBarProgress() {
        const proportion = this.activeIndex / (this.numVideos - 1);
        this.barProgress.style.width = `${constrain(proportion, 0, 1) * 100}%`;
    }

    updateVideoPlayer() {
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

    openVideoPlayer() {
        this.update();
        this.videoDialog.classList.add("open");

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

    closeVideoPlayer() {
        this.update();
        this.videoDialog.classList.remove("open");
    }

    onMouseMove(e: MouseEvent): void {}
    onMouseEnter(e: MouseEvent): void {}
    onMouseLeave(e: MouseEvent): void {}
    onClick(x: number, y: number): void {}
    onPageScroll(scrollY: number): void {}
    onPageResize(width: number, height: number): void {}
    onPageLoad(): void {}
    onEnterViewport(): void {}
    onExitViewport(): void {}
}
