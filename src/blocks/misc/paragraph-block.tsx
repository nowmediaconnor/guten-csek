/*
 * Created on Mon Oct 30 2023
 * Author: Connor Doman
 */

import React from "react";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";
import { CsekBlockHeading } from "../../components/heading";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { RichTextContent, RichTextInput } from "../../components/input";
import Label from "../../components/label";

export interface ParagraphBlockAttributes {
    text: string;
}

export const ParagraphBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<ParagraphBlockAttributes>) => {
    const { text } = attributes;

    const onChange = (value: string) => {
        setAttributes({ text: value });
    };

    return (
        <div className="csek-block">
            <CsekBlockHeading>Csek Paragraph</CsekBlockHeading>
            <Label>
                You can edit this component&apos;s padding in the inspector <i className="fa fa-arrow-right"></i>
            </Label>
            <RichTextInput label="Content" initialValue={text} onChange={onChange} />
        </div>
    );
};

export const ParagraphBlockSave = ({ attributes }: GutenCsekBlockSaveProps<ParagraphBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { text } = attributes;

    return (
        <section {...blockProps}>
            <div className="block-content">
                <RichTextContent value={text} />
            </div>
        </section>
    );
};
