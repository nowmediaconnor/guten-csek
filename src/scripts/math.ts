/*
 * Created on Fri Aug 11 2023
 * Author: Connor Doman
 */

export const constrain = (n: number, low: number, high: number): number => {
    return Math.max(Math.min(n, high), low);
};

export const map = (n: number, start1: number, stop1: number, start2: number, stop2: number) => {
    const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    if (start2 < stop2) {
        return constrain(newval, start2, stop2);
    } else {
        return constrain(newval, stop2, start2);
    }
};

export const randomInRange = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
};

export const randomIntInRange = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomPartOfOne = (): number => {
    return Math.random() * 2 - 1;
};

export const clampInt = (n: number, min: number, max: number): number => {
    n = parseInt(n.toString());
    return Math.min(Math.max(n, min), max);
};

export const cyrb128 = (str: string) => {
    let h1 = 1779033703,
        h2 = 3144134277,
        h3 = 1013904242,
        h4 = 2773480762;
    for (let i = 0, k = 0; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    (h1 ^= h2 ^ h3 ^ h4), (h2 ^= h1), (h3 ^= h1), (h4 ^= h1);
    return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
};
