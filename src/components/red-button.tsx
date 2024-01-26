/*
 * Created on Thu Jan 25 2024
 * Author: Connor Doman
 */

import React from "react";

interface RedButtonProps {
    text: string;
    link: string;
    style?: React.CSSProperties;
    className?: string;
}

export const RedButton = ({ text, link, style, className }: RedButtonProps) => {
    return (
        <a href={link} className={className} style={style}>
            <div className="w-36 h-36 md:w-32 md:h-32 rounded-full bg-csek-red flex flex-row items-center justify-center text-white uppercase font-extrabold text-xs -rotate-[30deg] font-montserrat relative">
                <span className="absolute">{text}</span>
            </div>
        </a>
    );
};
