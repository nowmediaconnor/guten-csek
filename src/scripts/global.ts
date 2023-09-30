/*
 * Created on Sat Sep 30 2023
 * Author: Connor Doman
 */

import { getImageColor } from "./files";

export async function updateFeaturedImageColorDerivatives(): Promise<boolean> {
    // step 1: get color from featured image
    const featuredImage = document.getElementById("featured-image") as HTMLImageElement;
    if (!featuredImage || !featuredImage.src) {
        return false;
    }
    const featuredImageColor = await getImageColor(featuredImage.src); // rgb(r, g, b)

    // step 2: set all elements with class .featured-image-color to that color
    const featuredImageColorElements: NodeListOf<HTMLElement> = document.querySelectorAll(".featured-image-color");
    if (!featuredImageColorElements || featuredImageColorElements.length === 0) {
        return false;
    }

    featuredImageColorElements.forEach((element: HTMLElement) => {
        element.style.backgroundColor = featuredImageColor;
    });

    return true;
}
