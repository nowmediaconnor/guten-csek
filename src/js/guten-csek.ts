/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import { getImageColor } from "./scripts/files";

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
    static siteDebug = false;
    static siteName = "Csek Creative";

    static log(...msg: any[]): void {
        if (this.siteDebug) {
            log(`[${this.siteName}]`, ...msg);
        }
    }

    static err(...msg: any[]): void {
        if (this.siteDebug) {
            error(`[${this.siteName}]`, ...msg);
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
