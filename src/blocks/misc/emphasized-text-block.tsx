/*
 * Created on Mon Oct 30 2023
 * Author: Connor Doman
 */

import React from "react";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";
import { CsekBlockHeading } from "../../components/heading";
import CsekCard from "../../components/card";
import { RichTextInput } from "../../components/input";
import CsekColorPicker from "../../components/color-picker";
import { useBlockProps } from "@wordpress/block-editor";

export interface EmphasizedTextBlockAttributes {
    text: string;
    color: string;
    backgroundColor: string;
}

export const EmphasizedTextBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<EmphasizedTextBlockAttributes>) => {
    const { text, color, backgroundColor } = attributes;

    const onChange = (value: string) => {
        setAttributes({ text: value });
    };

    const onChangeColor = (value: string) => {
        setAttributes({ color: value });
    };

    const onChangeBackgroundColor = (value: string) => {
        setAttributes({ backgroundColor: value });
    };

    return (
        <div className="csek-block">
            <CsekBlockHeading>Csek Emphasized Text</CsekBlockHeading>
            <div className="flex flex-row gap-4">
                <CsekCard className="w-full">
                    <RichTextInput label="Content" className="" initialValue={text} onChange={onChange} />
                </CsekCard>
                <CsekColorPicker label="Text Color" initialValue={color} onChange={onChangeColor} />
                <CsekColorPicker label="Background Color" initialValue={color} onChange={onChangeBackgroundColor} />
            </div>
        </div>
    );
};

export const EmphasizedTextBlockSave = ({ attributes }: GutenCsekBlockSaveProps<EmphasizedTextBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { text, color, backgroundColor } = attributes;

    return (
        <section {...blockProps} style={{ backgroundColor: backgroundColor }}>
            <div className="block-content">
                <p style={{ color: color }}>{text}</p>
            </div>
        </section>
    );
};
