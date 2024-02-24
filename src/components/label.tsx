/*
 * Created on Mon Oct 23 2023
 * Author: Connor Doman
 */

import React from "react";
import { twMerge } from "tailwind-merge";

interface LabelProps {
    em?: boolean;
    className?: string;
    children: React.ReactNode;
}

export const Label = ({ em = false, className, children }: LabelProps) => {
    if (em) {
        return <em className={twMerge("em-label", className)}>{children}</em>;
    } else {
        return <span className={twMerge("em-label", className)}>{children}</span>;
    }
};

export const Danger = ({ className, children }: LabelProps) => {
    return <Label className={twMerge("text-red-500", className)}>{children}</Label>;
};

export const PaddingLabel = () => {
    return (
        <Label>
            You can edit this component&apos;s padding or margin in the inspector <i className="fa fa-arrow-right"></i>
        </Label>
    );
};

export default Label;
