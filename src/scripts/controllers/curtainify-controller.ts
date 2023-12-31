/*
 * Created on Mon Aug 28 2023
 * Author: Connor Doman
 */

import { BlockController, ControllerProperties } from "../dom";
import { prepareCurtainElements } from "../curtainify";

export default class CurtainifyController extends BlockController {
    name: string;
    debug: boolean;
    isInitialized: boolean;
    block: HTMLElement;
    blocks: NodeListOf<HTMLElement>;

    constructor() {
        super();
        this.name = "CurtainifyController";
    }

    setup(): void {
        prepareCurtainElements();
        this.isInitialized = true;
    }

    beforeReload() {
        window.scrollTo(0, 0);
    }

    onMouseMove(e: MouseEvent, blockIndex: number): void {}
}
