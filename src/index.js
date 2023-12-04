/*
 * Created on Thu Aug 10 2023
 * Author: Connor Doman
 */

import { createDOMController } from "./domcontroller";
import { registerAllBlocks } from "./scripts/register-blocks";
import { runAccumulators } from "./scripts/accumulators";

registerAllBlocks();

window.addEventListener("load", (e) => {
    console.log("[Csek Creative] Window loaded.");

    /* Prepare Accumulator Elements */
    runAccumulators();

    /* Prepare DOM Controller */
    window.domController = createDOMController();

    window.requestAnimationFrame(() => {
        window.domController.setup();
        window.domController.overrideAllDebug(false);
        window.domController.debug = true;
        window.domController.overrideDebug(true, "ProcessBlock");
    });

    setTimeout(() => {
        // hide loading panel if DOM controller is not in use...
        if (!window.domController.isStarted || !window.domController) {
            window.domController.hideLoadingPanel();
        }
    }, 1000);
});
