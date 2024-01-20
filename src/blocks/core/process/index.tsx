/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import React from "react";
import { registerBlockType } from "@wordpress/blocks";
import { ProcessBlockEdit } from "./edit";
import { ProcessBlockSave } from "./save";
import metadata from "./block.json";
import "./style.css";

export interface ProcessStep {
    title: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
}

export interface ProcessBlock {
    block: HTMLElement;
    steps: ProcessStep[];
    processImage: HTMLImageElement;
    processTitle: HTMLElement;
    stepObservers?: IntersectionObserver[];
}

export interface ProcessBlockAttributes {
    steps: ProcessStep[];
}

registerBlockType<ProcessBlockAttributes>(metadata.name, {
    title: metadata.title,
    icon: metadata.icon,
    description: metadata.description,
    category: metadata.category,
    attributes: {
        steps: {
            type: "array",
            default: [],
        },
    },
    edit: ProcessBlockEdit,
    save: ProcessBlockSave,
});
