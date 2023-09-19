/*
 * Created on Sun Sep 17 2023
 * Author: Connor Doman
 */

import React from "react";
import { GutenbergBlockProps } from "../../scripts/dom";
import { MediaUpload, MediaUploadCheck, useBlockProps } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";

export const FeaturedImageBlockEdit = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps();

    const { imageURL, imageAlt } = attributes;

    const onChangeImageURL = (v) => {
        setAttributes({ imageURL: v.url });
    };

    const onChangeImageAlt = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ imageAlt: event.target.value });
    };

    return (
        <section {...blockProps}>
            <h3>Csek Featured Image Block</h3>
            <input
                className="csek-input"
                type="text"
                value={attributes.imageAlt}
                onChange={onChangeImageAlt}
                placeholder="Image alt text"
            />
            <MediaUploadCheck>
                <MediaUpload
                    onSelect={onChangeImageURL}
                    allowedTypes={["image"]}
                    multiple={false}
                    value={imageURL}
                    render={({ open }) => <Button onClick={open}>Choose image</Button>}
                />
            </MediaUploadCheck>
            <h4>Image preview</h4>
            <img className="featured-image" src={attributes.imageURL} alt={attributes.imageAlt} />
        </section>
    );
};

export const FeaturedImageBlockSave = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps.save();

    const { imageURL, imageAlt } = attributes;

    return (
        <section {...blockProps}>
            <img className="featured-image" src={imageURL} alt={imageAlt} />
        </section>
    );
};
