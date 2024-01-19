/*
 * Created on Mon Oct 30 2023
 * Author: Connor Doman
 */

import React from "react";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";
import { CsekBlockHeading } from "../../components/heading";
import CsekCard from "../../components/card";
import { RichTextContent, RichTextInput } from "../../components/input";
import CsekColorPicker from "../../components/color-picker";
import { useBlockProps } from "@wordpress/block-editor";
import Label from "../../components/label";
import { RightArrow } from "../../components/icons";

export interface EmphasizedTextBlockAttributes {
    text: string;
}

export const EmphasizedTextBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<EmphasizedTextBlockAttributes>) => {
    const { text } = attributes;

    const onChange = (value: string) => {
        setAttributes({ text: value });
    };

    return (
        <section className="csek-block bg-white text-black">
            <CsekBlockHeading className="text-csek-dark">Csek Emphasized Text</CsekBlockHeading>
            <Label>
                You can change the text color, background color, font size, and spacing in the Inspector <RightArrow />
            </Label>
            <div className="flex flex-row gap-4 text-base w-full">
                <CsekCard className="w-full">
                    <RichTextInput label="Content" className="" initialValue={text} onChange={onChange} />
                </CsekCard>
            </div>
        </section>
    );
};

export const EmphasizedTextBlockSave = ({ attributes }: GutenCsekBlockSaveProps<EmphasizedTextBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { text } = attributes;

    return (
        <section {...blockProps}>
            <div className="block-content">
                <RichTextContent value={text} className="leading-[1.1]" />
            </div>
        </section>
    );
};
