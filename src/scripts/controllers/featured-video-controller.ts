/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import { BlockController } from "../dom";

export default class FeaturedVideoController extends BlockController {
    blockClassName: string;

    block: HTMLElement | null;
    videoShade: HTMLElement;
    videoPlayer: HTMLVideoElement;
    playButton: HTMLElement;

    constructor(blockClassName: string) {
        super();
        this.name = "FeaturedVideoController";
        if (!blockClassName) throw new Error("FeaturedVideoController: blockClassName is undefined");
        this.blockClassName = blockClassName;
    }

    setup(): void {
        this.debug = true;
        this.block = document.querySelector(this.blockClassName);

        if (this.invalid(this.block)) {
            this.log("No featured video block found:", this.blockClassName);
            return;
        }

        this.videoShade = this.block?.querySelector(".video-container .video-shade") as HTMLElement;
        this.videoPlayer = this.block?.querySelector(".video-container video") as HTMLVideoElement;
        this.playButton = this.block?.querySelector(".video-container .playbutton") as HTMLElement;

        this.debug = true;

        if (!this.videoShade) {
            this.log("No video shade found");
            this.isInitialized = true;
            return;
        }
        if (!this.videoPlayer) {
            this.log("No video player found");
            this.isInitialized = true;
            return;
        }
        if (!this.playButton) {
            this.log("No play button found");
            this.isInitialized = true;
            return;
        }

        this.addEventListeners();

        this.isInitialized = true;
    }

    addEventListeners() {
        this.log("Adding event listeners...");
        this.playButton.addEventListener("click", () => {
            this.hideShade();
            this.hidePlayButton();
            this.playVideo();
        });

        this.videoPlayer.addEventListener("pause", () => {
            this.showShade();
            this.showPlayButton();
            this.videoPlayer.controls = false;
        });
    }

    playVideo() {
        this.log("Clicked play!");
        this.videoPlayer.controls = true;
        this.videoPlayer.play();
    }

    hideShade() {
        this.videoShade.style.opacity = "0";
    }

    hidePlayButton() {
        this.playButton.style.display = "none";
    }

    showShade() {
        this.videoShade.style.opacity = "1";
    }

    showPlayButton() {
        this.playButton.style.display = "flex";
    }
}
