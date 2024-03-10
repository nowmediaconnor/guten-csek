/*
 * Created on Sat Mar 09 2024
 * Author: Connor Doman
 */

import BlockController from "../block-controller";
import { getImageColor } from "../../../files";

export default class NextProjectController extends BlockController {
    private nextProjectImage: HTMLImageElement;
    private nextProjectImageBacking: HTMLElement;

    setup(): boolean {
        this.debug = false;

        this.nextProjectImage = this.block.querySelector(".next-project-image > img") as HTMLImageElement;
        this.nextProjectImageBacking = this.block.querySelector(".image-backing") as HTMLElement;

        const validImage = this.validate(this.nextProjectImage, "No next project image found");
        const validBacking = this.validate(this.nextProjectImageBacking, "No next project image backing found");

        if (validImage && validBacking) this.updateImageBacking();

        return true;
    }

    private updateImageBacking() {
        getImageColor(this.nextProjectImage.src).then((color) => {
            this.nextProjectImageBacking.style.backgroundColor = color;
        });
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
