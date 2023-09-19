/*
 * Created on Mon Sep 18 2023
 * Author: Connor Doman
 */

import React from "react";
import { GutenbergBlockProps } from "../../scripts/dom";
import { MediaUpload, MediaUploadCheck, useBlockProps } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";

// needs:
// - images
// - image alt texts
// - links

export const VerticalScrollingImagesBlockEdit = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps();

    const { numberOfImages, images, imageAlts, links } = attributes;

    const onUpdateImages = (img, index: number) => {
        const newImages = [...images];
        newImages[index] = img.url;
        setAttributes({ images: newImages });
    };

    const onUpdateImageAlts = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newImageAlts = [...imageAlts];
        newImageAlts[index] = event.target.value;
        setAttributes({ imageAlts: newImageAlts });
    };

    const onUpdateLinks = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newLinks = [...links];
        newLinks[index] = event.target.value;
        setAttributes({ links: newLinks });
    };

    const onDeleteImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);

        setAttributes({ images: newImages, numberOfImages: (parseInt(numberOfImages) - 1).toString() });
    };

    const imageCards: JSX.Element[] = [];
    for (let i = 0; i < numberOfImages; i++) {
        imageCards.push(
            <div className="row csek-card">
                <div className="column">
                    <Button
                        className="csek-button"
                        icon="trash"
                        label="Remove image"
                        onClick={() => onDeleteImage(i)}
                    />
                    <h4>Image {i + 1}</h4>
                    <MediaUpload
                        onSelect={(img) => onUpdateImages(img, i)}
                        allowedTypes={["image"]}
                        multiple={false}
                        value={images[i]}
                        render={({ open }) => <Button onClick={open}>Choose image {i + 1}</Button>}
                    />
                </div>
                <div className="column">
                    <img className="preview-image" src={images[i]} alt={imageAlts[i]} />
                    <input
                        type="text"
                        className="csek-input"
                        value={imageAlts[i]}
                        onChange={(e) => onUpdateImageAlts(e, i)}
                        placeholder={`Image ${i + 1} alt text`}
                    />
                    <input
                        type="text"
                        className="csek-input"
                        value={links[i]}
                        onChange={(e) => onUpdateLinks(e, i)}
                        placeholder={`Image ${i + 1} link`}
                    />
                </div>
            </div>
        );
    }

    return (
        <section {...blockProps}>
            <h3>Csek Vertical Scrolling Images Block</h3>
            <MediaUploadCheck>
                <div className="column">
                    {imageCards}
                    <Button
                        className="csek-button"
                        icon="plus"
                        label="Add Image"
                        onClick={() => setAttributes({ numberOfImages: (parseInt(numberOfImages) + 1).toString() })}>
                        Add Image
                    </Button>
                </div>
            </MediaUploadCheck>
        </section>
    );
};

export const VerticalScrollingImagesBlockSave = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps.save();
    const { numberOfImages, images, imageAlts, links } = attributes;

    const imageElements = images.map((image: string, index: number) => {
        return (
            <a href={links[index]} className="vertical-scroll-card">
                <img src={image} alt={imageAlts[index]} />
            </a>
        );
    });

    return (
        <section {...blockProps}>
            <div className="vertical-scroll-container">
                <div className="vertical-scroll-grid">{imageElements}</div>
            </div>
        </section>
    );
};
