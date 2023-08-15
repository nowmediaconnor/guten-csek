/*
 * Created on Thu Aug 10 2023
 * Author: Connor Doman
 */

const { registerBlockType } = wp.blocks;

import { shuffle } from "./array";
import { map, randomIntInRange, randomPartOfOne } from "./math";
import { TaglineHeaderEdit, TaglineHeaderSave } from "./blocks/tagline-header-block";
import { ExpandingVideoBlockEdit, ExpandingVideoBlockSave } from "./blocks/expanding-video-block";
import { BlockQuoteEdit, BlockQuoteSave } from "./blocks/block-quote-block";
import { ScrollingProjectsBlockEdit, ScrollingProjectsBlockSave } from "./blocks/scrolling-projects-block";

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
                document.body.style.backgroundColor = "#131313";
                FLAGS.taglineSroll = false;
                console.log("threshold reached");
            } else if (parseInt(thresholdTop) > 0 && !FLAGS.taglineSroll) {
                video.classList.remove("expanded");
                for (const element of elementsToFadeOnScroll) {
                    element.classList.remove("hide");
                }
                document.body.style.backgroundColor = "transparent";
                FLAGS.taglineSroll = true;
            }
        });

        const floatingImages = videoBlock.querySelectorAll(".floating-image");
        for (const image of floatingImages) {
            const randomDelay = randomIntInRange(0, 1000);
            const randomDuration = randomIntInRange(1000, 3000);
            const randomXDisplacement = randomPartOfOne();

            image.style.animationDelay = `${-randomDelay}ms`;
            image.style.animationDuration = `${randomDuration}ms`;
            if (Math.random() > 0.5) {
                image.style.left = `${randomXDisplacement}rem`;
            } else {
                image.style.right = `${randomXDisplacement}rem`;
            }

            console.log({ randomDelay, randomDuration, randomXDisplacement });
        }
    }
};

const prepareScrollingProjectsBlocks = () => {
    const scrollingProjectsBlocks = document.querySelectorAll(".wp-block-guten-csek-scrolling-projects-block");
    for (const block of scrollingProjectsBlocks) {
        const containers = block.querySelectorAll(".project-ribbon");

        let ribbonRow = 0;

        for (const ribbon of containers) {
            const evenRow = ribbonRow % 2 === 0;

            if (!evenRow) {
                ribbon.classList.add("reverse");
            }

            const speed = randomIntInRange(1, 3) * 0.125 * (evenRow ? 1 : -1);

            const containerRect = ribbon.getBoundingClientRect();
            const containerSide = containerRect.left;
            const list = ribbon.querySelector("ul");
            const items = shuffle(list.querySelectorAll("li"));

            console.log({ items });
            list.innerHTML = "";
            for (const item of items) {
                if (!item) continue;

                console.log(typeof item);
                list.appendChild(item);
                const dash = document.createElement("li");
                dash.innerHTML = "&nbsp;&mdash;&nbsp;";
                list.appendChild(dash);
            }

            let currentLeftValue = 0;

            const animateMarquee = () => {
                const firstListItem = list.querySelector("li:first-child");
                const firstListItemRect = firstListItem.getBoundingClientRect();
                const firstListItemSide = firstListItemRect.right;

                if (firstListItemSide < containerSide) {
                    currentLeftValue = -1;
                    list.appendChild(firstListItem);
                }

                list.style.marginLeft = `${currentLeftValue}px`;
                currentLeftValue -= speed;
            };

            window.setInterval(animateMarquee, 12.5);
            ribbonRow++;
        }
    }
};

// window load listener
window.addEventListener("load", (e) => {
    console.log("Window loaded.");
    console.log({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
    prepareExpandingVideoBlocks();
    prepareScrollingProjectsBlocks();
    new CircleType(document.getElementById("scroll-down"));
});
