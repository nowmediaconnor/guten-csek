/*
 * Created on Wed Jan 31 2024
 * Author: Connor Doman
 */

import { twMerge } from "tailwind-merge";

interface VerticalBarProps {
    width?: string | number;
    height?: string | number;
    className?: string;
}

export const VerticalBar = ({ width, height, className }: VerticalBarProps) => {
    let computedWidth = width;
    if (typeof width === "number") {
        computedWidth = `${width}px`;
    }

    let computedHeight = height;
    if (typeof height === "number") {
        computedHeight = `${height}px`;
    }

    const computedStyle = {
        width: computedWidth ?? "initial",
        height: computedHeight ?? "initial",
    };

    return <div className={twMerge("w-px relative border-l border-zinc-600 self-stretch", className)}></div>;
};
