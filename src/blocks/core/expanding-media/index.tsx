/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import React from "react";
import { registerBlockType } from "@wordpress/blocks";
import { ExpandingMediaBlockEdit } from "./edit";
import { ExpandingMediaBlockSave } from "./save";
import metadata from "./block.json";
import "./style.css";
import { registerAllBlocks } from "../../../js/scripts/register-blocks";

export interface ExpandingMediaBlockAttributes {
    mediaURL: string;
    floatingImages: string[];
    messageHeading: string;
    message: string;
    expandingMediaType: "video" | "image";
}

registerBlockType<ExpandingMediaBlockAttributes>(metadata.name, {
    title: metadata.title,
    icon: metadata.icon,
    description: metadata.description,
    category: metadata.category,
    attributes: {
        mediaURL: {
            type: "string",
            default: "",
        },
        floatingImages: {
            type: "array",
            default: [],
        },
        messageHeading: {
            type: "string",
            default: "",
        },
        message: {
            type: "string",
            default: "",
        },
        expandingMediaType: {
            type: "string",
            default: "video",
        },
    },
    edit: ExpandingMediaBlockEdit,
    save: ExpandingMediaBlockSave,
});
