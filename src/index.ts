/*
 * Created on Thu Aug 10 2023
 * Author: Connor Doman
 */

import domEngine from "./scripts/dom/dom-engine";
import { DOMEngine } from "./scripts/dom/engine";
import { log } from "./scripts/global";

// add DOMEngine to window for typescript
declare global {
    interface Window {
        domEngine: DOMEngine;
    }
}

window.addEventListener("load", (e) => {
    log("[Csek Creative] Window loaded.");

    /* Prepare DOM Engine */
    window.domEngine = domEngine;
    window.domEngine.toggleDebug(false);

    window.requestAnimationFrame(() => {
        window.domEngine.init();
        window.domEngine.overrideAllControllersDebug(DOMEngine.siteDebug);
    });
});
