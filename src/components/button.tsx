/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import React, { useState } from "react";
import { Button, IconType } from "@wordpress/components";
import { twMerge } from "tailwind-merge";

interface CsekButtonProps {
    label?: string;
    className?: string;
    icon?: IconType;
    onClick?: () => void;
}

export const CsekButton = ({ label, className, icon, onClick }: CsekButtonProps) => {
    return (
        <Button
            onClick={onClick}
            icon={icon}
            className={twMerge(
                "border border-solid py-2 px-4 min-w-[5rem] border-box rounded overflow-hidden border-white hover:none hover:text-slate-300 hover:backdrop-brightness-75 max-w-max",
                className
            )}>
            {label}
        </Button>
    );
};

interface CsekAddButtonProps extends CsekButtonProps {
    onAdd: () => void;
}

export const CsekAddButton = ({ label = "Add", className, onAdd }: CsekAddButtonProps) => {
    return (
        <CsekButton label={label} icon="plus" onClick={onAdd} className={twMerge("text-white bg-sky-700", className)} />
    );
};

interface CsekDeleteButtonProps extends CsekButtonProps {
    onDelete: () => void;
}

export const CsekDeleteButton = ({ label = "Delete", className, onDelete }: CsekDeleteButtonProps) => {
    return (
        <CsekButton
            label={label}
            icon="trash"
            onClick={onDelete}
            className={twMerge("bg-red-600 text-white", className)}
        />
    );
};

export const CloseButton = () => {
    return (
        <button className="close-button">
            <div className="cross"></div>
        </button>
    );
};
