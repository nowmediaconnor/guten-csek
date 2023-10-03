/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import { registerBlockType } from "@wordpress/blocks";
import {
    SelfDescriptionBlockAttributes,
    SelfDescriptionBlockEdit,
    SelfDescriptionBlockSave,
} from "../blocks/misc/self-description-block";

export const registerAllBlocks = () => {
    console.log("Registering blocks...");

    registerBlockType<SelfDescriptionBlockAttributes>("guten-csek/block-self-description", {
        title: "Csek Self Description",
        icon: "text-page",
        category: "common",
        attributes: {
            heading: {
                type: "string",
                default: "",
            },
            caption: {
                type: "string",
                default: "",
            },
            primaryImageURL: {
                type: "string",
                default: "",
            },
            secondaryImageURL: {
                type: "string",
                default: "",
            },
        },
        edit: SelfDescriptionBlockEdit,
        save: SelfDescriptionBlockSave,
    });
};
