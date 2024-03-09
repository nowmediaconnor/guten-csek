/*
 * Created on Sat Mar 09 2024
 * Author: Connor Doman
 */

import { BlockController, BlockControllerConfig } from "./block-controller";

interface BlockRegistry {
    [blockClassName: string]: HTMLElement[];
}

interface ControllerRegistry {
    [blockClassName: string]: new () => BlockController;
}

class DOMEngine {
    static siteDebug: boolean = true;

    private blockControllerConfigs: BlockControllerConfig[] = [];

    blocks: BlockRegistry = {};
    controllers: BlockController[] = [];

    scrollHandlers: Function[] = [];
    resizeHandlers: Function[] = [];

    constructor(...blockConfigs: BlockControllerConfig[]) {
        this.blockControllerConfigs = blockConfigs;
    }

    addControllerConfig(config: BlockControllerConfig) {
        this.blockControllerConfigs.push(config);
    }

    init() {
        // find all blocks listed in config
        this.collectBlocks();
        // create a controller for each block found
        this.createControllers();
        // add event listeners for each controller
        this.addEventListeners();
    }

    collectBlocks() {
        // search for which blocks of the config are present in the current DOM
        for (const config of this.blockControllerConfigs) {
            const thoseBlocks: NodeListOf<HTMLElement> = document.querySelectorAll(`.${config.blockClassName}`);
            this.blocks[config.blockClassName] = Array.from(thoseBlocks);
        }
    }

    createControllers() {
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
    }

    addEventListeners() {
        // add event listeners to blocks, gather global listeners
        this.controllers.forEach((controller) => {
            controller._addStaticEventListeners();

            if (controller.onPageScroll) {
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

    onPageScroll(scrollY: number) {
        this.scrollHandlers.forEach((handler) => handler(scrollY));
    }

    onPageResize(width: number, height: number) {
        this.resizeHandlers.forEach((handler) => handler(width, height));
    }
}
