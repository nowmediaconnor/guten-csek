/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import React from "react";
import { registerBlockType } from "@wordpress/blocks";
import { BlockquoteBlockEdit } from "./edit";
import { BlockquoteBlockSave } from "./save";
import metadata from "./block.json";
import "./style.css";
import { registerAllBlocks } from "../../../scripts/register-blocks";

export interface BlockquoteBlockAttributes {
    heading: string;
    quote: string;
    author: string;
    authorRole: string;
}

registerBlockType<BlockquoteBlockAttributes>(metadata.name, {
    title: metadata.title,
    icon: metadata.icon,
    description: metadata.description,
    category: metadata.category,
    attributes: {
        heading: {
            type: "string",
            default: "Quote",
        },
        quote: {
            type: "string",
            default: "This is a quote.",
        },
        author: {
            type: "string",
            default: "Author",
        },
        authorRole: {
            type: "string",
            default: "CEO",
        },
    },
    edit: BlockquoteBlockEdit,
    save: BlockquoteBlockSave,
});
