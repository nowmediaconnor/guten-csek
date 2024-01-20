/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import { GutenCsek, error, log } from "./guten-csek";

export interface ControllerProperties {
    name: string;
    debug: boolean;
    isInitialized: boolean;
    blocks: NodeListOf<HTMLElement> | undefined;
    setup(): void;
    beforeReload?(): void;
    scroll?(scrollY?: number): void;
    onMouseMove?(e: MouseEvent, blockIndex: number): void;
}

export default abstract class BlockController implements ControllerProperties {
    name: string;
    debug: boolean;
    isInitialized: boolean;
    abstract blocks: NodeListOf<HTMLElement> | undefined;

    constructor() {
        this.name = "BlockController";
        this.debug = false;
        this.isInitialized = false;
    }

    abstract setup(): void;

    abstract onMouseMove?(e: MouseEvent, blockIndex: number): void;

    invalid(truthy: any): boolean {
        if (truthy) {
            this.log("Block is valid.");
            return false;
        }
        this.log("Block is invalid.");
        this.isInitialized = true;
        return true;
    }

    log(...msg: any[]): void {
        if (this.debug && GutenCsek.siteDebug) {
            log(`[${this.name}]`, ...msg);
        }
    }

    err(...msg: any[]): void {
        if (this.debug && GutenCsek.siteDebug) {
            error(`[${this.name}]`, ...msg);
        }
    }
}
