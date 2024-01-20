/*
 * Created on Tue Aug 15 2023
 * Author: Connor Doman
 */

import { randomIntInRange } from "./math";

export const shuffle = (array: any[]) => {
    let currentIndex = array.length;
    let randomIndex = 0;

    const newArray = [...array];

    while (currentIndex !== 0) {
        randomIndex = randomIntInRange(0, currentIndex);
        currentIndex--;

        [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
    }

    return newArray;
};

export const randomElement = (array: any[]) => {
    return array[randomIntInRange(0, array.length)];
};

export const arrayMax = (array: number[]) => {
    return Math.max(...array);
};

export const arrayMin = (array: number[]) => {
    return Math.min(...array);
};
