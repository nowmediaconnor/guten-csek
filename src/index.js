/*
 * Created on Thu Aug 10 2023
 * Author: Connor Doman
 */

const { registerBlockType } = wp.blocks;

import { map } from "./math";
import { VideoBlockEdit, VideoBlockSave } from "./blocks/video-block";
import { TaglineHeaderEdit, TaglineHeaderSave } from "./blocks/tagline-header-block";
import { ExpandingVideoBlockEdit, ExpandingVideoBlockSave } from "./blocks/expanding-video-block";

// so the "edit" component is a place where i can put fields that will be used to edit block attributes

// "save" is the component that will render on the front-end

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

// add front end event listeners and actions

// code for disabling scrolling
// https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
const preventDefault = (e) => {
    e.preventDefault();
};
const preventDefaultForSroll = (e) => {
    if (keys[e.keycode]) {
        preventDefault(e);
        return false;
    }
};
let supportsPassive = false;
try {
    window.addEventListener(
        "test",
        null,
        Object.defineProperty({}, "passive", {
            get: function () {
                supportsPassive = true;
            },
        })
    );
} catch (e) {}
const wheelOpt = supportsPassive ? { passive: false } : false;
const wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
const disableScroll = () => {
    window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
    window.addEventListener("keydown", preventDefaultForSroll, false);
};
const enableScroll = () => {
    window.removeEventListener("DOMMouseScroll", preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener("touchmove", preventDefault, wheelOpt);
    window.removeEventListener("keydown", preventDefaultForSroll, false);
};

// code for expanding video blocks
const prepareExpandingVideoBlocks = () => {
    const videoBlocks = document.querySelectorAll(".expanding-video-container");
    const pageWidth = document.body.clientWidth;
    const pageHeight = window.innerHeight;

    console.log(videoBlocks.length + " video blocks found.");

    // store initial width of every block
    videoBlocks.forEach((videoBlock) => {
        const rect = videoBlock.getBoundingClientRect();
        videoBlock.setAttribute("data-initial-width", rect.width);
        videoBlock.setAttribute("data-initial-height", rect.top);
    });

    // add scroll listener
    window.addEventListener("scroll", () => {
        videoBlocks.forEach((videoBlock) => {
            const rect = videoBlock.getBoundingClientRect();
            const integerTop = Math.floor(rect.top);
            const initialWidth = parseInt(videoBlock.getAttribute("data-initial-width"));
            const initialTop = parseInt(videoBlock.getAttribute("data-initial-height"));
            const topToHeightRatio = (initialTop - integerTop) / initialTop;
            // const initialWidth = 0;
            // const newWidth = (pageWidth - initialWidth) * topToHeightRatio;
            const newWidth = map(topToHeightRatio, 0, 1, initialWidth, pageWidth, true);

            // expand the block
            videoBlock.style.width = newWidth + "px";

            console.log(
                JSON.stringify(
                    {
                        top: rect.top,
                        bottom: rect.bottom,
                        height: rect.height,
                        pageWidth,
                        pageHeight,
                        topToHeightRatio,
                        initialWidth,
                        newWidth,
                        videoBlockWidth: videoBlock.style.width,
                    },
                    null,
                    4
                )
            );

            // stop scrolling if the block hasn't expanded yet
            if (integerTop <= 0) {
                console.log("stop scrolling");
                window.scrollTo(window.scrollX, window.scrollY + integerTop);
                // disableScroll();
            } else {
                // enableScroll();
            }
        });
    });
};

// window load listener
window.addEventListener("load", (e) => {
    console.log("Window loaded.");
    console.log({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
    prepareExpandingVideoBlocks();
});
