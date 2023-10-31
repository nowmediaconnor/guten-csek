/*
 * Created on Sun Sep 17 2023
 * Author: Connor Doman
 */

import React from "react";
import { GutenCsekBlockEditProps, GutenbergBlockProps } from "../../scripts/dom";
import { MediaUpload, MediaUploadCheck, useBlockProps } from "@wordpress/block-editor";
import { Button, __experimentalNumberControl as NumberControl } from "@wordpress/components";
import { Heading } from "../../components/heading";
import { CsekBlockHeading } from "../../components/heading";
import { CsekMediaUpload } from "../../components/media-upload";
import CsekCard from "../../components/card";
import { TextInput } from "../../components/input";

export interface MultiImageBlockAttributes {
    title: string;
    images: string[];
    altTexts: string[];
}

export const MultiImageBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<MultiImageBlockAttributes>) => {
    const blockProps = useBlockProps();
    const { title, images, altTexts } = attributes;

    const onChangeImageURL = (v: string, index: number) => {
        const newImages = [...images];
        newImages[index] = v;
        setAttributes({ images: newImages });
    };

    const onChangeAltText = (v: string, index: number) => {
        const newAltTexts = [...altTexts];
        newAltTexts[index] = v;
        setAttributes({ altTexts: newAltTexts });
    };

    const onTitleChange = (v: string) => {
        setAttributes({ title: v });
    };

    const addImage = () => {
        const newImages = [...images];
        newImages.push("");
        setAttributes({ images: newImages });
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setAttributes({ images: newImages });
    };

    const imageInputs: JSX.Element[] = images.map((image, index) => {
        return (
            <CsekCard className="flex flex-col gap-2">
                <Heading level="4" className="my-2">
                    Image {index + 1}
                </Heading>
                <CsekMediaUpload urlAttribute={images[index]} onChange={(v) => onChangeImageURL(v, index)} />
                <TextInput
                    label={`Alt text`}
                    initialValue={altTexts[index]}
                    onChange={(e) => onChangeAltText(e, index)}
                />
            </CsekCard>
        );
    });

    return (
        <section {...blockProps}>
            <CsekBlockHeading>Csek Multi Image Block</CsekBlockHeading>
            <CsekCard>
                <TextInput label="Block Title" initialValue={title} onChange={onTitleChange} />
                <Heading level="4" className="my-2">
                    Image previews
                </Heading>
                <div className="grid grid-cols-2 gap-4">{imageInputs}</div>
            </CsekCard>
        </section>
    );
};

export const MultiImageBlockSave = ({ attributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps.save();
    const { images, altTexts, title } = attributes;

    const imageElements = images.map((image, index) => {
        return <img src={image} alt={altTexts[index]} />;
    });

    return (
        <section {...blockProps}>
            <div className="image-grid-container">
                <h3>{title}</h3>
                <div className="image-grid">{imageElements}</div>
            </div>
        </section>
    );
};
