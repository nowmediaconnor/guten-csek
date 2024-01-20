/*
 * Created on Sat Oct 21 2023
 * Author: Connor Doman
 */

import React from "react";

interface LinkProps {
    href: string;
    className?: string;
    children?: React.ReactNode;
}

export const Link = ({ href, className, children }: LinkProps) => {
    return (
        <a href={href} className={className}>
            {children}
        </a>
    );
};

export const OutboundLink = ({ href, className, children }: LinkProps) => {
    return (
        <a href={href} className={className} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    );
};
