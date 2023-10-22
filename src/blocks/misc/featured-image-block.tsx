/*
 * Created on Sun Sep 17 2023
 * Author: Connor Doman
 */

import React from "react";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";
import { useBlockProps } from "@wordpress/block-editor";
import { CsekBlockHeading } from "../../components/heading";

import { CsekMediaUpload } from "../../components/media-upload";
import { TextInput } from "../../components/input";

export interface FeaturedImageBlockAttributes {
    imageURL: string;
    imageAlt: string;
}

export const FeaturedImageBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<FeaturedImageBlockAttributes>) => {
    const blockProps = useBlockProps();

    const { imageURL, imageAlt } = attributes;

    const onChangeImageURL = (url: string) => {
        setAttributes({ imageURL: url });
    };

    const onChangeImageAlt = (value: string) => {
        setAttributes({ imageAlt: value });
    };

    return (
        <section {...blockProps}>
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

    const { imageURL, imageAlt } = attributes;

    return (
        <section {...blockProps}>
            <img className="featured-image" src={imageURL} alt={imageAlt} />
        </section>
    );
};
