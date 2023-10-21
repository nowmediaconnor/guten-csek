/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import React from "@wordpress/element";
import { GutenbergBlockProps } from "../../scripts/dom";
import { useBlockProps } from "@wordpress/block-editor";
import { CsekBlockHeading } from "../../components/heading";
import { TextInput, RichTextInput, RichTextContent } from "../../components/input";

export const PageHeaderBlockEdit = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps();

    const { heading, slogan } = attributes;

    const handleChangeHeading = (v: string) => {
        setAttributes({ heading: v });
    };

    const handleChangeSlogan = (v: string) => {
        setAttributes({ slogan: v });
    };

    return (
        <div {...blockProps}>
            <CsekBlockHeading>Csek Page Header Block</CsekBlockHeading>
            <div className="flex flex-col gap-2 border border-solid border-slate-700 p-2 rounded my-2">
                <TextInput
                    label="Page Heading"
                    placeholder="Enter a page heading."
                    onChange={handleChangeHeading}
                    initialValue={heading}
                />
                <RichTextInput
                    label="Caption"
                    placeholder="A caption for the page heading."
                    onChange={handleChangeSlogan}
                    initialValue={slogan}
                />
            </div>
        </div>
    );
};

export const PageHeaderBlockSave = ({ attributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps.save();

    const { heading, slogan } = attributes;

    return (
        <section {...blockProps}>
            <div className="block-container">
                <img src="/wp-content/plugins/guten-csek/src/img/serif.svg" className="serif" />
                <h1>{heading}</h1>
                <RichTextContent value={slogan} />
            </div>
        </section>
    );
};
