/*
 * Created on Sat Sep 23 2023
 * Author: Connor Doman
 */

import React from "react";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps, GutenbergBlockProps } from "../../scripts/dom";
import { MediaUpload, useBlockProps } from "@wordpress/block-editor";
import { Button, ColorPicker } from "@wordpress/components";
import { Heading } from "../../components/heading";
import { CsekBlockHeading } from "../../components/heading";
import { CsekMediaUpload } from "../../components/media-upload";
import { TextInput } from "../../components/input";
import { CsekDeleteButton } from "../../components/button";
import CsekCard from "../../components/card";

export interface ImageCollageBlockAttributes {
    images: string[];
    imageAlts: string[];
    backgroundColor: string;
}

export const ImageCollageBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<ImageCollageBlockAttributes>) => {
    const blockProps = useBlockProps();

    const { images, imageAlts, backgroundColor } = attributes;

    const setBackgroundColor = (colors: any) => {
        setAttributes({ backgroundColor: colors["hex"] });
    };

    const setImageAt = (image: string, index: number) => {
        const newImages = [...images];
        if (index > newImages.length) newImages.push(image);
        else newImages[index] = image;
        setAttributes({ images: newImages });
    };

    const setImageAltAt = (alt: string, index: number) => {
        const newImageAlts = [...imageAlts];
        if (index >= newImageAlts.length) newImageAlts.push(alt);
        else newImageAlts[index] = alt;
        setAttributes({ imageAlts: newImageAlts });
    };

    const newImage = () => {
        const len = images.length;
        setImageAt("", len);
        setImageAltAt("", len);
    };

    const deleteImageAt = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setAttributes({ images: newImages });
    };

    const imagePreviewElements = images.map((image: any, index: number) => {
        return (
            <CsekCard className="flex flex-col gap-2">
                <Heading level="4">Image {index + 1}</Heading>
                <CsekMediaUpload urlAttribute={images[index]} onChange={(v) => setImageAt(v, index)} />
                <TextInput label="Alt text" initialValue={imageAlts[index]} onChange={(v) => setImageAltAt(v, index)} />
                <br />
                <CsekDeleteButton onDelete={() => deleteImageAt(index)} />
            </CsekCard>
        );
    });

    return (
        <section {...blockProps} className="csek-block">
            <CsekBlockHeading>Csek Image Collage Block</CsekBlockHeading>
            <div className="grid grid-cols-3 gap-4">
                <CsekCard className="flex flex-col gap-2 col-span-3">
                    <Heading level="4">Background Color</Heading>
                    <ColorPicker color={backgroundColor} onChangeComplete={setBackgroundColor} copyFormat="hex" />
                </CsekCard>
                {imagePreviewElements}
                <Button className="csek-button" onClick={() => newImage()} icon="plus">
                    Add Card
                </Button>
            </div>
        </section>
    );
};

export const ImageCollageBlockSave = ({ attributes }: GutenCsekBlockSaveProps<ImageCollageBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { images, imageAlts, backgroundColor } = attributes;

    const imageBricks = images.map((image: string, index: number) => {
        return (
            <div className="brick">
                <img src={image} alt={imageAlts[index]} />
            </div>
        );
    });

    return (
        <section {...blockProps} style={{ backgroundColor: backgroundColor }}>
            <div className="masonry">{imageBricks}</div>
        </section>
    );
};
