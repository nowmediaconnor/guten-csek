/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import { useBlockProps } from "@wordpress/block-editor";
import React from "react";
import { GutenCsekBlockSaveProps } from "../../../js/guten-csek";
import { TaglineHeaderAttributes } from ".";

export const TaglineHeaderSave = ({ attributes }: GutenCsekBlockSaveProps<TaglineHeaderAttributes>) => {
    const blockProps = useBlockProps.save();

    const { preTagline, tagline, subTagline, imageURL } = attributes;

    return (
        <div {...blockProps} className="scroll-fade-away">
            <div className="block-content">
                <div className="heading-text">
                    <h3>{preTagline}</h3>
                    <h1>{tagline}</h1>
                    <h2>{subTagline}</h2>
                </div>
                <img src={imageURL} className="serif" alt="Red Csek Creative Serif Symbol" />
            </div>
        </div>
    );
};
