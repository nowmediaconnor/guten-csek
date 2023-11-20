/*
 * Created on Sat Sep 30 2023
 * Author: Connor Doman
 */

import { BlockController } from "../dom";
import { getImageColor } from "../files";

/**
 * What does this controller need to do:
 * - calculate kmeans of selected image
 * - set card to that color
 */

export default class NextProjectController extends BlockController {
    blockClassname: string;

    blocks: NodeListOf<HTMLElement>;

    image: HTMLImageElement;
    imageBacking: HTMLElement;

    constructor(nextProjectBlockClassName: string) {
        super();
        this.name = "NextProjectController";
        if (!nextProjectBlockClassName)
            throw new Error("NextProjectController: nextProjectBlockClassName is undefined");

        this.blockClassname = nextProjectBlockClassName;
    }
    setup(): void {
        this.blocks = document.querySelectorAll(this.blockClassname);

        // this.debug = true;

        if (this.invalid(this.blocks.length > 0)) {
            this.log("No next project blocks found");
            return;
        }

        this.blocks.forEach((block: HTMLElement, index: number) => {
            this.log(`Prepping NextProjectBlock ${index}...`);

            // #post-260 > div > section.wp-block-guten-csek-next-project-block > div > div.next-project-image > img
            const image = block.querySelector("div > div.next-project-image > img") as HTMLImageElement;
            const imageBacking = block.querySelector(".image-backing") as HTMLElement;

            if (this.invalid(image)) {
                this.log("No image found");
                return;
            }
            if (image && imageBacking) {
                // image.addEventListener("load", () => {
                this.updateImageBacking(image, imageBacking);
                // });
            } else {
                this.log("No image or image backing found");
            }
        });

        this.isInitialized = true;
    }

    updateImageBacking(image: HTMLImageElement, imageBacking: HTMLElement) {
        this.log("Updating image backing...");
        getImageColor(image.src).then((color) => {
            imageBacking.style.backgroundColor = color;
        });
    }

    onMouseMove(e: MouseEvent, blockIndex: number): void {}

    onScroll(e: Event, pos: number): void {}
}
