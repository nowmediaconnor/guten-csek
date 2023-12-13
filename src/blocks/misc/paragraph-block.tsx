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

export interface ParagraphBlockAttributes {
    text: string;
    padding: Padding;
}

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
            <RichTextInput label="Content" initialValue={text} onChange={onChange} />
        </div>
    );
};

export const ParagraphBlockSave = ({ attributes }: GutenCsekBlockSaveProps<ParagraphBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { text, padding } = attributes;

    const p = styleFromPadding(padding ?? defaultPadding);

    return (
        <section {...blockProps} style={p}>
            <div className="block-content">
                <RichTextContent value={text} />
            </div>
        </section>
    );
};
