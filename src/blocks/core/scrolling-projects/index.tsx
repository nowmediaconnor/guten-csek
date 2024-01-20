/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import React from "react";
import { registerBlockType } from "@wordpress/blocks";
import { ScrollingProjectsBlockEdit } from "./edit";
import { ScrollingProjectsBlockSave } from "./save";
import metadata from "./block.json";
import "./style.css";

export interface Project {
    name: string;
    link: string;
    imageUrl: string;
}

export interface ScrollingProjectsBlockAttributes {
    projects: Project[];
}

registerBlockType<ScrollingProjectsBlockAttributes>(metadata.name, {
    title: metadata.title,
    icon: metadata.icon,
    description: metadata.description,
    category: metadata.category,
    attributes: {
        projects: {
            type: "array",
            default: [],
        },
    },
    edit: ScrollingProjectsBlockEdit,
    save: ScrollingProjectsBlockSave,
});
