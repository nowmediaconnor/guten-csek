/*
 * Created on Thu Aug 10 2023
 * Author: Connor Doman
 */

import { createDOMController } from "./domcontroller";
// import { registerAllBlocks } from "./scripts/register-blocks";
import { runAccumulators } from "./scripts/accumulators";
import ExpandingMediaController from "./scripts/block-controllers/expanding-video-controller";
import DOMController from "./scripts/dom";
import { ControllerConfig } from "./scripts/dom/block-controller";
import { DOMEngine } from "./scripts/dom/engine";
import { log } from "./scripts/global";

declare global {
    interface Window {
        domController: DOMController;
        domEngine: DOMEngine;
    }
}

// registerAllBlocks();

window.addEventListener("load", (e) => {
    log("[Csek Creative] Window loaded.");

    /* Prepare Accumulator Elements */
    runAccumulators();

    /* Prepare DOM Controller */
    window.domController = createDOMController();

    /* Prepare DOM Engine */
    const blockConfigs: ControllerConfig = [
        {
            blockClassName: ".wp-block-guten-csek-expanding-video-block",
            controller: ExpandingMediaController,
        },
    ];
    window.domEngine = new DOMEngine(...blockConfigs);

    window.requestAnimationFrame(() => {
        window.domController.debugMode = false;
        window.domController.setup();
        window.domEngine.init();
    });

    setTimeout(() => {
        // hide loading panel if DOM controller is not in use...
        if (!window.domController.isStarted || !window.domController) {
            window.domController.hideLoadingPanel();
        }
    }, 1000);
});
