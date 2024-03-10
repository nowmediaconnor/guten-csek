/*
 * Created on Thu Aug 10 2023
 * Author: Connor Doman
 */

import { createDOMController } from "./domcontroller";
// import { registerAllBlocks } from "./scripts/register-blocks";
import { runAccumulators } from "./scripts/accumulators";
import DOMController from "./scripts/dom";
import { DOMEngine } from "./scripts/dom/engine";
import { log } from "./scripts/global";
import { getAllMedia } from "./scripts/wp";

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

    window.requestAnimationFrame(() => {
        window.domController.debugMode = true;
        window.domController.setup();
    });

    setTimeout(() => {
        // hide loading panel if DOM controller is not in use...
        if (!window.domController.isStarted || !window.domController) {
            window.domController.hideLoadingPanel();
        }
    }, 1000);
});
