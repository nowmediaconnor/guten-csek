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
import CsekPaddingSelector, { Padding, defaultPadding } from "../../components/padding-selector";

export interface FeaturedImageBlockAttributes {
    imageURL: string;
    imageAlt: string;
    padding: Padding;
}

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

    const handlePaddingChange = (padding: Padding) => {
        setAttributes({ padding });
    };

    return (
        <section {...blockProps}>
            <InspectorControls>
                <CsekPaddingSelector onChange={handlePaddingChange} padding={padding} />
            </InspectorControls>
            <CsekBlockHeading>Csek Featured Image Block</CsekBlockHeading>
            <div className="csek-card flex flex-col gap-4">
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

    const p = {
        t: `${padding.top}${padding.unit}`,
        l: `${padding.left}${padding.unit}`,
        b: `${padding.bottom}${padding.unit}`,
        r: `${padding.right}${padding.unit}`,
    };

    return (
        <section {...blockProps} style={{ paddingTop: p.t, paddingLeft: p.l, paddingBottom: p.b, paddingRight: p.r }}>
            <img className="featured-image" src={imageURL} alt={imageAlt} />
        </section>
    );
};
