/*
 * Created on Fri Aug 11 2023
 * Author: Connor Doman
 */
import React from "react";
import { MediaUpload, MediaUploadCheck, InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { Button, PanelBody } from "@wordpress/components";
import { Heading } from "../components/heading";

interface TaglineHeaderProps {
    attributes: any;
    setAttributes?: any;
}

export const TaglineHeaderEdit = ({ attributes, setAttributes }: TaglineHeaderProps) => {
    const { preTagline, tagline, imageURL } = attributes;

    const preTaglineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ preTagline: e.target.value });
    };

    const taglineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ tagline: e.target.value });
    };

    const onSelectImage = (media: any) => {
        setAttributes({ imageURL: media.url });
    };

    return (
        <div className="p-4 flex flex-col gap-4">
            <InspectorControls>
                <PanelBody title="Tagline Header Editor">
                    <MediaUploadCheck>
                        <Heading level="2">Tagline accent image:</Heading>
                        <MediaUpload
                            onSelect={onSelectImage}
                            // type="image"
                            value={imageURL}
                            render={({ open }) => <Button onClick={open}>Select Image</Button>}
                        />
                    </MediaUploadCheck>
                </PanelBody>
            </InspectorControls>
            <Heading level="2">Tagline Header Block</Heading>
            <div className="z-10 w-full flex flex-col gap-4">
                <input
                    type="text"
                    value={preTagline}
                    onChange={(e) => preTaglineChange(e)}
                    placeholder="Pre-tagline text"
                />
                <input type="text" value={tagline} onChange={(e) => taglineChange(e)} placeholder="Tagline text" />
            </div>
            {imageURL && <img src={imageURL} className="w-48 relative mx-auto" alt="Tagline Header Image" />}
        </div>
    );
};

export const TaglineHeaderSave = ({ attributes }: TaglineHeaderProps) => {
    const blockProps = useBlockProps.save();

    const { preTagline, tagline, imageURL } = attributes;

    return (
        <div {...blockProps} className="scroll-fade-away scroll-down-target">
            <div className="heading-text">
                <h3>{preTagline}</h3>
                <h1>{tagline}</h1>
            </div>
            <img src={imageURL} className="serif" alt="Red Csek Creative Serif Symbol" />
        </div>
    );
};
