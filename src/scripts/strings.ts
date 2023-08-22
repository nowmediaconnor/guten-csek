/*
 * Created on Mon Aug 21 2023
 * Author: Connor Doman
 */

export const pad = (n: number, digits: number, uses: string = "0"): string => {
    let str = n.toString();

    if (str.length >= digits) return str.slice(str.length - digits, digits);

    while (str.length < digits) {
        str = uses + str;
    }
    return str;
};
