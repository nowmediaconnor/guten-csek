/*
 * Created on Mon Oct 16 2023
 * Author: Connor Doman
 */

import React from "react";
import { CsekBlockHeading } from "../../components/heading";
import { useBlockProps } from "@wordpress/block-editor";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";
import { TextInput } from "../../components/input";
import { CsekMediaUpload } from "../../components/media-upload";

export interface LetsTalkBlockAttributes {
    heading: string;
    buttonText: string;
    imageURL: string;
}

export const LetsTalkBlockEdit = ({ attributes, setAttributes }: GutenCsekBlockEditProps<LetsTalkBlockAttributes>) => {
    const blockProps = useBlockProps();

    const { heading, buttonText, imageURL } = attributes;

    const setHeading = (v: string) => {
        setAttributes({ heading: v });
    };

    const setButtonText = (v: string) => {
        setAttributes({ buttonText: v });
    };

    const setImageURL = (v: string) => {
        setAttributes({ imageURL: v });
    };

    return (
        <div {...blockProps}>
            <CsekBlockHeading>Csek Let's Talk Block (CTA)</CsekBlockHeading>
            <TextInput label="Heading" placeholder="Want to learn more?" initialValue={heading} onChange={setHeading} />
            <TextInput
                label="Button Text"
                placeholder="Let's Talk"
                initialValue={buttonText}
                onChange={setButtonText}
            />
            <CsekMediaUpload urlAttribute={imageURL} onChange={setImageURL} />
        </div>
    );
};

export const LetsTalkBlockSave = ({ attributes }: GutenCsekBlockSaveProps<LetsTalkBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { heading, buttonText, imageURL } = attributes;

    return (
        <section {...blockProps}>
            <div className="block-content">
                <h2 className="cta-heading">{heading}</h2>
                <a className="lets-talk-open" href="#letstalk">
                    <span className="absolute">{buttonText}</span>
                </a>
                <img className="cta-image" src={imageURL} />
            </div>
        </section>
    );
};
