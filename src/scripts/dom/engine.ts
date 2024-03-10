/*
 * Created on Sat Mar 09 2024
 * Author: Connor Doman
 */

import BlockController, { BlockControllerConfig } from "../block-controllers/block-controller";
import { PageController } from "./page-controller";

export interface BlockRegistry {
    [blockClassName: string]: HTMLElement[];
}

export interface ControllerRegistry {
    [blockClassName: string]: new () => BlockController;
}

export class DOMEngine {
    static siteDebug: boolean = true;

    private pageController: PageController;

    private blockControllerConfigs: BlockControllerConfig[] = [];

    private blocks: BlockRegistry = {};
    private controllers: BlockController[] = [];

    private scrollHandlers: Function[] = [];
    private resizeHandlers: Function[] = [];

    constructor(...blockConfigs: BlockControllerConfig[]) {
        this.blockControllerConfigs = blockConfigs;
        this.pageController = new PageController();
    }

    addControllerConfig(config: BlockControllerConfig) {
        this.blockControllerConfigs.push(config);
    }

    init() {
        // initialize the page controller
        this.pageController.init();
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
        this.resizeHandlers.forEach((handler) => handler(width, height));
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

    isFinished(): boolean {
        return this.controllers.every((controller) => controller.initialized);
    }
}
