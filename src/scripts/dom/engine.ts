/*
 * Created on Sat Mar 09 2024
 * Author: Connor Doman
 */

import BlockController, { BlockControllerConfig } from "./block-controllers/block-controller";
import { PageController } from "./page-controller";
import ScrollDownCircleController from "./scroll-down-controller";

export interface BlockRegistry {
    [blockClassName: string]: HTMLElement[];
}

export interface ControllerRegistry {
    [blockClassName: string]: new () => BlockController;
}

export class DOMEngine {
    static readonly RESIZE_WAIT_MS: number = 100;

    static siteDebug: boolean = true;

    private pageController: PageController;
    private scrollDownCircleController: ScrollDownCircleController;

    private blockControllerConfigs: BlockControllerConfig[] = [];

    private blocks: BlockRegistry = {};
    private controllers: BlockController[] = [];

    private scrollHandlers: Function[] = [];
    private resizeHandlers: Function[] = [];

    private resizeTimeout: number;

    constructor(...blockConfigs: BlockControllerConfig[]) {
        this.blockControllerConfigs = blockConfigs;
        this.pageController = new PageController();
        this.scrollDownCircleController = new ScrollDownCircleController("scroll-down", ".header-scroll-down-target");
    }

    addControllerConfig(config: BlockControllerConfig) {
        this.blockControllerConfigs.push(config);
    }

    init() {
        // initialize the page controller
        this.pageController.init();
        // initialize the scroll down circle controller
        this.scrollDownCircleController.init();
        // find all blocks listed in config
        this.collectBlocks();
        // create a controller for each block found
        this.createControllers();
        // set up controllers
        this.controllerSetup();
        // add event listeners for each controller
        this.addEventListeners();
        // finish loading
        this.finish();
    }

    private collectBlocks() {
        // search for which blocks of the config are present in the current DOM
        for (const config of this.blockControllerConfigs) {
            const thoseBlocks: NodeListOf<HTMLElement> = document.querySelectorAll(
                `.${config.blockClassName.replaceAll(".", "")}`
            );
            this.blocks[config.blockClassName] = Array.from(thoseBlocks);
        }
        this.log("Blocks collected:", this.blocks);
    }

    private createControllers() {
        // the only controllers that are created are the ones that have had their blocks collected
        for (const config of this.blockControllerConfigs) {
            const blocksList = this.blocks[config.blockClassName];
            // if there are blocks for this controller, instantiate the controller for each instance of those blocks
            if (blocksList.length > 0) {
                // isntantiate the controller for each block
                // performance should be better since these controllers don't have to traverse the DOM anymore
                blocksList.forEach((block: HTMLElement) => {
                    this.controllers.push(new config.controller(block));
                });
            }
        }

        this.log("Controllers created:", this.controllers);
    }

    private controllerSetup() {
        // call setup on each controller
        this.controllers.forEach((controller) => {
            controller.init();
        });
    }

    private addEventListeners() {
        // add event listeners to blocks, gather global listeners
        this.controllers.forEach((controller) => {
            controller._addStaticEventListeners();

            if (controller.onPageScroll) {
                this.log("Adding scroll handler for", controller.name);
                this.scrollHandlers.push(controller.onPageScroll.bind(controller));
            }
            if (controller.onPageResize) {
                this.resizeHandlers.push(controller.onPageResize.bind(controller));
            }
        });

        // add global event listeners
        window.addEventListener("scroll", (_) => {
            this.onPageScroll(window.scrollY);
        });
        window.addEventListener("resize", (_) => {
            this.onPageResize(window.innerWidth, window.innerHeight);
        });
    }

    private finish() {
        this.pageController.finishedCondition = this.isFinished.bind(this);
        this.pageController.finish();
    }

    private onPageScroll(scrollY: number) {
        this.scrollHandlers.forEach((handler) => handler(scrollY));
    }

    private onPageResize(width: number, height: number) {
        // debounce resize events by waiting 250ms
        window.clearTimeout(this.resizeTimeout);
        this.resizeTimeout = window.setTimeout(() => {
            // actual resize event handling
            this.resizeHandlers.forEach((handler) => handler(width, height));
        }, DOMEngine.RESIZE_WAIT_MS);
    }

    private log(...args: any[]) {
        if (DOMEngine.siteDebug) {
            console.log(`[${this.constructor.name}]`, ...args);
        }
    }

    private error(...args: any[]) {
        if (DOMEngine.siteDebug) {
            console.error(`[${this.constructor.name}]`, ...args);
        }
    }

    toggleDebug(debug?: boolean) {
        if (debug !== undefined) {
            DOMEngine.siteDebug = debug;
            return;
        }
        DOMEngine.siteDebug = !DOMEngine.siteDebug;
    }

    setControllerDebug(controllerName: string, debug: boolean) {
        const controller = this.controllers.find((controller) => controller.name === controllerName);
        if (controller) {
            controller.debug = debug;
        } else {
            this.error(`Controller ${controllerName} not found`);
        }
    }

    overrideAllControllersDebug(debug: boolean) {
        this.controllers.forEach((controller) => {
            controller.debug = debug;
        });
    }

    isFinished(): boolean {
        return (
            this.controllers.every((controller) => controller.initialized) &&
            this.scrollDownCircleController.isInitialized
        );
    }
}
