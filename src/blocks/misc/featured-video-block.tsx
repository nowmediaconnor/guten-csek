/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import React, { useState } from "react";
import { Heading } from "../../components/heading";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps, GutenbergBlockProps } from "../../scripts/dom";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { CsekMediaUpload } from "../../components/media-upload";
import { CsekBlockHeading } from "../../components/heading";
import CsekPaddingSelector, { Padding } from "../../components/padding-selector";
import Label from "../../components/label";

export interface FeaturedVideoBlockAttributes {
    videoURL: string;
    padding: Padding;
}

export const defaultFeaturedVideoPadding: Padding = {
    unit: "rem",
    top: 3,
    left: 0,
    bottom: 3,
    right: 0,
};

export const FeaturedVideoBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<FeaturedVideoBlockAttributes>) => {
    const blockProps = useBlockProps();

    const { videoURL, padding } = attributes;

    const handleChangeVideoURL = (v: any) => {
        setAttributes({ videoURL: v.url });
    };

    const handleChangePadding = (padding: Padding) => {
        setAttributes({ padding });
    };

    return (
        <div {...blockProps}>
            <InspectorControls>
                <CsekPaddingSelector onChange={handleChangePadding} padding={padding} />
            </InspectorControls>
            <CsekBlockHeading>Csek Featured Video Block</CsekBlockHeading>
            <Label>
                Check the Inspector panel to edit padding <i className="fa fa-arrow-right"></i>
            </Label>
            <CsekMediaUpload type="video" urlAttribute={videoURL} onChange={handleChangeVideoURL} />
        </div>
    );
};

export const FeaturedVideoBlockSave = ({ attributes }: GutenCsekBlockSaveProps<FeaturedVideoBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { videoURL } = attributes;

    return (
        <section {...blockProps}>
            <div className="block-container">
                <div className="video-container">
                    <div className="video-shade"></div>
                    <video controls={false} autoPlay={false} loop={false} muted={false}>
                        <source src={videoURL} />
                    </video>
                    <div className="playbutton">
                        <i className="fa fa-play"></i>
                        Play
                    </div>
                </div>
            </div>
        </section>
    );
};
