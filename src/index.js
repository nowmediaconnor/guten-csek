/*
 * Created on Thu Aug 10 2023
 * Author: Connor Doman
 */

const { registerBlockType } = wp.blocks;

import { prepareBlockControllers } from "./domcontroller";

import { TaglineHeaderEdit, TaglineHeaderSave } from "./blocks/tagline-header-block";
import { ExpandingVideoBlockEdit, ExpandingVideoBlockSave } from "./blocks/expanding-video-block";
import { BlockquoteEdit, BlockquoteSave } from "./blocks/blockquote-block";
import { ScrollingProjectsBlockEdit, ScrollingProjectsBlockSave } from "./blocks/scrolling-projects-block";
import { TeamBlockEdit, TeamBlockSave } from "./blocks/team-block";
import { VideoCarouselBlockEdit, VideoCarouselBlockSave } from "./blocks/video-carousel-block";
import { HorizontalCarouselBlockEdit, HorizontalCarouselBlockSave } from "./blocks/horizontal-carousel-block";
import { ProjectSummaryBlockEdit, ProjectSummaryBlockSave } from "./blocks/misc/project-summary-block";
import { FeaturedImageBlockEdit, FeaturedImageBlockSave } from "./blocks/misc/featured-image-block";
import { MultiImageBlockEdit, MultiImageBlockSave } from "./blocks/misc/multi-image-block";
import { LeftRightBlockEdit, LeftRightBlockSave } from "./blocks/misc/left-right-block";
import { FullscreenImageBlockEdit, FullscreenImageBlockSave } from "./blocks/misc/fullscreen-image-block";
import { DOMControllerBlockEdit, DOMControllerBlockSave } from "./blocks/dom-controller-block";
import { ImageCollageBlockEdit, ImageCollageBlockSave } from "./blocks/misc/image-collage-block";
import { ScreenshotCollageBlockEdit, ScreenshotCollageBlockSave } from "./blocks/misc/screenshot-collage-block";
import { NextProjectBlockEdit, NextProjectBlockSave } from "./blocks/misc/next-project-block";
import { PageHeaderBlockEdit, PageHeaderBlockSave } from "./blocks/misc/page-header-block";
import { FeaturedVideoBlockEdit, FeaturedVideoBlockSave } from "./blocks/misc/featured-video-block";
import { ChicagoFiresBlockEdit, ChicagoFiresBlockSave } from "./blocks/misc/chicago-fires-block";
import { registerAllBlocks } from "./scripts/register-blocks";
import { runAccumulators } from "./scripts/accumulators";

// so the "edit" component is a place where i can put fields that will be used to edit block attributes

// "save" is the component that will render on the front-end

// Tagline Header Block
registerBlockType("guten-csek/tagline-header-block", {
    title: "Csek Tagline Header",
    icon: "text",
    category: "text",
    attributes: {
        preTagline: {
            type: "string",
            default: "Welcome to",
        },
        tagline: {
            type: "string",
            default: "The House of More.",
        },
        imageURL: {
            type: "string",
            default: "",
        },
    },
    edit: TaglineHeaderEdit,
    save: TaglineHeaderSave,
});

// Expanding Video Block
registerBlockType("guten-csek/expanding-video-block", {
    title: "Csek Expanding Video Block",
    icon: "format-video",
    category: "media",
    attributes: {
        videoURL: {
            type: "string",
            default: "",
        },
        images: {
            type: "array",
            default: [],
        },
        messageHeading: {
            type: "string",
            default: "",
        },
        message: {
            type: "string",
            default: "",
        },
    },
    edit: ExpandingVideoBlockEdit,
    save: ExpandingVideoBlockSave,
});

// Block Quote Block
registerBlockType("guten-csek/block-quote-block", {
    title: "Csek Block Quote Block",
    icon: "format-quote",
    category: "text",
    attributes: {
        heading: {
            type: "string",
            default: "",
        },
        quote: {
            type: "string",
            default: "",
        },
        author: {
            type: "string",
            default: "",
        },
        authorRole: {
            type: "string",
            default: "",
        },
    },
    edit: BlockquoteEdit,
    save: BlockquoteSave,
});

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

// Featured Image Block
registerBlockType("guten-csek/featured-image-block", {
    title: "Csek Featured Image Block",
    icon: "format-image",
    category: "media",
    attributes: {
        imageURL: {
            type: "string",
            default: "",
        },
        imageAlt: {
            type: "string",
            default: "",
        },
    },
    edit: FeaturedImageBlockEdit,
    save: FeaturedImageBlockSave,
});

// Multi Image Block
registerBlockType("guten-csek/multi-image-block", {
    title: "Csek Multi Image Block",
    icon: "format-image",
    category: "media",
    attributes: {
        images: {
            type: "array",
            default: [],
        },
        numberOfImages: {
            type: "string",
            default: "1",
        },
        title: {
            type: "string",
            default: "",
        },
        altTexts: {
            type: "array",
            default: [],
        },
    },
    edit: MultiImageBlockEdit,
    save: MultiImageBlockSave,
});

// Left-Right Block
registerBlockType("guten-csek/left-right-block", {
    title: "Csek Left-Right Block",
    icon: "columns",
    category: "text",
    attributes: {
        text: {
            type: "string",
            default: "",
        },
        image: {
            type: "string",
            default: "",
        },
        altText: {
            type: "string",
            default: "",
        },
        direction: {
            enum: ["left", "right"],
        },
    },
    edit: LeftRightBlockEdit,
    save: LeftRightBlockSave,
});

// Fullscreen Image Block
registerBlockType("guten-csek/fullscreen-image-block", {
    title: "Csek Fullscreen Image Block",
    icon: "format-image",
    category: "media",
    attributes: {
        imageURL: {
            type: "string",
            default: "",
        },
        imageAlt: {
            type: "string",
            default: "",
        },
    },
    edit: FullscreenImageBlockEdit,
    save: FullscreenImageBlockSave,
});

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

// Next Project Block
registerBlockType("guten-csek/next-project-block", {
    title: "Csek Next Project Block",
    icon: "text",
    category: "text",
    attributes: {
        projectTitle: {
            type: "string",
            default: "",
        },
        projectTagline: {
            type: "string",
            default: "",
        },
        projectImageURL: {
            type: "string",
            default: "",
        },
    },
    edit: NextProjectBlockEdit,
    save: NextProjectBlockSave,
});

// Page Header Block
registerBlockType("guten-csek/page-header-block", {
    title: "Csek Page Header Block",
    icon: "text",
    category: "text",
    attributes: {
        heading: {
            type: "string",
            default: "",
        },
        slogan: {
            type: "string",
            default: "",
        },
    },
    edit: PageHeaderBlockEdit,
    save: PageHeaderBlockSave,
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
    console.log("Window loaded.");
    console.log({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });

    /* Prepare Accumulator Elements */
    runAccumulators();

    /* Prepare DOM Controller */
    window.domController = prepareBlockControllers();

    window.requestAnimationFrame(() => {
        window.domController.setup();
        window.domController.overrideAllDebug(false);
        window.domController.overrideDebug(true, "FeaturedVideoController");
    });

    setTimeout(() => {
        // hide loading panel if DOM controller is not in use...
        if (!window.domController.isStarted) {
            window.domController.hideLoadingPanel();
        }
    }, 1000);
});
