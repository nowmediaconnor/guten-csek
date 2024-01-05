/*
 * Created on Mon Sep 25 2023
 * Author: Connor Doman
 */

import React from "react";
import { twMerge } from "tailwind-merge";

interface HeadingProps {
    level: "1" | "2" | "3" | "4" | "5" | "6";
    text?: string;
    className?: string;
    children?: React.ReactNode;
}

export const Heading = ({ level, text, className, children }: HeadingProps) => {
    const content = children ? children : text ? text : null;
    const commonClasses = "font-bold m-0 p-0 w-full";

    switch (level) {
        case "6":
            return <h6 className={twMerge(commonClasses, "", className)}>{content}</h6>;
        case "5":
            return <h5 className={twMerge(commonClasses, "", className)}>{content}</h5>;
        case "4":
            return <h4 className={twMerge(commonClasses, "", className)}>{content}</h4>;
        case "3":
            return <h3 className={twMerge(commonClasses, "", className)}>{content}</h3>;
        case "2":
            return <h2 className={twMerge(commonClasses, "", className)}>{content}</h2>;
        default:
            return <h1 className={twMerge(commonClasses, "underline", className)}>{content}</h1>;
    }
};

interface CsekBlockHeadingProps {
    text?: string;
    className?: string;
    children?: React.ReactNode;
}

export const CsekBlockHeading = ({ text, className, children }: CsekBlockHeadingProps) => {
    return (
        <Heading
            level="2"
            children={children}
            text={text}
            className={twMerge("border-b border-solid border-black pb-px my-2 text-3xl font-syne", className)}
        />
    );
};
