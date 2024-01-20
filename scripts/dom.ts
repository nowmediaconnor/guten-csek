/*
 * Created on Mon Aug 21 2023
 * Author: Connor Doman
 */

import { getImageColor } from "./files";
import { error, log } from "../src/js/guten-csek";
import { randomIntInRange, randomPartOfOne } from "./math";

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

export async function updateFeaturedImageColorDerivatives(): Promise<boolean> {
    // step 2: set all elements with class .featured-image-color to that color
    const featuredImageColorElements: NodeListOf<HTMLElement> = document.querySelectorAll(".featured-image-color");
    if (!featuredImageColorElements || featuredImageColorElements.length === 0) {
        return false;
    }

    featuredImageColorElements.forEach((element: HTMLElement) => {
        element.classList.add("skeleton");
    });

    // step 1: get color from featured image
    const featuredImage = document.getElementById("featured-image") as HTMLImageElement;
    if (!featuredImage || !featuredImage.src) {
        return false;
    }
    const featuredImageColor = await getImageColor(featuredImage.src); // rgb(r, g, b)

    featuredImageColorElements.forEach((element: HTMLElement) => {
        element.style.backgroundColor = featuredImageColor;
        element.classList.remove("skeleton");
    });

    return true;
}
