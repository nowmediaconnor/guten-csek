/*
 * Created on Mon Oct 30 2023
 * Author: Connor Doman
 */

import React from "react";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";
import { CsekBlockHeading } from "../../components/heading";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { RichTextContent, RichTextInput } from "../../components/input";
import CsekPaddingSelector, { Padding, defaultPadding, styleFromPadding } from "../../components/padding-selector";
import Label from "../../components/label";

export interface ParagraphBlockAttributes {
    text: string;
    padding: Padding;
}

export const defaultParahraphBlockPadding: Padding = {
    unit: "rem",
    top: 3,
    right: 0,
    bottom: 3,
    left: 0,
};

export const ParagraphBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<ParagraphBlockAttributes>) => {
    const { text, padding } = attributes;

    const onChange = (value: string) => {
        setAttributes({ text: value });
    };

    const handleChangePadding = (padding: Padding) => {
        setAttributes({ padding });
    };

    return (
        <div className="csek-block">
            <InspectorControls>
                <CsekPaddingSelector onChange={handleChangePadding} padding={padding} />
            </InspectorControls>
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

    const { text, padding } = attributes;

    const p = styleFromPadding(padding ?? defaultPadding);

    return (
        <section {...blockProps}>
            <div className="block-content">
                <RichTextContent value={text} style={p} />
            </div>
        </section>
    );
};
