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
import {
    StaffProfile,
    StaffProfilesBlockAttributes,
    StaffProfilesBlockEdit,
    StaffProfilesBlockSave,
} from "../blocks/misc/staff-profiles-block";
import { LetsTalkBlockAttributes, LetsTalkBlockEdit, LetsTalkBlockSave } from "../blocks/misc/lets-talk-block";

export const registerAllBlocks = () => {
    console.log("Registering blocks...");

    // Self description block
    registerBlockType<SelfDescriptionBlockAttributes>("guten-csek/self-description-block", {
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
            factHeaders: {
                type: "array",
                default: [],
            },
            factDescriptions: {
                type: "array",
                default: [],
            },
        },
        edit: SelfDescriptionBlockEdit,
        save: SelfDescriptionBlockSave,
    });

    // Staff profiles block
    registerBlockType<StaffProfilesBlockAttributes>("guten-csek/staff-profiles-block", {
        title: "Csek Staff Showcase",
        icon: "groups",
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
            profiles: {
                type: "array",
                default: [] as StaffProfile[],
            },
            alternateLayout: {
                type: "boolean",
                default: false,
            },
        },
        edit: StaffProfilesBlockEdit,
        save: StaffProfilesBlockSave,
    });

    // Let's Talk / CTA block
    registerBlockType<LetsTalkBlockAttributes>("guten-csek/lets-talk-block", {
        title: "Csek Let's Talk (CTA)",
        icon: "megaphone",
        category: "common",
        attributes: {
            heading: {
                type: "string",
                default: "Want to discuss our capabilities? Get in touch.",
            },
            buttonText: {
                type: "string",
                default: "Let's Talk",
            },
            imageURL: {
                type: "string",
                default: "",
            },
        },
        edit: LetsTalkBlockEdit,
        save: LetsTalkBlockSave,
    });
};
