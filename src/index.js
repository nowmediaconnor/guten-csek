/*
 * Created on Thu Aug 10 2023
 * Author: Connor Doman
 */

const { registerBlockType } = wp.blocks;

import DOMController from "./scripts/dom";
import { TaglineHeaderEdit, TaglineHeaderSave } from "./blocks/tagline-header-block";
import { ExpandingVideoBlockEdit, ExpandingVideoBlockSave } from "./blocks/expanding-video-block";
import { BlockQuoteEdit, BlockQuoteSave } from "./blocks/block-quote-block";
import { ScrollingProjectsBlockEdit, ScrollingProjectsBlockSave } from "./blocks/scrolling-projects-block";
import { TeamBlockEdit, TeamBlockSave } from "./blocks/team-block";
import { VideoCarouselBlockEdit, VideoCarouselBlockSave } from "./blocks/video-carousel-block";
import { HorizontalCarouselBlockEdit, HorizontalCarouselBlockSave } from "./blocks/horizontal-carousel-block";

import ScrollDownController from "./scripts/controllers/scroll-down-controller";
import CarouselController from "./scripts/controllers/carousel-controller";
import VideoCarouselController from "./scripts/controllers/video-carousel-controller";
import ExpandingVideoController from "./scripts/controllers/expanding-video-controller";
import ScrollingProjectsController from "./scripts/controllers/scrolling-projects-controller";
import CurtainifyController from "./scripts/controllers/curtainify-controller";
import TeamController from "./scripts/controllers/team-controller";
import { ProjectSummaryBlockEdit, ProjectSummaryBlockSave } from "./blocks/misc/project-summary-block";
import { FeaturedImageBlockEdit, FeaturedImageBlockSave } from "./blocks/misc/featured-image-block";
import { MultiImageBlockEdit, MultiImageBlockSave } from "./blocks/misc/multi-image-block";
import { LeftRightBlockEdit, LeftRightBlockSave } from "./blocks/misc/left-right-block";
import { FullscreenImageBlockEdit, FullscreenImageBlockSave } from "./blocks/misc/fullscreen-image-block";
import { DOMControllerBlockEdit, DOMControllerBlockSave } from "./blocks/dom-controller-block";
import { ImageCollageBlockEdit, ImageCollageBlockSave } from "./blocks/misc/image-collage-block";

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
    edit: BlockQuoteEdit,
    save: BlockQuoteSave,
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

// Masthead Block
registerBlockType("guten-csek/project-summary-block", {
    title: "Csek Project Summary Block",
    icon: "text",
    category: "layout",
    attributes: {
        backgroundColor: {
            type: "string",
            default: "000000",
        },
        projectTagline: {
            type: "string",
            default: "",
        },
        projectSummary: {
            type: "string",
            default: "",
        },
        taggedServices: {
            type: "array",
            default: [],
        },
        websiteLink: {
            type: "string",
            default: "",
        },
    },
    edit: ProjectSummaryBlockEdit,
    save: ProjectSummaryBlockSave,
});

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

window.addEventListener("load", () => {
    /* Prepare DOM Controller */

    // First, prepare curtain elements
    const curtainifyController = new CurtainifyController();
    // prepareCurtainElements();

    // "Scroll Down" controller
    const scrollController = new ScrollDownController("scroll-down", ".scroll-down-target");
    // Scrolling carousel
    const carouselController = new CarouselController(".wp-block-guten-csek-horizontal-carousel-block");
    // Video carousel
    const videoCarouselController = new VideoCarouselController(".wp-block-guten-csek-video-carousel-block");
    // Scrolling projects block
    const scrollingProjectsController = new ScrollingProjectsController(
        ".wp-block-guten-csek-scrolling-projects-block"
    );
    // Expanding video controller
    const expandingVideoController = new ExpandingVideoController(".expanding-video-container");

    // Team Block Controller
    const teamController = new TeamController(".wp-block-guten-csek-team-block");

    // Vertical Scrolling Images Controller
    // const verticalImagesController = new VerticalScrollingImagesController(
    //     ".vertical-scroll-container",
    //     ".vertical-scroll-grid"
    // );

    // DOM controller
    window.domController = new DOMController(
        curtainifyController,
        scrollController,
        carouselController,
        videoCarouselController,
        scrollingProjectsController,
        expandingVideoController
        // verticalImagesController
        // teamController
    );
    setTimeout(() => {
        // hide loading panel if DOM controller is not in use...
        if (!window.domController.isStarted) {
            window.domController.hideLoadingPanel();
        }
    }, 1000);
});
