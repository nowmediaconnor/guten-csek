/*
 * Created on Sat Sep 23 2023
 * Author: Connor Doman
 */

import React from "react";
import { GutenbergBlockProps } from "../../scripts/dom";
import { MediaUpload, useBlockProps } from "@wordpress/block-editor";
import { Button, ColorPicker } from "@wordpress/components";

export const ImageCollageBlockEdit = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps();

    const { images, imageAlts, backgroundColor } = attributes;

    const setBackgroundColor = (colors: any) => {
        setAttributes({ backgroundColor: colors["hex"] });
    };

    const setImageAt = (index: number, image: string) => {
        const newImages = [...images];
        if (index > newImages.length) newImages.push(image);
        else newImages[index] = image;
        setAttributes({ images: newImages });
    };

    const setImageAltAt = (index: number, alt: string) => {
        const newImageAlts = [...imageAlts];
        if (index >= newImageAlts.length) newImageAlts.push(alt);
        else newImageAlts[index] = alt;
        setAttributes({ imageAlts: newImageAlts });
    };

    const newImage = () => {
        const len = images.length;
        setImageAt(len, "");
        setImageAltAt(len, "");
    };

    const deleteImageAt = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setAttributes({ images: newImages });
    };

    const imagePreviewElements = images.map((image: any, index: number) => {
        return (
            <div className="csek-card w-full">
                <h4>Image Preview</h4>
                <div className="flex flex-col gap-2">
                    <img className="preview-image" src={image} alt={imageAlts[index]} />
                    <MediaUpload
                        onSelect={(v) => setImageAt(index, v.url)}
                        allowedTypes={["image"]}
                        multiple={false}
                        value={image}
                        render={({ open }) => (
                            <Button className="csek-button" onClick={open} icon="format-image">
                                Choose image
                            </Button>
                        )}
                    />
                </div>
                <h4>Image Alt Text</h4>
                <input
                    className="csek-input"
                    type="text"
                    onChange={(e) => setImageAltAt(index, e.target.value as string)}
                    placeholder=""
                    value={imageAlts[index]}
                />
                <br />
                <Button onClick={() => deleteImageAt(index)} icon="trash">
                    Delete
                </Button>
            </div>
        );
    });

    return (
        <section {...blockProps} className="p-4">
            <h3>Csek Image Collage Block</h3>
            <div className="flex flex-row justify-between gap-4">
                <div className="flex flex-col">
                    {imagePreviewElements}
                    <Button className="csek-button" onClick={() => newImage()} icon="plus">
                        Add Card
                    </Button>
                </div>
                <div className="flex flex-col csek-card h-max">
                    <h4>Background Color</h4>
                    <ColorPicker color={backgroundColor} onChangeComplete={setBackgroundColor} copyFormat="hex" />
                </div>
            </div>
        </section>
    );
};

export const ImageCollageBlockSave = ({ attributes }: GutenbergBlockProps) => {
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
