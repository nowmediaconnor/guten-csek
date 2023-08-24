/*
 * Created on Mon Aug 21 2023
 * Author: Connor Doman
 */

import { shuffle } from "./array";
import { clampInt, randomIntInRange, randomPartOfOne } from "./math";

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
