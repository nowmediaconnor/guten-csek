/*
 * Created on Sun Sep 17 2023
 * Author: Connor Doman
 */

import React from "react";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { CsekBlockHeading } from "../../components/heading";

import { CsekMediaUpload } from "../../components/media-upload";
import { TextInput } from "../../components/input";
import CsekPaddingSelector, { Padding, defaultPadding, styleFromPadding } from "../../components/padding-selector";
import Label from "../../components/label";

export interface FeaturedImageBlockAttributes {
    imageURL: string;
    imageAlt: string;
    padding: Padding;
}

export const defaultFeaturedImagePadding: Padding = {
    unit: "rem",
    top: 3,
    left: 0,
    bottom: 3,
    right: 0,
};

export const FeaturedImageBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<FeaturedImageBlockAttributes>) => {
    const blockProps = useBlockProps();

    const { imageURL, imageAlt, padding } = attributes;

    const onChangeImageURL = (url: string) => {
        setAttributes({ imageURL: url });
    };

    const onChangeImageAlt = (value: string) => {
        setAttributes({ imageAlt: value });
    };

    const handleChangePadding = (padding: Padding) => {
        setAttributes({ padding });
    };

    return (
        <section {...blockProps}>
            <InspectorControls>
                <CsekPaddingSelector onChange={handleChangePadding} padding={padding} />
            </InspectorControls>
            <CsekBlockHeading>Csek Featured Image Block</CsekBlockHeading>
            <div className="csek-card flex flex-col gap-4">
                <Label>
                    Check the Inspector panel to edit padding <i className="fa fa-arrow-right"></i>
                </Label>
                <TextInput
                    initialValue={imageAlt}
                    onChange={onChangeImageAlt}
                    placeholder="Image alt text"
                    label="Image Alt Text"
                />
                <CsekMediaUpload onChange={onChangeImageURL} urlAttribute={imageURL} type="image" />
            </div>
        </section>
    );
};

export const FeaturedImageBlockSave = ({ attributes }: GutenCsekBlockSaveProps<FeaturedImageBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { imageURL, imageAlt, padding } = attributes;

    const p = styleFromPadding(padding ?? defaultPadding);

    return (
        <section {...blockProps} style={p}>
            <img className="featured-image" src={imageURL} alt={imageAlt} />
        </section>
    );
};
