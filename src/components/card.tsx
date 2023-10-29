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

export const CsekCard = ({ children, className }: CsekCardProps) => {
    return <div className={twMerge("csek-card", className)}>{children}</div>;
};

export default CsekCard;
