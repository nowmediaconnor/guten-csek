/*
 * Created on Tue Aug 29 2023
 * Author: Connor Doman
 */

import { BlockController } from "../dom";
import { map } from "../math";

export default class TeamController extends BlockController {
    debug = true;

    headshotOffsetPx = 256;

    blocks: NodeListOf<HTMLElement>;
    blockClassName: string;
    block: HTMLElement | null;
    headshots: NodeListOf<HTMLDivElement>;

    constructor(className?: string) {
        super();
        this.name = "TeamController";
        this.blockClassName = className ?? ".wp-block-guten-csek-team-block";
    }

    setup() {
        // get the block
        this.block = document.querySelector(this.blockClassName);
        if (this.invalid(this.block)) {
            this.err("No block found");
            return;
        }

        // get all headshots
        this.headshots = this.block?.querySelectorAll(".headshot") as NodeListOf<HTMLDivElement>;
        if (this.invalid(this.headshots.length)) {
            this.err("No headshots found");
            return;
        }
        this.setupHeadshots();

        this.isInitialized = true;
    }

    setupHeadshots() {
        if (TeamController.isMobile) return;

        this.headshots.forEach((headshot) => {
            const diameter = parseInt(getComputedStyle(headshot).width);

            // set the initial position
            this.updateHeadshotOffset(headshot, this.headshotOffsetPx);

            // smaller elements should have a longer delay (because they're further away)
            // const delayMS = map(diameter, 0, 128, 100, 0);
            // headshot.style.setProperty("--delay", `${delayMS}ms`);
        });
    }

    scroll() {
        if (TeamController.isMobile) return;

        // relative to the viewport
        const blockRect = this.block?.getBoundingClientRect();
        const blockTop = blockRect?.top ?? 0;
        const blockBottom = blockRect?.bottom ?? 0;
        const blockHeight = blockRect?.height ?? 0;

        // only process offsets if the block is visible
        if (blockTop < window.innerHeight && blockBottom > 0) {
            this.headshots.forEach((headshot) => {
                const posY = map(
                    blockTop,
                    window.innerHeight,
                    -blockHeight,
                    this.headshotOffsetPx,
                    -this.headshotOffsetPx
                );

                this.updateHeadshotOffset(headshot, posY);
            });
        }
    }

    updateHeadshotOffset(headshot: HTMLDivElement, posY: number) {
        const diameter = headshot.clientWidth;
        const speed = (diameter - 32) / 500;

        headshot.style.transform = `translateY(${posY * speed}px)`;
    }

    onMouseMove(e: MouseEvent, blockIndex: number): void {}
}
