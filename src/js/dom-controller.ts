/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import { randomIntInRange, randomPartOfOne } from "./scripts/math";
import BlockController, { ControllerProperties } from "./block-controller";
import { GutenCsek, error, log } from "./guten-csek";

interface DOMControllerState extends ControllerProperties {
    blockControllers: ControllerProperties[];
    loadingInterval: number;
}
/**
 * DOMController
 *
 * This class handles using the above legacy functions and also determines when the DOM is ready and the loading indicator can be removed.
 */
export default class DOMController implements DOMControllerState {
    static siteDebug: boolean = false;

    id: number;

    name: string;
    blockControllers: ControllerProperties[];
    loadingInterval: number = -1;
    debug: boolean;
    isInitialized: boolean;
    blocks: NodeListOf<HTMLElement> | undefined;

    isStarted: boolean;

    loadingPanel: HTMLDivElement | undefined;

    isLetsTalkOpen: boolean = false;
    letsTalkScreen: HTMLDivElement | undefined;
    letsTalkOpenButtons: NodeListOf<HTMLAnchorElement> | undefined;
    letsTalkCloseButton: HTMLAnchorElement | undefined;

    url: URL;
    basePath: string;
    usingEditor: boolean = false;

    taglineScroll: boolean = true;

    private scrollActions: (() => void)[] = [];

    constructor(...blockControllers: ControllerProperties[]) {
        // super();
        this.id = randomIntInRange(0, 1000000);
        this.name = "DOMController";
        this.blockControllers = blockControllers;
        this.debug = true;
        this.isInitialized = false;
        this.isStarted = false;

        this.url = new URL(window.location.href);
        this.basePath = this.url.pathname.split("/").slice(0, -1).join("/");
        const searchParams = new URLSearchParams(this.url.search);

        const isAdmin = this.basePath === "/wp-admin";
        const isEdit = searchParams.get("action") === "edit";
        this.usingEditor = isAdmin && isEdit;

        this.scrollActions = [];

        console.log(`Instantiated DOMController ${this.id}`);
    }

    addControllerAfterSetup(controller: BlockController) {
        this.blockControllers.push(controller);

        if (this.isInitialized) {
            controller.setup();
        }
        this.addEventListeners();
    }

    addControllerBeforeSetup(controller: BlockController, index?: number) {
        if (index && index >= 0 && index < this.blockControllers.length) {
            this.blockControllers.splice(index, 0, controller);
        } else {
            this.blockControllers.push(controller);
        }
    }

    addControllerAndReset(controller: BlockController, index?: number) {
        this.addControllerBeforeSetup(controller, index);
        this.setup();
    }

    prepareLoadingPanel() {
        const existingPanel = document.getElementById("loading") as HTMLDivElement;
        if (existingPanel) {
            this.loadingPanel = existingPanel;
        } else if (!existingPanel) {
            this.loadingPanel = document.createElement("div");
            this.loadingPanel.id = "loading";
            document.body.prepend(this.loadingPanel);
        }

        window.addEventListener("beforeunload", () => {
            this.log("unload dom controller...");
        });
    }

    checkIfLetsTalkRequested(): boolean {
        const hash = window.location.hash;
        if (hash === "#contact") {
            this.openLetsTalk();
            return true;
        }
        return false;
    }

    prepareLetsTalkScreen(): boolean {
        const letsTalk = document.getElementById("lets-talk") as HTMLDivElement;
        if (!letsTalk) {
            this.err("Lets talk screen not found.");
            return false;
        }

        const letsTalkButtons: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".lets-talk-open");
        if (!letsTalkButtons || letsTalkButtons.length === 0) {
            this.err("Lets talk buttons not found.");
            return false;
        }

        const letsTalkCloseButton = document.getElementById("lets-talk-close") as HTMLAnchorElement;
        if (!letsTalkCloseButton) {
            this.err("Lets talk close button not found.");
            return false;
        }

        this.letsTalkScreen = letsTalk;
        this.letsTalkOpenButtons = letsTalkButtons;
        this.letsTalkCloseButton = letsTalkCloseButton;

        this.checkIfLetsTalkRequested();

        return true;
    }

    hideLoadingPanel() {
        this.loadingPanel?.classList.add("complete");
    }

    setup() {
        if (this.isStarted === false) this.isStarted = true;

        this.prepareLoadingPanel();
        this.prepareExpandingVideoBlocks();

        // this.setFeaturedImageColors();

        for (const controller of this.blockControllers) {
            try {
                controller.setup();
                this.log("Set up", controller.name);
            } catch (err: any) {
                this.err("Error setting up:", controller.name, err);
                controller.isInitialized = true;
            }
        }

        this.addEventListeners();

        if (this.usingEditor) {
            this.log("Using editor, not showing loading panel.");
            this.hideLoadingPanel();
        } else if (!this.usingEditor) {
            // check if all controllers are loaded and show page
            this.loadingInterval = window.setInterval(() => {
                if (this.finished()) {
                    window.clearInterval(this.loadingInterval);
                    this.hideLoadingPanel();
                    this.log("Finished loading");
                }
            }, 1000);
        }

        this.isInitialized = true;
    }

    addEventListeners() {
        // block controller listeners
        for (const controller of this.blockControllers) {
            try {
                // prepare reload listeners
                window.addEventListener("beforeunload", (e) => {
                    this.beforeReload();

                    if (controller.beforeReload) {
                        controller.beforeReload();
                    }
                });
                // prepare scroll listeners
                window.addEventListener("scroll", (e) => {
                    // this.scroll();

                    const scrollY = window.scrollY;

                    if (controller.scroll) {
                        controller.scroll(scrollY);
                    }
                });
                if (controller.blocks) {
                    // prepare mouse move listeners
                    controller.blocks.forEach((block, index) => {
                        if (GutenCsek.isMobile) return;
                        if (controller.onMouseMove) {
                            block.addEventListener("mousemove", (e) => {
                                if (controller.onMouseMove) controller.onMouseMove(e, index);
                            });
                            block.addEventListener("mouseenter", (e) => {
                                if (controller.onMouseMove) controller.onMouseMove(e, index);
                            });
                        }
                    });
                }
            } catch (err: any) {
                this.err(`Error in ${controller.name} adding event listeners:`, err);
            }
        }

        // local scroll actions
        for (const action of this.scrollActions) {
            window.addEventListener("scroll", action);
        }

        // header/footer listeners
        if (this.prepareLetsTalkScreen()) {
            this.letsTalkOpenButtons?.forEach((btn) => {
                btn.addEventListener("click", () => {
                    this.openLetsTalk();
                });
            });

            this.letsTalkCloseButton?.addEventListener("click", () => {
                this.closeLetsTalk();
            });
        }
        // keyboard listeners
        window.addEventListener("keydown", (e) => {
            this.log("Key pressed:", e.key);
            // close lets talk on escape key
            if (e.key === "Escape" && this.isLetsTalkOpen) {
                this.log("Closing let's talk...");
                this.closeLetsTalk();
                e.preventDefault();
            }

            if (e.ctrlKey) {
                console.info("[CsekCreative] (Press Ctrl + D to toggle debug mode)");
            }

            // debug mode
            if (e.ctrlKey && e.key === "d") {
                const newMode = !this.debug;
                this.debugMode = newMode;
                console.info("[CsekCreative] Debug mode:", this.debug ? "ON" : "OFF");
                e.preventDefault();
            }
        });
    }

    finished() {
        for (const controller of this.blockControllers) {
            if (!controller.isInitialized) {
                this.log(controller.name, "not yet initialized...");
                return false;
            }
        }
        return this.isInitialized;
    }

    openLetsTalk() {
        if (!this.letsTalkScreen) return;
        this.letsTalkScreen.classList.add("open");
        this.isLetsTalkOpen = true;
    }

    closeLetsTalk() {
        if (!this.letsTalkScreen) return;
        this.letsTalkScreen.classList.remove("open");
        this.isLetsTalkOpen = false;
    }

    beforeReload() {
        if (this.usingEditor) return;
        this.loadingPanel?.classList.remove("complete");
    }

    overrideAllDebug(state: boolean) {
        this.debug = state;
        this.overrideDebug(state, undefined);
    }

    overrideDebug(state: boolean, controllerName?: string) {
        for (const controller of this.blockControllers) {
            if (!controllerName || controller.name === controllerName) controller.debug = state;
        }
    }

    onMouseMove(e: MouseEvent, blockIndex: number): void {}

    set debugMode(state: boolean) {
        DOMController.siteDebug = state;
        this.debug = state;
    }

    prepareExpandingVideoBlocks() {
        // add scroll listener
        const expandingVideoBlocks = document.querySelectorAll(".wp-block-guten-csek-expanding-video-block");
        const elementsToFadeOnScroll = document.querySelectorAll(".scroll-fade-away");

        for (const videoBlock of expandingVideoBlocks) {
            const threshold = videoBlock.querySelector(".threshold");
            const video = videoBlock.querySelector(".expanding-video-container");

            if (!threshold || !video) continue;

            this.scrollActions.push(() => {
                // window.addEventListener("scroll", () => {
                const blockRect = videoBlock.getBoundingClientRect();
                const thresholdRect = threshold.getBoundingClientRect();
                const thresholdTop = thresholdRect.top;

                if (parseInt(thresholdTop.toString()) <= 0 && this.taglineScroll && blockRect.bottom > 0) {
                    video.classList.add("expanded");
                    for (const element of elementsToFadeOnScroll) {
                        element.classList.add("hide");
                    }
                    document.body.style.backgroundColor = "#131313";
                    this.taglineScroll = false;
                    log("Expansion threshold reached");
                } else if (parseInt(thresholdTop.toString()) > 0 && !this.taglineScroll) {
                    video.classList.remove("expanded");
                    for (const element of elementsToFadeOnScroll) {
                        element.classList.remove("hide");
                    }
                    document.body.style.backgroundColor = "transparent";
                    this.taglineScroll = true;
                }
            });

            const floatingImages = videoBlock.querySelectorAll(".floating-image");

            for (const image of floatingImages) {
                const imageElement = image as HTMLElement;

                const randomDelay = randomIntInRange(0, 1000);
                const randomDuration = randomIntInRange(1000, 3000);
                const randomXDisplacement = randomPartOfOne();

                imageElement.style.animationDelay = `${-randomDelay}ms`;
                imageElement.style.animationDuration = `${randomDuration}ms`;
                if (Math.random() > 0.5) {
                    imageElement.style.left = `${randomXDisplacement}rem`;
                } else {
                    imageElement.style.right = `${randomXDisplacement}rem`;
                }

                log({ randomDelay, randomDuration, randomXDisplacement });
            }
        }
    }

    log(...args: any[]) {
        if (this.debug) log("[DOMController]", ...args);
    }

    err(...args: any[]) {
        if (this.debug) error("[DOMController]", ...args);
    }
}
