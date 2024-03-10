/*
 * Created on Sat Mar 09 2024
 * Author: Connor Doman
 */

export interface BlockControllerConfig {
    controller: new (block: HTMLElement) => BlockController;
    blockClassName: string;
}

export type ControllerConfig = Array<BlockControllerConfig>;

export abstract class BlockController {
    block: HTMLElement;
    debug: boolean = true;

    private _initialized: boolean = false;
    private _inViewport: boolean = false;

    private viewportObserver: IntersectionObserver;

    constructor(block: HTMLElement) {
        this.block = block;

        this.viewportObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!this.inViewport && entry.isIntersecting) {
                    this.onEnterViewport();
                    this.inViewport = true;
                } else if (this.inViewport && !entry.isIntersecting) {
                    this.onExitViewport();
                    this.inViewport = false;
                }
            });
        });
    }

    set initialized(value: boolean) {
        this._initialized = value;
    }

    get initialized(): boolean {
        return this._initialized;
    }

    set inViewport(value: boolean) {
        this._inViewport = value;
    }

    get inViewport(): boolean {
        return this._inViewport;
    }

    get name(): string {
        return this.constructor.name;
    }

    abstract setup(): boolean;

    abstract onMouseMove(e: MouseEvent): void;
    abstract onMouseEnter(e: MouseEvent): void;
    abstract onMouseLeave(e: MouseEvent): void;
    abstract onClick(x: number, y: number): void;

    abstract onPageScroll(scrollY: number): void;
    abstract onPageResize(width: number, height: number): void;
    abstract onPageLoad(): void;

    abstract onEnterViewport(): void;
    abstract onExitViewport(): void;

    _addStaticEventListeners() {
        this.block.addEventListener("mousemove", (e) => this.onMouseMove(e));
        this.block.addEventListener("mouseenter", (e) => this.onMouseEnter(e));
        this.block.addEventListener("mouseleave", (e) => this.onMouseLeave(e));
        this.block.addEventListener("click", (e) => this.onClick(e.clientX, e.clientY));
    }

    init() {
        const successfulSetup = this.setup();
        if (!successfulSetup) {
            throw new Error(`Failed to set up ${this.name}!`);
        }
        this.viewportObserver.observe(this.block);
        this.initialized = true;
    }

    validate(
        truthy: any,
        failure: string = `${this.name} is invalid`,
        success: string = `${this.name} is valid`,
        error: boolean = this.debug
    ): boolean {
        if (truthy) {
            this.info(success);
            return true;
        } else {
            this.error(failure);
            if (error) throw new Error(failure);
            return false;
        }
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

    toString(): string {
        return `BlockController: [${this.name}]`;
    }
}

class TestBlockController extends BlockController {
    setup(): boolean {
        return true;
    }
    onMouseMove(e: MouseEvent): void {}
    onMouseEnter(e: MouseEvent): void {}
    onMouseLeave(e: MouseEvent): void {}
    onClick(x: number, y: number): void {}
    onPageScroll(scrollY: number): void {}
    onPageResize(width: number, height: number): void {}
    onPageLoad(): void {}
    onEnterViewport(): void {}
    onExitViewport(): void {}
}
