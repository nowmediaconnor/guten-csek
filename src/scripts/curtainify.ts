/*
 * Created on Thu Aug 17 2023
 * Author: Connor Doman
 */

import { constrain, map } from "./math";
import { log } from "./global";

/**
 * curtainify.js
 *
 * This script is responsible for collecting all elements inside of a curtain-reel container and applying a split on scroll effect to them, like curtains being parted.
 * Each element to apply the effect to must have the classname "curtain" but can be placed anywhere inside the curtain-reel element.
 */

log("Curtainify.js");

const insertAfter = (newNode: Node, referenceNode: Node) => {
    if (!referenceNode.parentNode) return;
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

const makeIntoLeftCurtain = (elmt: Node) => {
    const leftCurtain = document.createElement("div");
    const leftCurtainContent = elmt.cloneNode(true);
    leftCurtain.classList.add("left-curtain");

    leftCurtain.appendChild(leftCurtainContent);
    return leftCurtain;
};

const makeIntoRightCurtain = (elmt: Node) => {
    const rightCurtain = document.createElement("div");
    const rightCurtainContent = elmt.cloneNode(true);
    rightCurtain.classList.add("right-curtain");

    rightCurtain.appendChild(rightCurtainContent);
    return rightCurtain;
};

const curtainify = (contentReel: HTMLElement, contentReelItems: NodeList) => {
    contentReel.innerHTML = "";

    contentReelItems.forEach((item: Node, index) => {
        const left = makeIntoLeftCurtain(item);
        const right = makeIntoRightCurtain(item);
        const zIndex = contentReelItems.length - index;

        // if this block contains a video, force them to syncrhonize
        const leftVideo = left.querySelector("video");
        const rightVideo = right.querySelector("video");
        const threshold = 0.1;

        if (leftVideo && rightVideo) {
            leftVideo.addEventListener("timeupdate", () => {
                if (Math.abs(leftVideo.currentTime - rightVideo.currentTime) > threshold)
                    rightVideo.currentTime = leftVideo.currentTime;
            });
            rightVideo.addEventListener("timeupdate", () => {
                if (Math.abs(rightVideo.currentTime - leftVideo.currentTime) > threshold)
                    leftVideo.currentTime = rightVideo.currentTime;
            });
        }

        left.style.zIndex = zIndex.toString();
        right.style.zIndex = zIndex.toString();
        contentReel.appendChild(left);
        contentReel.appendChild(right);
    });
};

export const prepareCurtainElements = () => {
    const contentReel = document.querySelector(".curtain-reel") as HTMLElement;
    const contentReelItems = document.querySelectorAll(".curtain");

    if (!contentReel) return;

    curtainify(contentReel, contentReelItems);

    // curtainify all curtain elements

    // prepare metrics for content reel
    const contentReelContents = document.querySelectorAll(".curtain-reel > *");
    const heights: number[] = [];
    for (let i = 0; i < contentReelContents.length; i++) {
        heights.push(contentReelContents[i].getBoundingClientRect().height);
    }
    const contentReelHeight = heights.reduce((partialSum, a) => partialSum + a, 0) / 2; // divide by 2 because we have 2 of each element

    const contentReelFirstChild = contentReel.firstChild as HTMLElement;

    if (!contentReelFirstChild) return;

    const contentReelFirstChildRect = contentReelFirstChild.getBoundingClientRect();
    const contentReelTop = contentReelFirstChildRect.top;
    const contentReelBottom = contentReelFirstChildRect.bottom;

    // add scrollable mass of content to below content reel
    const contentReelScrollMass = document.createElement("div");
    contentReelScrollMass.setAttribute("id", "curtain-reel-scroll-mass");
    contentReelScrollMass.classList.add("guten-csek-block");
    contentReelScrollMass.style.zIndex = "-1";
    contentReelScrollMass.style.height = `${contentReelHeight}px`;
    contentReelScrollMass.style.backgroundColor = "#131313";
    insertAfter(contentReelScrollMass, contentReel);
    if (window.scrollY > contentReelTop) {
        window.scrollTo(0, window.scrollY - contentReelHeight);
    }

    // split curtains
    const leftCurtains = document.querySelectorAll(".left-curtain");
    const rightCurtains = document.querySelectorAll(".right-curtain");

    const shadowBlock = document.createElement("div");
    shadowBlock.classList.add("shadow-block");
    shadowBlock.style.zIndex = (contentReelContents.length + 1).toString();

    contentReel.appendChild(shadowBlock);

    const splitCurtains = (index = 0) => {
        const scrollPosition = window.scrollY;
        const scrollPositionFromTop = scrollPosition - contentReelTop - window.innerHeight * index;
        // log(
        //     JSON.stringify(
        //         {
        //             scrollPosition,
        //             scrollY: window.scrollY,
        //             contentReelTop,
        //             windowInnerHeight: window.innerHeight,
        //             index,
        //         },
        //         null,
        //         4
        //     )
        // );

        const scrollPercentage = Math.floor(constrain(scrollPositionFromTop / window.innerHeight, 0, 1) * 100) / 100;

        // log(
        //     JSON.stringify(
        //         {
        //             contentReelHeight,
        //             scrollPosition,
        //             scrollPositionFromTop,
        //             scrollPercentage,
        //             contentReelTop,
        //             contentReelBottom,
        //             vh: window.innerHeight,
        //             index,
        //         },
        //         null,
        //         4
        //     )
        // );

        // effects for underlying card
        if (index < leftCurtains.length - 1) {
            const previousLeft = leftCurtains[index + 1] as HTMLElement;
            const previousRight = rightCurtains[index + 1] as HTMLElement;
            const zHeight = map(scrollPercentage, 0, 1, -0.125, 0);

            previousLeft.style.transform = `translateZ(${zHeight}rem)`;
            previousRight.style.transform = `translateZ(${zHeight}rem)`;

            const contentBlock = previousLeft.querySelector(".content-block") as HTMLElement;
            if (contentBlock) {
                const color = window.getComputedStyle(contentBlock).getPropertyValue("background-color");

                const scrollMass = document.getElementById("curtain-reel-scroll-mass");
                if (scrollMass) {
                    scrollMass.style.backgroundColor = color;
                    // log({ color });
                }
            }
        }

        const left = leftCurtains[index] as HTMLElement;
        const right = rightCurtains[index] as HTMLElement;

        left.style.transform = `translateX(-${scrollPercentage * 100}%)`;
        right.style.transform = `translateX(${scrollPercentage * 100}%)`;

        shadowBlock.style.width = `${scrollPercentage * 100}%`;
        shadowBlock.style.background = `radial-gradient(transparent 40%, rgba(0,0,0,${map(
            scrollPercentage,
            0,
            1,
            0.5,
            0
        )}) 98%)`;

        return scrollPercentage;
    };

    let lastScroll = window.scrollY;
    let currentIndex = constrain(
        Math.floor(((lastScroll - contentReelTop) / contentReelHeight) * (contentReelContents.length / 2)),
        0,
        contentReelContents.length / 2 - 1
    );

    const adjustBasedOnScroll = (scroll: number) => {
        const scrollDirection = Math.floor(constrain(window.scrollY - lastScroll, -1, 1));
        lastScroll = window.scrollY;
        // log("scroll position:", window.scrollY, "scroll direction:", scrollDirection);

        if (scroll === 1 && scrollDirection === 1) {
            currentIndex++;
        } else if (scroll === 0 && scrollDirection === -1) {
            currentIndex--;
        }
        currentIndex = constrain(currentIndex, 0, leftCurtains.length - 1);

        if (currentIndex === leftCurtains.length) {
            shadowBlock.style.visibility = "hidden";
        }
    };

    window.addEventListener("scroll", (e) => {
        const scroll = splitCurtains(currentIndex);
        adjustBasedOnScroll(scroll);
    });

    const initializeTranslations = (currentIndex: number) => {
        for (let i = 0; i < currentIndex; i++) {
            const left = leftCurtains[i] as HTMLElement;
            const right = rightCurtains[i] as HTMLElement;
            left.style.transform = `translateX(-100%)`;
            right.style.transform = `translateX(100%)`;
        }
    };

    const scrollInitital = splitCurtains(currentIndex);
    adjustBasedOnScroll(scrollInitital);
    initializeTranslations(currentIndex);
};
