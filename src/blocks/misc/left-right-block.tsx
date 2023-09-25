/*
 * Created on Sun Sep 17 2023
 * Author: Connor Doman
 */

import React from "react";

import { GutenbergBlockProps } from "../../scripts/dom";

import { MediaUpload, MediaUploadCheck, useBlockProps } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { Heading } from "../../components/heading";

export const LeftRightBlockEdit = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps();

    const { text, image, altText, direction } = attributes;

    return (
        <section {...blockProps}>
            <Heading level="3">Csek Left-Right Block</Heading>
            <Heading level="5">Direction</Heading>
            <select onChange={(e) => setAttributes({ direction: e.target.value })}>
                <option value="left">Left to Right</option>
                <option value="right">Right to Left</option>
            </select>
            <div className="row">
                <div className="column">
                    <Heading level="5">Body text</Heading>
                    <textarea
                        className="csek-input"
                        value={text}
                        placeholder="Body text"
                        onChange={(e) => setAttributes({ text: e.target.value })}
                    />
                </div>
                <div className="column">
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={(v) => setAttributes({ image: v.url })}
                            allowedTypes={["image"]}
                            multiple={false}
                            value={image}
                            render={({ open }) => <Button onClick={open}>Choose image</Button>}
                        />
                    </MediaUploadCheck>
                    <input
                        className="csek-input"
                        type="text"
                        value={altText}
                        placeholder="Image alt text"
                        onChange={(e) => setAttributes({ altText: e.target.value })}
                    />
                </div>
                <img className="preview-image" src={image} alt={altText} />
            </div>
        </section>
    );
};

export const LeftRightBlockSave = ({ attributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps.save();

    const { text, image, altText, direction } = attributes;

    return (
        <section {...blockProps}>
            <div className="left-right">
                <div className="column">
                    <p>{text}</p>
                </div>
                <div className="column">
                    <img src={image} alt={altText} />
                </div>
            </div>
        </section>
    );
};
