/*
 * Created on Sun Sep 17 2023
 * Author: Connor Doman
 */

import React from "react";
import { GutenbergBlockProps } from "../../scripts/dom";
import { MediaUpload, MediaUploadCheck, useBlockProps } from "@wordpress/block-editor";
import { Button, __experimentalNumberControl as NumberControl } from "@wordpress/components";

export const MultiImageBlockEdit = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps();
    const { title, numberOfImages, images, altTexts } = attributes;

    const onNumberOfImagesChange = (n: string | undefined) => {
        setAttributes({ numberOfImages: n });
    };

    const onChangeImageURL = (v, index) => {
        const newImages = [...images];
        newImages[index] = v.url;
        setAttributes({ images: newImages });
    };

    const onChangeAltText = (e: React.ChangeEvent<HTMLInputElement>, index) => {
        const newAltTexts = [...altTexts];
        newAltTexts[index] = e.target.value;
        setAttributes({ altTexts: newAltTexts });
    };

    const imageInputs: JSX.Element[] = [];
    for (let i = 0; i < numberOfImages; i++) {
        imageInputs.push(
            <div className="row">
                <div className="flex flex-col gap-4 w-full">
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={(v) => onChangeImageURL(v, i)}
                            allowedTypes={["image"]}
                            multiple={false}
                            value={images[i]}
                            render={({ open }) => <Button onClick={open}>Choose image {i + 1}</Button>}
                        />
                    </MediaUploadCheck>
                    <input
                        className="csek-input"
                        type="text"
                        value={altTexts[i]}
                        placeholder={`Image ${i + 1} alt text`}
                        onChange={(e) => onChangeAltText(e, i)}
                    />
                </div>
                <img className="preview-image" src={images[i]} alt={altTexts[i]} />
            </div>
        );
    }

    return (
        <section {...blockProps}>
            <h3>Csek Multi Image Block</h3>
            <h5>Block Title</h5>
            <input
                className="csek-input"
                type="text"
                value={title}
                onChange={(e) => setAttributes({ title: e.target.value })}
                placeholder="Block Title"
            />
            <h5>Number of Images</h5>
            <NumberControl value={numberOfImages} onChange={onNumberOfImagesChange} />
            <h4>Image previews</h4>
            <div className="flex flex-col gap-4">{imageInputs}</div>
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
