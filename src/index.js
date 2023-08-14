/*
 * Created on Thu Aug 10 2023
 * Author: Connor Doman
 */

const { registerBlockType } = wp.blocks;

import { map } from "./math";
import { VideoBlockEdit, VideoBlockSave } from "./blocks/video-block";
import { TaglineHeaderEdit, TaglineHeaderSave } from "./blocks/tagline-header-block";
import { ExpandingVideoBlockEdit, ExpandingVideoBlockSave } from "./blocks/expanding-video-block";
import { BlockQuoteEdit, BlockQuoteSave } from "./blocks/block-quote-block";

// so the "edit" component is a place where i can put fields that will be used to edit block attributes

// "save" is the component that will render on the front-end

// Video Block
registerBlockType("guten-csek/video-block", {
    title: "Video Block",
    icon: "format-video",
    category: "media",
    attributes: {
        videoURL: {
            type: "string",
            default: "https://www.youtube.com/embed/7Erbf5NXQQw",
        },
    },
    edit: VideoBlockEdit,
    save: VideoBlockSave,
});

// Tagline Header Block
registerBlockType("guten-csek/tagline-header-block", {
    title: "Tagline Header",
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
    title: "Expanding Video Block",
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
    title: "Block Quote Block",
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

const FLAGS = {
    DEBUG: true,
    taglineSroll: true,
};

const smoothScrollTo = (yPosition) => {
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
const prepareExpandingVideoBlocks = () => {
    // add scroll listener
    const expandingVideoBlocks = document.querySelectorAll(".wp-block-guten-csek-expanding-video-block");
    const elementsToFadeOnScroll = document.querySelectorAll(".scroll-fade-away");

    for (const videoBlock of expandingVideoBlocks) {
        const threshold = videoBlock.querySelector(".threshold");
        const video = videoBlock.querySelector(".expanding-video-container");

        window.addEventListener("scroll", () => {
            const blockRect = videoBlock.getBoundingClientRect();
            const thresholdRect = threshold.getBoundingClientRect();
            const thresholdTop = thresholdRect.top;
            if (parseInt(thresholdTop) <= 0 && FLAGS.taglineSroll && blockRect.bottom > 0) {
                video.classList.add("expanded");
                for (const element of elementsToFadeOnScroll) {
                    element.classList.add("hide");
                }
                FLAGS.taglineSroll = false;
                console.log("threshold reached");
            } else if (parseInt(thresholdTop) > 0 && !FLAGS.taglineSroll) {
                video.classList.remove("expanded");
                for (const element of elementsToFadeOnScroll) {
                    element.classList.remove("hide");
                }
                FLAGS.taglineSroll = true;
            }
        });
    }
};

// window load listener
window.addEventListener("load", (e) => {
    console.log("Window loaded.");
    console.log({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
    prepareExpandingVideoBlocks();
    new CircleType(document.getElementById("scroll-down"));
});
