/*
 * Created on Fri Aug 11 2023
 * Author: Connor Doman
 */
import React from "react";
import { MediaUpload, MediaUploadCheck, InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { Button, PanelBody } from "@wordpress/components";
import { Heading } from "../components/heading";
import { CsekBlockHeading } from "../components/heading";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../scripts/dom";
import { CsekMediaUpload } from "../components/media-upload";
import { TextInput } from "../components/input";
import CsekCard from "../components/card";

interface TaglineHeaderProps {
    attributes: any;
    setAttributes?: any;
}

export interface TaglineHeaderAttributes {
    preTagline: string;
    tagline: string;
    subTagline: string;
    imageURL: string;
}

export const TaglineHeaderEdit = ({ attributes, setAttributes }: GutenCsekBlockEditProps<TaglineHeaderAttributes>) => {
    const { preTagline, tagline, subTagline, imageURL } = attributes;

    const preTaglineChange = (value: string) => {
        setAttributes({ preTagline: value });
    };

    const taglineChange = (value: string) => {
        setAttributes({ tagline: value });
    };

    const subTaglineChange = (value: string) => {
        setAttributes({ subTagline: value });
    };

    const onSelectImage = (url: string) => {
        setAttributes({ imageURL: url });
    };

    return (
        <div className="csek-block">
            <InspectorControls>
                <PanelBody title="Csek Tagline Header Editor">
                    <CsekMediaUpload
                        label="Accent image"
                        urlAttribute={imageURL}
                        onChange={onSelectImage}
                        type="image"
                    />
                </PanelBody>
            </InspectorControls>
            <CsekBlockHeading>Csek Tagline Header Block</CsekBlockHeading>
            <CsekCard className="flex flex-col gap-2">
                <TextInput label="Pre-Tagline" initialValue={preTagline} onChange={preTaglineChange} />
                <TextInput label="Tagline" initialValue={tagline} onChange={taglineChange} />
                <TextInput label="Subtagline" initialValue={subTagline} onChange={subTaglineChange} />
            </CsekCard>
            {imageURL && <img src={imageURL} className="w-48 relative mx-auto" alt="Tagline Header Image" />}
        </div>
    );
};

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
