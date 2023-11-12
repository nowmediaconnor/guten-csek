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

export const prepareScrollingProjectsBlocks = () => {
    const scrollingProjectsBlocks = document.querySelectorAll(".wp-block-guten-csek-scrolling-projects-block");

    const animationRateMilliseconds = 12.5; // ms

    for (const block of scrollingProjectsBlocks) {
        const containers = block.querySelectorAll(".project-ribbon");

        let ribbonRow = 0;

        for (const ribbon of containers) {
            const evenRow = ribbonRow % 2 === 0;

            if (!evenRow) {
                ribbon.classList.add("reverse");
            }

            const speed = randomIntInRange(3, 3) * 0.125 * (evenRow ? 1 : 1);

            const containerRect = ribbon.getBoundingClientRect();
            const list = ribbon.querySelector("ul");

            if (!list) continue;

            const allListItems = list.querySelectorAll("li");

            const items = shuffle(Array.from(allListItems));

            // console.log({ items });

            list.innerHTML = "";
            for (const item of items) {
                if (!item) continue;

                list.appendChild(item);
                const dash = document.createElement("li");
                dash.innerHTML = "&nbsp;&mdash;&nbsp;";
                list.appendChild(dash);
            }

            let currentOffset = 0;

            const animateMarquee = (direction: number) => {
                direction = clampInt(direction, -1, 1);

                if (direction === 0) return;

                const endListItem =
                    direction > 0 ? list.querySelector("li:first-child") : list.querySelector("li:first-child");

                if (!endListItem) return;

                const endListItemRect = endListItem.getBoundingClientRect();
                const endListItemSide = direction > 0 ? endListItemRect.right : endListItemRect.left;
                const containerSide = direction > 0 ? containerRect.left : containerRect.right;

                switch (direction) {
                    case 1:
                        if (endListItemSide < containerSide) {
                            currentOffset = -1;
                            list.appendChild(endListItem);
                        }
                        list.style.left = `${currentOffset}px`;
                        break;
                    case -1:
                        if (endListItemSide > containerSide) {
                            currentOffset = 1;
                            list.appendChild(endListItem);
                        }
                        list.style.right = `${currentOffset}px`;
                        break;
                }

                currentOffset -= speed;
            };

            window.setInterval(() => animateMarquee(evenRow ? 1 : -1), animationRateMilliseconds);
            ribbonRow++;
        }
    }
};

export interface ControllerProperties {
    name: string;
    debug: boolean;
    isInitialized: boolean;
    setup(): void;
    beforeReload?(): void;
    scroll?(scrollY?: number): void;
}

export abstract class BlockController implements ControllerProperties {
    name: string;
    debug: boolean;
    isInitialized: boolean;

    static isMobile(): boolean {
        return window.innerWidth <= 768;
    }

    constructor() {
        this.name = "BlockController";
    }

    abstract setup(): void;

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

    isStarted: boolean;

    loadingPanel: HTMLDivElement;

    isLetsTalkOpen: boolean = false;
    letsTalkScreen: HTMLDivElement;
    letsTalkOpenButtons: NodeListOf<HTMLAnchorElement>;
    letsTalkCloseButton: HTMLAnchorElement;

    constructor(...blockControllers: ControllerProperties[]) {
        super();
        this.name = "DOMController";
        this.blockControllers = blockControllers;
        this.debug = true;
        this.isInitialized = false;
        this.isStarted = false;
        this.prepareLoadingPanel();
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

        // this.overrideAllDebug(true);
        // this.overrideDebug(false, "ScrollDownController");

        // this.prepareLoadingPanel();

        prepareExpandingVideoBlocks();

        this.addEventListeners();

        this.setFeaturedImageColors();

        // prepareScrollingProjectsBlocks();
        for (const controller of this.blockControllers) {
            controller.setup();
            this.log("Set up", controller.name);
        }

        // check if all controllers are loaded and show page
        this.loadingInterval = window.setInterval(() => {
            if (this.finished()) {
                window.clearInterval(this.loadingInterval);
                this.hideLoadingPanel();
                this.log("Finished loading");
            }
        }, 1000);

        this.isInitialized = true;
    }

    addEventListeners() {
        // prepare reload listeners
        window.addEventListener("beforeunload", (e) => {
            this.beforeReload();

            for (const controller of this.blockControllers) {
                if (controller.beforeReload) {
                    controller.beforeReload();
                }
            }
        });
        // prepare scroll listeners
        window.addEventListener("scroll", (e) => {
            // this.scroll();

            const scrollY = window.scrollY;

            for (const controller of this.blockControllers) {
                if (controller.scroll) {
                    controller.scroll(scrollY);
                }
            }
        });

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

    async setFeaturedImageColors() {
        await updateFeaturedImageColorDerivatives();
    }
}
