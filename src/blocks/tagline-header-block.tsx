/*
 * Created on Fri Aug 11 2023
 * Author: Connor Doman
 */
import React from "react";
import { MediaUpload, MediaUploadCheck, InspectorControls } from "@wordpress/block-editor";
import { Button, PanelBody } from "@wordpress/components";

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
                        <h2>Tagline accent image:</h2>
                        <MediaUpload
                            onSelect={onSelectImage}
                            // type="image"
                            value={imageURL}
                            render={({ open }) => <Button onClick={open}>Select Image</Button>}
                        />
                    </MediaUploadCheck>
                </PanelBody>
            </InspectorControls>
            <h2>Tagline Header Block</h2>
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
    const { preTagline, tagline, imageURL } = attributes;

    return (
        <div className="flex flex-col items-center justify-center text-csek-black text-center w-[70%] mx-auto -mb-20 scroll-fade-away">
            <div className="z-20">
                <h3 className="font-bold text-xl uppercase font-syne">{preTagline}</h3>
                <h1 className="text-8xl font-bold uppercase font-syne">{tagline}</h1>
            </div>
            <img src={imageURL} className="w-48 -top-11 relative z-10" alt="Red Csek Creative Serif Symbol" />
        </div>
    );
};
