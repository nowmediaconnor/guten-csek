/*
 * Created on Thu Aug 10 2023
 * Author: Connor Doman
 */

const { registerBlockType } = wp.blocks;

import { shuffle } from "./scripts/array";
import { randomIntInRange, randomPartOfOne, clampInt } from "./scripts/math";
import { TaglineHeaderEdit, TaglineHeaderSave } from "./blocks/tagline-header-block";
import { ExpandingVideoBlockEdit, ExpandingVideoBlockSave } from "./blocks/expanding-video-block";
import { BlockQuoteEdit, BlockQuoteSave } from "./blocks/block-quote-block";
import { ScrollingProjectsBlockEdit, ScrollingProjectsBlockSave } from "./blocks/scrolling-projects-block";
import { TeamBlockEdit, TeamBlockSave } from "./blocks/team-block";
import { VideoCarouselBlockEdit, VideoCarouselBlockSave } from "./blocks/video-carousel-block";
import { HorizontalCarouselBlockEdit, HorizontalCarouselBlockSave } from "./blocks/horizontal-carousel-block";
import { prepareCurtainElements } from "./scripts/curtainify";
import { prepareScrollingProjectsBlocks, prepareExpandingVideoBlocks } from "./scripts/dom";

import ScrollDownController from "./scripts/scroll-down-controller";
import CarouselController from "./scripts/carousel-controller";
import VideoCarouselController from "./scripts/video-carousel-controller";
import ExpandingVideoController from "./scripts/expanding-video-controller";
import ScrollingProjectsController from "./scripts/scrolling-projects-controller";

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

// window load listener
window.addEventListener("load", (e) => {
    console.log("Window loaded.");
    console.log({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
    // Video block expands on scroll
    prepareExpandingVideoBlocks();
    // Curtainify
    window.requestAnimationFrame(() => {
        prepareCurtainElements();
        new ExpandingVideoController(".expanding-video-container");
    });
    // Expanding video controller
    // "Scroll Down" controller
    new ScrollDownController("scroll-down", ".wp-block-guten-csek-tagline-header-block");
    // Scrolling carousel
    new CarouselController(".wp-block-guten-csek-horizontal-carousel-block");
    // Video carousel
    new VideoCarouselController(".wp-block-guten-csek-video-carousel-block");
    // Circular "scroll down" text
    new CircleType(document.getElementById("scroll-down"));
    // Scrolling projects block
    // prepareScrollingProjectsBlocks();
    new ScrollingProjectsController(".wp-block-guten-csek-scrolling-projects-block");
});
