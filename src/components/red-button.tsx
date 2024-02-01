/*
 * Created on Thu Jan 25 2024
 * Author: Connor Doman
 */

import React from "react";
import { twMerge } from "tailwind-merge";

interface RedButtonProps {
    text: string;
    link: string;
    style?: React.CSSProperties;
    className?: string;
    ping?: boolean;
}

export const RedButton = ({ text, link, style, className, ping }: RedButtonProps) => {
    return (
        <a href={link} className={className} style={style}>
            <div
                className={twMerge(
                    "w-36 h-36 md:w-32 md:h-32 rounded-full bg-csek-red flex flex-row items-center justify-center text-white uppercase font-extrabold text-xs -rotate-[30deg] font-montserrat relative",
                    ping ? "animate-ping" : ""
                )}>
                <span className="absolute">{text}</span>
            </div>
        </a>
    );
};
