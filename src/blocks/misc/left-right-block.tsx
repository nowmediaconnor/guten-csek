/*
 * Created on Sun Sep 17 2023
 * Author: Connor Doman
 */

import React from "react";

import { GutenbergBlockProps } from "../../scripts/dom";

import { MediaUpload, MediaUploadCheck, useBlockProps } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { Heading } from "../../components/heading";
import { CsekBlockHeading } from "../../components/heading";

export const LeftRightBlockEdit = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps();

    const { text, image, altText, direction } = attributes;

    return (
        <section {...blockProps}>
            <CsekBlockHeading>Csek Left-Right Block</CsekBlockHeading>

            <div className="flex flex-row justify-between gap-4">
                <div className="flex flex-col justify-around align-center w-full gap-2 h-full csek-card">
                    <Heading level="5">Direction</Heading>
                    <select onChange={(e) => setAttributes({ direction: e.target.value })} className="csek-input">
                        <option value="left">Left to Right</option>
                        <option value="right">Right to Left</option>
                    </select>
                    <Heading level="5">Body text</Heading>
                    <textarea
                        className="csek-input"
                        value={text}
                        placeholder="Body text"
                        onChange={(e) => setAttributes({ text: e.target.value })}
                    />
                    <Heading level="5">Image alt text</Heading>
                    <input
                        className="csek-input"
                        type="text"
                        value={altText}
                        placeholder="Image alt text"
                        onChange={(e) => setAttributes({ altText: e.target.value })}
                    />
                </div>
                <div className="column csek-card">
                    <img className="preview-image" src={image} alt={altText} />
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={(v) => setAttributes({ image: v.url })}
                            allowedTypes={["image"]}
                            multiple={false}
                            value={image}
                            render={({ open }) => (
                                <Button className="csek-button" onClick={open}>
                                    Choose image
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>
                </div>
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
