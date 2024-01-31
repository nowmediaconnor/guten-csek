/*
 * Created on Wed Jan 31 2024
 * Author: Connor Doman
 */

import { BlockController } from "../../dom";

export default class NewsletterController extends BlockController {
    blocks: NodeListOf<HTMLElement>;

    constructor() {
        super();
        this.blocks = document.querySelectorAll(".newsletter");
    }

    setup(): void {
        throw new Error("Method not implemented.");
    }
    onMouseMove?(e: MouseEvent, blockIndex: number): void {
        throw new Error("Method not implemented.");
    }
}
