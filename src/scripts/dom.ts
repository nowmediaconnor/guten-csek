/*
 * Created on Mon Aug 21 2023
 * Author: Connor Doman
 */

import { shuffle } from "./array";
import CarouselController from "./controllers/carousel-controller";
import CurtainifyController from "./controllers/curtainify-controller";
import ExpandingVideoController from "./controllers/expanding-video-controller";
import ScrollDownController from "./controllers/scroll-down-controller";
import ScrollingProjectsController from "./controllers/scrolling-projects-controller";
import TeamController from "./controllers/team-controller";
import VideoCarouselController from "./controllers/video-carousel-controller";
import { updateFeaturedImageColorDerivatives } from "./global";
import { clampInt, randomIntInRange, randomPartOfOne } from "./math";

export interface GutenbergBlockProps {
    attributes: any;
    setAttributes?: any;
}

export interface GutenCsekBlockEditProps<T> extends GutenbergBlockProps {
    attributes: T;
    setAttributes: (attributes: Partial<T>) => void;
}

export interface GutenCsekBlockSaveProps<T> extends GutenbergBlockProps {
    attributes: T;
}

export interface ControllerScript {
    name: string;
    shortName: string;
    script: string;
    parameters: string[];
}

export const controllerScriptRegistry: ControllerScript[] = [
    {
        name: "CurtainifyController",
        shortName: "curainifyController",
        script: "curtainify-controller.ts",
        parameters: [],
    },
    {
        name: "ScrollDownController",
        shortName: "scrollDownController",
        script: "scroll-down-controller.ts",
        parameters: ["scroll-down", ".scroll-down-target"],
    },
    {
        name: "CarouselController",
        shortName: "carouselController",
        script: "carousel-controller.ts",
        parameters: [".wp-block-guten-csek-horizontal-carousel-block"],
    },
    {
        name: "VideoCarouselController",
        shortName: "videoCarouselController",
        script: "video-carousel-controller.ts",
        parameters: [".wp-block-guten-csek-video-carousel-block"],
    },
    {
        name: "ScrollingProjectsController",
        shortName: "scrollingProjectsController",
        script: "scrolling-projects-controller.ts",
        parameters: [".wp-block-guten-csek-scrolling-projects-block"],
    },
    {
        name: "ExpandingVideoController",
        shortName: "expandingVideoController",
        script: "expanding-video-controller.ts",
        parameters: [".expanding-video-container"],
    },
    {
        name: "TeamController",
        shortName: "teamController",
        script: "team-controller.ts",
        parameters: [".wp-block-guten-csek-team-block"],
    },
];

export const DOM_FLAGS = {
    DEBUG: true,
    taglineSroll: true,
};

export const getChildren = (n: ChildNode | null, skipMe: Node) => {
    let r: ChildNode[] = [];
    for (; n; n = n.nextSibling) if (n.nodeType == 1 && n != skipMe) r.push(n);
    return r;
};

export const getSiblings = (n: Node) => {
    const parent = n.parentNode;
    if (!parent) return [];
    return getChildren(parent.firstChild, n);
};

export const smoothScrollTo = (yPosition: number) => {
    // window.scrollTo({
    //     top: yPosition,
    //     behavior: "instant",
    // });
    window.scrollTo({
        top: yPosition,
        behavior: "smooth",
    });
};

// code for expanding video blocks
export const prepareExpandingVideoBlocks = () => {
    // add scroll listener
    const expandingVideoBlocks = document.querySelectorAll(".wp-block-guten-csek-expanding-video-block");
    const elementsToFadeOnScroll = document.querySelectorAll(".scroll-fade-away");

    for (const videoBlock of expandingVideoBlocks) {
        const threshold = videoBlock.querySelector(".threshold");
        const video = videoBlock.querySelector(".expanding-video-container");

        if (!threshold || !video) continue;

        window.addEventListener("scroll", () => {
            const blockRect = videoBlock.getBoundingClientRect();
            const thresholdRect = threshold.getBoundingClientRect();
            const thresholdTop = thresholdRect.top;

            if (parseInt(thresholdTop.toString()) <= 0 && DOM_FLAGS.taglineSroll && blockRect.bottom > 0) {
                video.classList.add("expanded");
                for (const element of elementsToFadeOnScroll) {
                    element.classList.add("hide");
                }
                document.body.style.backgroundColor = "#131313";
                DOM_FLAGS.taglineSroll = false;
                console.log("threshold reached");
            } else if (parseInt(thresholdTop.toString()) > 0 && !DOM_FLAGS.taglineSroll) {
                video.classList.remove("expanded");
                for (const element of elementsToFadeOnScroll) {
                    element.classList.remove("hide");
                }
                document.body.style.backgroundColor = "transparent";
                DOM_FLAGS.taglineSroll = true;
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

            console.log({ randomDelay, randomDuration, randomXDisplacement });
        }
    }
};

export interface ControllerProperties {
    name: string;
    debug: boolean;
    isInitialized: boolean;
    blocks: NodeListOf<HTMLElement>;
    setup(): void;
    beforeReload?(): void;
    scroll?(scrollY?: number): void;
    onMouseMove?(e: MouseEvent, blockIndex: number): void;
    onScroll?(e: Event, pos: number): void;
}

export abstract class BlockController implements ControllerProperties {
    name: string;
    debug: boolean;
    isInitialized: boolean;
    blocks: NodeListOf<HTMLElement>;

    static get isMobile(): boolean {
        return window.innerWidth <= 768;
    }

    constructor() {
        this.name = "BlockController";
    }

    abstract setup(): void;

    abstract onMouseMove?(e: MouseEvent, blockIndex: number): void;

    abstract onScroll?(e: Event, pos: number): void;

    invalid(truthy: any): boolean {
        if (truthy) {
            this.log("Block is valid.");
            return false;
        }
        this.log("Block is invalid.");
        this.isInitialized = true;
        return true;
    }

    log(...msg: any[]): void {
        if (this.debug) {
            console.log(`[${this.name}]`, ...msg);
        }
    }

    err(...msg: any[]): void {
        if (this.debug) {
            console.error(`[${this.name}]`, ...msg);
        }
    }
}

interface DOMControllerState extends ControllerProperties {
    blockControllers: ControllerProperties[];
    loadingInterval: number;
}

/**
 * DOMController
 *
 * This class handles using the above legacy functions and also determines when the DOM is ready and the loading indicator can be removed.
 */
export default class DOMController extends BlockController implements DOMControllerState {
    name: string;
    blockControllers: ControllerProperties[];
    loadingInterval: number;
    debug: boolean;
    isInitialized: boolean;
    blocks: NodeListOf<HTMLElement>;

    isStarted: boolean;

    loadingPanel: HTMLDivElement;

    isLetsTalkOpen: boolean = false;
    letsTalkScreen: HTMLDivElement;
    letsTalkOpenButtons: NodeListOf<HTMLAnchorElement>;
    letsTalkCloseButton: HTMLAnchorElement;

    url: URL;
    basePath: string;
    usingEditor: boolean = false;

    constructor(...blockControllers: ControllerProperties[]) {
        super();
        this.name = "DOMController";
        this.blockControllers = blockControllers;
        this.debug = true;
        this.isInitialized = false;
        this.isStarted = false;
        this.prepareLoadingPanel();

        this.url = new URL(window.location.href);
        this.basePath = this.url.pathname.split("/").slice(0, -1).join("/");
        const searchParams = new URLSearchParams(this.url.search);

        const isAdmin = this.basePath === "/wp-admin";
        const isEdit = searchParams.get("action") === "edit";
        this.usingEditor = isAdmin && isEdit;
    }

    addController(controller: BlockController) {
        this.blockControllers.push(controller);

        if (this.isInitialized) {
            controller.setup();
        }
        this.addEventListeners();
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
            console.log("unload dom controller...");
        });
    }

    prepareLetsTalkScreen(): boolean {
        const letsTalk = document.getElementById("lets-talk") as HTMLDivElement;
        if (!letsTalk) {
            this.log("Lets talk screen not found.");
            return false;
        }

        const letsTalkButtons: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".lets-talk-open");
        if (!letsTalkButtons || letsTalkButtons.length === 0) {
            this.log("Lets talk buttons not found.");
            return false;
        }

        const letsTalkCloseButton = document.getElementById("lets-talk-close") as HTMLAnchorElement;
        if (!letsTalkCloseButton) {
            this.log("Lets talk close button not found.");
            return false;
        }

        this.letsTalkScreen = letsTalk;
        this.letsTalkOpenButtons = letsTalkButtons;
        this.letsTalkCloseButton = letsTalkCloseButton;

        return true;
    }

    hideLoadingPanel() {
        this.loadingPanel.classList.add("complete");
    }

    setup() {
        if (this.isStarted === false) this.isStarted = true;

        prepareExpandingVideoBlocks();

        this.setFeaturedImageColors();

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
                    this.onScroll(e, window.scrollY);

                    const scrollY = window.scrollY;

                    if (controller.scroll) {
                        controller.scroll(scrollY);
                    }
                });
                if (controller.blocks) {
                    // prepare mouse move listeners
                    controller.blocks.forEach((block, index) => {
                        if (DOMController.isMobile) return;
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

        // header/footer listeners
        if (this.prepareLetsTalkScreen()) {
            this.letsTalkOpenButtons.forEach((btn) => {
                btn.addEventListener("click", () => {
                    this.openLetsTalk();
                });
            });

            this.letsTalkCloseButton.addEventListener("click", () => {
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
        this.loadingPanel.classList.remove("complete");
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

    log(...msg: any[]) {
        if (this.debug) console.log("[DOMController]", ...msg);
    }

    onMouseMove(e: MouseEvent, blockIndex: number): void {}

    onScroll(e: Event, pos: number): void {
        for (const controller of this.blockControllers) {
            if (controller.onScroll) controller.onScroll(e, pos);
        }
    }

    async setFeaturedImageColors() {
        await updateFeaturedImageColorDerivatives();
    }

    static insertAfter = (newNode: Node, referenceNode: Node) => {
        if (!referenceNode.parentNode) return;
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    };

    static getImmediateSuccessors(node: HTMLElement): HTMLElement[] {
        return Array.from(node.children) as HTMLElement[];
    }
}
