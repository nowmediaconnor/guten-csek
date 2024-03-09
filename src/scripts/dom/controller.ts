/*
 * Created on Sat Mar 09 2024
 * Author: Connor Doman
 */

export interface BlockControllerConfig {
    controller: new (block: HTMLElement) => BlockController;
    blockClassName: string;
}

export abstract class BlockController {
    private block: HTMLElement;
    private debug: boolean = true;

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

    get controllerName(): string {
        return this.constructor.name;
    }

    abstract setup(): boolean;

    abstract onMouseMove(): void;
    abstract onMouseEnter(): void;
    abstract onMouseLeave(): void;
    abstract onClick(x: number, y: number): void;

    abstract onPageScroll(scrollY: number): void;
    abstract onPageResize(width: number, height: number): void;
    abstract onPageLoad(): void;

    abstract onEnterViewport(): void;
    abstract onExitViewport(): void;

    init() {
        const successfulSetup = this.setup();
        if (successfulSetup) {
            throw new Error(`Failed to set up ${this.controllerName}!`);
        }
        this.viewportObserver.observe(this.block);
        this.initialized = true;
    }

    validate(
        truthy: any,
        success: string = `${this.controllerName} is valid`,
        failure: string = `${this.controllerName} is invalid`,
        error: boolean = this.debug
    ): boolean {
        if (truthy) {
            this.log(success);
            return true;
        } else {
            this.error(failure);
            if (error) throw new Error(failure);
            return false;
        }
    }

    log(...msg: any[]) {
        console.log(`[${this.controllerName}]`, ...msg);
    }

    info(...msg: any[]) {
        if (this.debug) console.info(`[${this.controllerName}]`, ...msg);
    }

    error(...msg: any[]) {
        if (this.debug) console.error(`[${this.controllerName}]`, ...msg);
    }

    warn(...msg: any[]) {
        if (this.debug) console.warn(`[${this.controllerName}]`, ...msg);
    }
}
