/*
 * Created on Sat Mar 16 2024
 * Author: Connor Doman
 */

import BlockController from "./block-controllers/block-controller";
import CircleType from "circletype";

export default class ScrollDownCircleController {
    private _debug: boolean;
    private _initialized: boolean;

    private scrollDownId: string;
    private parentScrollTargetSelector: string;

    private parentObserver: IntersectionObserver;

    private scrollDownElement: HTMLElement;
    private parentScrollTarget: HTMLElement;

    constructor(scrollDownId: string, parentScrollTargetSelector: string) {
        this.scrollDownId = scrollDownId;
        this.parentScrollTargetSelector = parentScrollTargetSelector;
    }

    init(): void {
        this.scrollDownElement = document.getElementById(this.scrollDownId);
        this.parentScrollTarget = document.querySelector(this.parentScrollTargetSelector);

        if (this.scrollDownElement && this.parentScrollTarget) {
            this.prepareCircleType();
            this.prepareObserver();
        } else {
            this.warn("No scroll down element");
        }

        this.isInitialized = true;
    }

    prepareCircleType() {
        new CircleType(this.scrollDownElement);
    }

    prepareObserver() {
        this.parentObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.showScrollDownCircle();
                    } else {
                        this.hideScrollDownCircle();
                    }
                });
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 0,
            }
        );
        this.parentObserver.observe(this.parentScrollTarget);
    }

    hideScrollDownCircle() {
        this.scrollDownElement.style.opacity = "0";
    }

    showScrollDownCircle() {
        this.scrollDownElement.style.opacity = "1";
    }

    log(...msg: any[]) {
        console.log(`[${this.name}]`, ...msg);
    }

    info(...msg: any[]) {
        if (this.debug) console.info(`[${this.name}]`, ...msg);
    }

    error(...msg: any[]) {
        if (this.debug) console.error(`[${this.name}]`, ...msg);
    }

    warn(...msg: any[]) {
        if (this.debug) console.warn(`[${this.name}]`, ...msg);
    }

    get debug() {
        return this._debug;
    }

    set debug(value: boolean) {
        this._debug = value;
    }

    get isInitialized() {
        return this._initialized;
    }

    set isInitialized(value: boolean) {
        this._initialized = value;
    }

    get name(): string {
        return this.constructor.name;
    }
}
