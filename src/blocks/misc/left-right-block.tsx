/*
 * Created on Sun Sep 17 2023
 * Author: Connor Doman
 */

import React from "react";

import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";

import { MediaUpload, MediaUploadCheck, useBlockProps } from "@wordpress/block-editor";
import { CsekBlockHeading } from "../../components/heading";
import { CsekMediaUpload } from "../../components/media-upload";
import { CsekSelectDropdown, TextArea, TextInput } from "../../components/input";

export interface LeftRightBlockAttributes {
    text: string;
    imageURL: string;
    altText: string;
    leftToRight: boolean;
}

export const LeftRightBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<LeftRightBlockAttributes>) => {
    const blockProps = useBlockProps();

    const { text, imageURL, altText, leftToRight } = attributes;

    const handleChangeDirection = (value: string) => {
        if (value === "left") {
            setAttributes({ leftToRight: true });
        } else {
            setAttributes({ leftToRight: false });
        }
    };

    const handleChangeText = (value: string) => {
        setAttributes({ text: value });
    };

    const handleChangeAltText = (value: string) => {
        setAttributes({ altText: value });
    };

    const handleChangeImageURL = (url: string) => {
        setAttributes({ imageURL: url });
    };

    return (
        <section {...blockProps}>
            <CsekBlockHeading>Csek Left-Right Block</CsekBlockHeading>

            <div className="flex flex-row justify-between gap-4 csek-card">
                <div className="flex flex-col gap-2 csek-card">
                    <CsekSelectDropdown
                        onChange={handleChangeDirection}
                        label="Direction"
                        hint="Left to right is text then image."
                        options={[
                            { value: "right", label: "Right to Left" },
                            { value: "left", label: "Left to Right" },
                        ]}
                        initialValue={leftToRight ? "left" : "right"}
                    />
                    <TextArea label="Body text" onChange={handleChangeText} initialValue={text} />
                    <TextInput label="Image alt text" onChange={handleChangeAltText} initialValue={altText} />
                </div>
                <CsekMediaUpload onChange={handleChangeImageURL} urlAttribute={imageURL} type="image" />
            </div>
        </section>
    );
};

export const LeftRightBlockSave = ({ attributes }: GutenCsekBlockSaveProps<LeftRightBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { text, imageURL, altText, leftToRight } = attributes;

    return (
        <section {...blockProps}>
            <div className={`left-right ${leftToRight ? "" : "reverse"}`}>
                <p>
                    <img src={imageURL} alt={altText} />
                    {text}
                </p>
            </div>
        </section>
    );
};
