/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import React, { useState } from "react";
import { Heading } from "../../components/heading";
import { GutenbergBlockProps } from "../../scripts/dom";
import { useBlockProps } from "@wordpress/block-editor";
import { CsekMediaUpload } from "../../components/media-upload";
import { CsekBlockHeading } from "../../components/heading";

export const FeaturedVideoBlockEdit = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps();

    const { videoURL } = attributes;

    const handleChangeVideoURL = (v: any) => {
        setAttributes({ videoURL: v.url });
    };

    return (
        <div {...blockProps}>
            <CsekBlockHeading>Csek Featured Video Block</CsekBlockHeading>
            <CsekMediaUpload type="video" urlAttribute={videoURL} onChange={handleChangeVideoURL} />
        </div>
    );
};

export const FeaturedVideoBlockSave = ({ attributes }: GutenbergBlockProps) => {
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
