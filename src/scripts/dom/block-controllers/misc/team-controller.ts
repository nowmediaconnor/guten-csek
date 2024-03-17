/*
 * Created on Sat Mar 16 2024
 * Author: Connor Doman
 */

import { map } from "../../../math";
import { PageController } from "../../page-controller";
import BlockController from "../block-controller";

export default class TeamController extends BlockController {
    private static readonly HEADSHOT_OFFSET_PX: number = 256;

    private headshots: NodeListOf<HTMLDivElement>;

    debug = true;

    setup(): boolean {
        this.headshots = this.block.querySelectorAll(".headshot");
        if (!this.validate(this.headshots.length, "No headshots found")) return false;

        this.setupHeadshots();

        return true;
    }

    private setupHeadshots() {
        if (PageController.isMobile) return;

        this.headshots.forEach((headshot: HTMLDivElement) => {
            this.updateHeadshotOffset(headshot, TeamController.HEADSHOT_OFFSET_PX);
        });
    }

    private updateHeadshotOffset(headshot: HTMLDivElement, offset: number) {
        const diameter = parseInt(getComputedStyle(headshot).width);
        const diff = TeamController.HEADSHOT_OFFSET_PX / 8;
        const denom = TeamController.HEADSHOT_OFFSET_PX * 2;
        const speed = (diameter - diff) / denom;

        headshot.style.transform = `translateY(${offset * speed}px)`;
    }

    onPageScroll(scrollY: number): void {
        if (PageController.isMobile) return;

        // relative to the viewport
        const blockRect = this.block.getBoundingClientRect();
        const { top, bottom, height } = blockRect;

        if (this.inViewport) {
            this.headshots.forEach((headshot: HTMLDivElement) => {
                const offset = map(
                    top,
                    window.innerHeight,
                    -height,
                    TeamController.HEADSHOT_OFFSET_PX,
                    -TeamController.HEADSHOT_OFFSET_PX
                );
                this.updateHeadshotOffset(headshot, offset);
            });
        }
    }

    onMouseMove(e: MouseEvent): void {}
    onMouseEnter(e: MouseEvent): void {}
    onMouseLeave(e: MouseEvent): void {}
    onClick(x: number, y: number): void {}
    onPageResize(width: number, height: number): void {}
    onPageLoad(): void {}
    onEnterViewport(): void {}
    onExitViewport(): void {}
}
