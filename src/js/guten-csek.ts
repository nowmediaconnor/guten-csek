/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import BlockController from "./block-controller";
import DOMController from "./dom-controller";

/** Global Wordpress Interfaces */

export interface GutenbergBlockProps {
    attributes: any;
    setAttributes?: any;
}

export interface GutenCsekBlockEditProps<T> extends GutenbergBlockProps {
    attributes: T;
    setAttributes: (attributes: Partial<T>) => void;
}

export interface GutenCsekBlockSaveProps<T> extends GutenbergBlockProps {
    attributes: T;
}

/** Global Settings Class */

export class GutenCsek {
    static siteDebug = true;
    static siteName = "Csek Creative";

    static domController: DOMController = new DOMController();

    static get isMobile(): boolean {
        return window.innerWidth <= 768;
    }

    static enqueueController(blockController: BlockController): void {
        this.log(`Enqueueing ${blockController.name}...`);
        this.domController.addControllerBeforeSetup(blockController);
    }

    static setupDOMController(): void {
        this.log("Setting up DOM Controller...");
        this.domController.debug = this.siteDebug;
        this.domController.setup();
    }

    static log(...msg: any[]): void {
        if (this.siteDebug) {
            console.log(`[${this.siteName}]`, ...msg);
        }
    }

    static err(...msg: any[]): void {
        if (this.siteDebug) {
            console.error(`[${this.siteName}]`, ...msg);
        }
    }
}

/** Utility Functions */

export const log = (...args: any[]) => {
    GutenCsek.log(...args);
};

export const error = (...args: any[]) => {
    GutenCsek.err(...args);
};
