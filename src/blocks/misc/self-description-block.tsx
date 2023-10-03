/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import React from "react";
import { Heading } from "../../components/heading";
import { GutenbergBlockProps } from "../../scripts/dom";
import { useBlockProps } from "@wordpress/block-editor";
import { RichTextInput, TextInput } from "../../components/input";

export const SelfDescriptionBlockEdit = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps();

    const { heading, caption, primaryImageURL, secondaryImageURL } = attributes;

    const handleChangeHeading = (v: string) => {
        setAttributes({ heading: v });
    };

    const handleChangeCaption = (v: string) => {
        setAttributes({ caption: v });
    };

    return (
        <div {...blockProps}>
            <Heading level="2">Csek Self Description Block</Heading>
            <div className="flex flex-col gap-2 border border-solid border-slate-700 p-2 rounded my-2">
                <TextInput
                    label="Page Heading"
                    placeholder="Enter a page heading."
                    onChange={handleChangeHeading}
                    initialValue={heading}
                />
                <RichTextInput
                    label="Caption"
                    placeholder="A caption for this self description."
                    onChange={handleChangeCaption}
                    initialValue={caption}
                />
            </div>
        </div>
    );
};

export const SelfDescriptionBlockSave = ({ attributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps.save();

    const { heading, caption, primaryImageURL, secondaryImageURL } = attributes;

    return (
        <section {...blockProps}>
            <div className="block-container">
                <div className="left-right-area">
                    <div className="left-content">
                        <img src={primaryImageURL} />
                    </div>
                    <div className="right-content">
                        <img src="/wp-content/plugins/guten-csek/src/img/serif.svg" className="serif" />
                        <h1>{heading}</h1>
                        <p>{caption}</p>
                        <img src={secondaryImageURL} />
                    </div>
                </div>
                <div className="facts-list">{/* Here's where a list of facts go. */}</div>
            </div>
        </section>
    );
};
