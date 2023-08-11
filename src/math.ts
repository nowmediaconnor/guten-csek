/*
 * Created on Fri Aug 11 2023
 * Author: Connor Doman
 */

export const constrain = (n: number, low: number, high: number): number => {
    return Math.max(Math.min(n, high), low);
};

export const map = (n: number, start1: number, stop1: number, start2: number, stop2: number, withinBounds: number) => {
    const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    if (!withinBounds) {
        return newval;
    }
    if (start2 < stop2) {
        return constrain(newval, start2, stop2);
    } else {
        return constrain(newval, stop2, start2);
    }
};
