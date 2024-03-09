/*
 * Created on Sat Mar 09 2024
 * Author: Connor Doman
 */

import { BlockController, BlockControllerConfig } from "./controller";

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

    constructor(...blockConfigs: BlockControllerConfig[]) {
        this.blockControllerConfigs = blockConfigs;
    }

    addControllerConfig(config: BlockControllerConfig) {
        this.blockControllerConfigs.push(config);
    }

    init() {
        this.collectBlocks();
        this.collectControllers();
    }

    collectBlocks() {
        // search for which blocks of the config are present in the current DOM
        for (const config of this.blockControllerConfigs) {
            const thoseBlocks: NodeListOf<HTMLElement> = document.querySelectorAll(`.${config.blockClassName}`);
            this.blocks[config.blockClassName] = Array.from(thoseBlocks);
        }
    }

    collectControllers() {
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
}
