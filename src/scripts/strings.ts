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

export const urlExtractSecondLevelDomain = (url: string): string => {
    // Remove the protocol (e.g., http:// or https://)
    const strippedUrl = url.replace(/(^\w+:|^)\/\//, "");

    // Split the remaining URL by slashes to get the domain parts
    const parts = strippedUrl.split("/");

    // Extract the first part (the domain)
    const domain = parts[0];

    // Split the domain by dots to get its components
    const domainComponents = domain.split(".");

    // Check if the domain has at least two components
    if (domainComponents.length >= 2) {
        // The SLD is the second-to-last component
        return domainComponents[domainComponents.length - 2];
    } else {
        // The URL doesn't have a valid domain with an SLD
        return "";
    }
};
