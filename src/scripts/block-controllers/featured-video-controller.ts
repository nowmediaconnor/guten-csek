/*
 * Created on Sat Mar 09 2024
 * Author: Connor Doman
 */

import { BlockController } from "../dom/block-controller";

export default class FeaturedVideoController extends BlockController {
    private videoContainer: HTMLElement;
    private videoShade: HTMLElement;
    private videoPlayer: HTMLVideoElement;
    private playButton: HTMLElement;

    setup(): boolean {
        this.debug = false;

        this.videoContainer = this.block.querySelector(".video-container") as HTMLElement;
        this.videoShade = this.block.querySelector(".video-container .video-shade") as HTMLElement;
        this.videoPlayer = this.block.querySelector(".video-container video") as HTMLVideoElement;
        this.playButton = this.block.querySelector(".video-container .playbutton") as HTMLElement;

        this.validate(this.videoContainer !== undefined, "Video container found.", "Video container not found.");
        this.validate(this.videoShade !== undefined, "Video shade found.", "Video shade not found.");
        this.validate(this.videoPlayer !== undefined, "Video player found.", "Video player not found.");
        this.validate(this.playButton !== undefined, "Play button found.", "Play button not found.");

        const videoPlayerRect = this.videoPlayer.getBoundingClientRect();
        this.videoContainer.style.paddingBottom = `${(videoPlayerRect.height / videoPlayerRect.width) * 100}%`;

        this.addEventListeners();

        return true;
    }

    private addEventListeners() {
        this.info("Adding controls event listeners.");
        this.playButton.addEventListener("click", () => {
            this.hideShade();
            this.hidePlayButton();
            this.playVideo();
        });

        this.videoPlayer.addEventListener("ended", this.onVideoEndOrPause.bind(this));
        this.videoPlayer.addEventListener("pause", this.onVideoEndOrPause.bind(this));
    }

    private hideShade() {
        this.videoShade.style.opacity = "0";
    }

    private hidePlayButton() {
        this.playButton.style.display = "none";
    }

    private showShade() {
        this.videoShade.style.opacity = "1";
    }

    private showPlayButton() {
        this.playButton.style.display = "flex";
    }

    private onVideoEndOrPause() {
        this.showShade();
        this.showPlayButton();
        this.videoPlayer.controls = false;
    }

    private playVideo() {
        this.videoPlayer.controls = true;
        this.videoPlayer.play();
    }

    private pauseVideo() {
        this.videoPlayer.pause();
    }

    onEnterViewport(): void {}
    onExitViewport(): void {
        this.pauseVideo();
    }

    onMouseMove(e: MouseEvent): void {}
    onMouseEnter(e: MouseEvent): void {}
    onMouseLeave(e: MouseEvent): void {}
    onClick(x: number, y: number): void {}
    onPageScroll(scrollY: number): void {}
    onPageResize(width: number, height: number): void {}
    onPageLoad(): void {}
}
