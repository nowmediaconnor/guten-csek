/*
 * Created on Sat Mar 09 2024
 * Author: Connor Doman
 */

export class BlockController {
    private block: HTMLElement;

    constructor(block: HTMLElement) {
        this.block = block;
    }
}

export interface BlockControllerConfig {
    controller: new (block: HTMLElement) => BlockController;
    blockClassName: string;
}
