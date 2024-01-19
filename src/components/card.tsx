/*
 * Created on Sat Oct 28 2023
 * Author: Connor Doman
 */

import React from "react";
import { twMerge } from "tailwind-merge";

interface CsekCardProps {
    className?: string;
    children?: React.ReactNode;
}

export const csekCardTailwindStyles = "border border-solid border-zinc-500 rounded p-2 relative w-full";

export const CsekCard = ({ children, className }: CsekCardProps) => {
    return <div className={twMerge(csekCardTailwindStyles, className)}>{children}</div>;
};

export default CsekCard;
