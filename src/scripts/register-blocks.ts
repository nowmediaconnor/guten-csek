/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import { registerBlockType, BlockAttribute } from "@wordpress/blocks";
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
        title: "Csek Staff Profiles",
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
        },
        edit: StaffProfilesBlockEdit,
        save: StaffProfilesBlockSave,
    });
};
