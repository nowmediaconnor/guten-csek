/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import React from "react";
import { registerBlockType } from "@wordpress/blocks";
import { TaglineHeaderEdit } from "./edit";
import { TaglineHeaderSave } from "./save";
import metadata from "./block.json";
import "./style.css";

export interface TaglineHeaderAttributes {
    preTagline: string;
    tagline: string;
    subTagline: string;
    imageURL: string;
}

registerBlockType<TaglineHeaderAttributes>(metadata.name, {
    title: metadata.title,
    icon: metadata.icon,
    description: metadata.description,
    category: metadata.category,
    attributes: {
        preTagline: {
            type: "string",
            default: "Welcome to",
        },
        tagline: {
            type: "string",
            default: "The House of More.",
        },
        subTagline: {
            type: "string",
            default: "We are a full-service marketing agency that delivers results.",
        },
        imageURL: {
            type: "string",
            default: "",
        },
    },
    edit: TaglineHeaderEdit,
    save: TaglineHeaderSave,
});
