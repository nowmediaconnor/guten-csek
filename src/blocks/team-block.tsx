/*
 * Created on Tue Aug 15 2023
 * Author: Connor Doman
 */

import { MediaUploadCheck, MediaUpload, InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { Button, PanelBody } from "@wordpress/components";
import React from "react";
import { Heading } from "../components/heading";
import { CsekBlockHeading } from "../components/heading";
import { CsekMediaUpload } from "../components/media-upload";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../scripts/dom";
import Label from "../components/label";
import { TextInput } from "../components/input";
import { CsekAddButton, CsekDeleteButton } from "../components/button";

interface TeamBlockProps {
    attributes: any;
    setAttributes?: any;
}

export interface TeamBlockAttributes {
    images: string[];
    title: string;
    tagline: string;
    copyText: string;
    cta: string;
    ctaLink: string;
}

export const TeamBlockEdit = ({ attributes, setAttributes }: GutenCsekBlockEditProps<TeamBlockAttributes>) => {
    const blockProps = useBlockProps();

    const { images, title, tagline, copyText, cta, ctaLink } = attributes;

    const onSetBlockTitle = (value: string) => {
        setAttributes({ title: value });
    };
    const onSetTagline = (value: string) => {
        setAttributes({ tagline: value });
    };
    const onSetCopyText = (value: string) => {
        setAttributes({ copyText: value });
    };
    const onSetCTA = (value: string) => {
        setAttributes({ cta: value });
    };
    const onSetCTALink = (value: string) => {
        setAttributes({ ctaLink: value });
    };

    const handleChangeImageURL = (v: string, index: number) => {
        const newImages = [...images];
        newImages[index] = v;
        setAttributes({ images: newImages });
    };

    const addImage = () => {
        setAttributes({ images: [...images, ""] });
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setAttributes({ images: newImages });
    };

    const imageSelectors = images.map((image: string, index: number) => {
        return (
            <div className="relative">
                <CsekDeleteButton
                    onDelete={() => removeImage(index)}
                    label="Remove"
                    className="absolute top-2 right-2"
                />
                <CsekMediaUpload
                    label={`Team member ${index + 1}`}
                    urlAttribute={image}
                    onChange={(v) => handleChangeImageURL(v, index)}
                />
            </div>
        );
    });

    return (
        <div {...blockProps} className="csek-block">
            <InspectorControls>
                <PanelBody title="Expanding Video Block Media" className="flex flex-col gap-2">
                    {imageSelectors}
                    <CsekAddButton onAdd={addImage} label="Add Team Member" />
                </PanelBody>
            </InspectorControls>
            <CsekBlockHeading>Csek Team Block</CsekBlockHeading>
            <Label>Check the inspector to update team photos.</Label>
            <div className="csek-card flex flex-col gap-4">
                <p>{images.length} images selected.</p>
                <TextInput placeholder="Title" label="Title" initialValue={title} onChange={onSetBlockTitle} />
                <TextInput placeholder="Tagline" label="Tagline" initialValue={tagline} onChange={onSetTagline} />
                <TextInput placeholder="Copy Text" label="Copy Text" initialValue={copyText} onChange={onSetCopyText} />
                <TextInput placeholder="Call To Action" label="Call To Action" initialValue={cta} onChange={onSetCTA} />
                <TextInput
                    placeholder="Call To Action Link"
                    label="Call To Action Link"
                    initialValue={ctaLink}
                    onChange={onSetCTALink}
                />
            </div>
        </div>
    );
};

export const TeamBlockSave = ({ attributes }: GutenCsekBlockSaveProps<TeamBlockAttributes>) => {
    const blockProps = useBlockProps.save();
    const { images, title, tagline, copyText, cta, ctaLink } = attributes;

    return (
        <section {...blockProps}>
            <div className="block-content">
                <h2 className="block-title">{title}</h2>
                <p className="tagline">{tagline}</p>
                <div className="copy-text">
                    <p>{copyText}</p>
                    <div className="learn-more">
                        <a href={ctaLink}>
                            <div className="bar"></div>
                            {cta}
                        </a>
                    </div>
                </div>
            </div>
            <div className="headshots">
                {images.map((image: string, index: number) => {
                    return (
                        <div className="headshot" key={index}>
                            <img src={image} alt="" />
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
