/*
 * Created on Thu Aug 10 2023
 * Author: Connor Doman
 */

const { registerBlockType } = wp.blocks;

import { prepareBlockControllers } from "./domcontroller";

import { TaglineHeaderEdit, TaglineHeaderSave } from "./blocks/tagline-header-block";
import { ScrollingProjectsBlockEdit, ScrollingProjectsBlockSave } from "./blocks/scrolling-projects-block";
import { TeamBlockEdit, TeamBlockSave } from "./blocks/team-block";
import { VideoCarouselBlockEdit, VideoCarouselBlockSave } from "./blocks/video-carousel-block";
import { HorizontalCarouselBlockEdit, HorizontalCarouselBlockSave } from "./blocks/horizontal-carousel-block";
import { MultiImageBlockEdit, MultiImageBlockSave } from "./blocks/misc/multi-image-block";
import { DOMControllerBlockEdit, DOMControllerBlockSave } from "./blocks/dom-controller-block";
import { ImageCollageBlockEdit, ImageCollageBlockSave } from "./blocks/misc/image-collage-block";
import { ScreenshotCollageBlockEdit, ScreenshotCollageBlockSave } from "./blocks/misc/screenshot-collage-block";
import { PageHeaderBlockEdit, PageHeaderBlockSave } from "./blocks/misc/page-header-block";
import { FeaturedVideoBlockEdit, FeaturedVideoBlockSave } from "./blocks/misc/featured-video-block";
import { ChicagoFiresBlockEdit, ChicagoFiresBlockSave } from "./blocks/misc/chicago-fires-block";
import { registerAllBlocks } from "./scripts/register-blocks";
import { runAccumulators } from "./scripts/accumulators";

// so the "edit" component is a place where i can put fields that will be used to edit block attributes

// "save" is the component that will render on the front-end

// Scrolling Projects Block
registerBlockType("guten-csek/scrolling-projects-block", {
    title: "Csek Scrolling Projects Block",
    icon: "format-video",
    category: "media",
    attributes: {
        projects: {
            type: "array",
            default: [],
        },
    },
    edit: ScrollingProjectsBlockEdit,
    save: ScrollingProjectsBlockSave,
});

// Team Block
registerBlockType("guten-csek/team-block", {
    title: "Csek Team Block",
    icon: "admin-users",
    category: "text",
    attributes: {
        images: {
            type: "array",
            default: [],
        },
        title: {
            type: "string",
            default: "",
        },
        tagline: {
            type: "string",
            default: "",
        },
        copyText: {
            type: "string",
            default: "",
        },
        cta: {
            type: "string",
            default: "",
        },
        ctaLink: {
            type: "string",
            default: "",
        },
    },
    edit: TeamBlockEdit,
    save: TeamBlockSave,
});

// Video Carousel Block
registerBlockType("guten-csek/video-carousel-block", {
    title: "Csek Video Carousel Block",
    icon: "format-video",
    category: "media",
    attributes: {
        videos: {
            type: "array",
            default: [],
        },
    },
    edit: VideoCarouselBlockEdit,
    save: VideoCarouselBlockSave,
});

// Horizontal Carousel Block
registerBlockType("guten-csek/horizontal-carousel-block", {
    title: "Csek Horizontal Carousel Block",
    icon: "columns",
    category: "text",
    attributes: {
        titles: {
            type: "array",
            default: [],
        },
        statements: {
            type: "array",
            default: [],
        },
        numItems: {
            type: "number",
            default: 1,
        },
    },
    edit: HorizontalCarouselBlockEdit,
    save: HorizontalCarouselBlockSave,
});

/* Misc Blocks */

// DOM Controller Block
registerBlockType("guten-csek/dom-controller-block", {
    title: "Csek Script Manager Block",
    icon: "admin-settings",
    category: "text",
    attributes: {
        controllerScripts: {
            type: "array",
            default: [],
        },
        enabledScripts: {
            type: "array",
            default: [],
        },
    },
    edit: DOMControllerBlockEdit,
    save: () => null,
});

// Image Collage Block
registerBlockType("guten-csek/image-collage-block", {
    title: "Csek Image Collage Block",
    icon: "format-image",
    category: "media",
    attributes: {
        images: {
            type: "array",
            default: [],
        },
        imageAlts: {
            type: "array",
            default: [],
        },
        backgroundColor: {
            type: "string",
            default: "#000000",
        },
    },
    edit: ImageCollageBlockEdit,
    save: ImageCollageBlockSave,
});

// Screenshot Collage Block
registerBlockType("guten-csek/screenshot-collage-block", {
    title: "Csek Screenshot Collage Block",
    icon: "desktop",
    category: "media",
    attributes: {
        screenshots: {
            type: "array",
            default: [],
        },
        screenshotAlts: {
            type: "array",
            default: [],
        },
        backgroundColor: {
            type: "string",
            default: "#000000",
        },
        angleDegrees: {
            type: "number",
            default: 0,
        },
    },
    edit: ScreenshotCollageBlockEdit,
    save: ScreenshotCollageBlockSave,
});

// Featured Video Block
registerBlockType("guten-csek/featured-video-block", {
    title: "Csek Featured Video Block",
    icon: "format-video",
    category: "media",
    attributes: {
        videoURL: {
            type: "string",
            default: "",
        },
    },
    edit: FeaturedVideoBlockEdit,
    save: FeaturedVideoBlockSave,
});

// Chicago Fires Block
registerBlockType("guten-csek/chicago-fires-block", {
    title: "Csek Chicago Fires Block",
    icon: "text",
    category: "text",
    attributes: {
        primaryHeading: {
            type: "string",
            default: "",
        },
        secondaryHeadings: {
            type: "array",
            default: [],
        },
        primaryMessage: {
            type: "string",
            default: "",
        },
        secondaryMessages: {
            type: "array",
            default: [],
        },
    },
    edit: ChicagoFiresBlockEdit,
    save: ChicagoFiresBlockSave,
});

registerAllBlocks();

window.addEventListener("load", (e) => {
    console.log("[Csek Creative] Window loaded.");

    /* Prepare Accumulator Elements */
    runAccumulators();

    /* Prepare DOM Controller */
    window.domController = prepareBlockControllers();

    window.requestAnimationFrame(() => {
        window.domController.setup();
        window.domController.overrideAllDebug(false);
        // window.domController.debug = true;
        // window.domController.overrideDebug(true, "ProjectsMarqueeController");
        // window.domController.overrideDebug(true, "SrollingProjectsController");
        window.domController.overrideDebug(true, "ExpandingVideoController");
    });

    setTimeout(() => {
        // hide loading panel if DOM controller is not in use...
        if (!window.domController.isStarted || !window.domController) {
            window.domController.hideLoadingPanel();
        }
    }, 1000);
});
