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
import CsekCard from "../../components/card";

export interface FullscreenImageBlockAttributes {
    imageURL: string;
    imageAlt: string;
}

export const FullscreenImageBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<FullscreenImageBlockAttributes>) => {
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
            <CsekBlockHeading>Csek Fullscreen Image Block</CsekBlockHeading>
            <CsekCard className="flex flex-col gap-4">
                <TextInput
                    initialValue={imageAlt}
                    onChange={onChangeImageAlt}
                    placeholder="Image alt text"
                    label="Image Alt Text"
                />
                <CsekMediaUpload onChange={onChangeImageURL} urlAttribute={imageURL} type="image" size="full" />
            </CsekCard>
        </section>
    );
};

export const FullscreenImageBlockSave = ({ attributes }: GutenCsekBlockSaveProps<FullscreenImageBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { imageURL, imageAlt } = attributes;

    return (
        <section {...blockProps}>
            <img className="fullscreen-image" src={imageURL} alt={imageAlt} />
        </section>
    );
};
