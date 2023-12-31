/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import React from "@wordpress/element";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps, GutenbergBlockProps } from "../../scripts/dom";
import { useBlockProps } from "@wordpress/block-editor";
import { CsekBlockHeading } from "../../components/heading";
import { Label } from "../../components/label";
import { TextInput, RichTextInput, RichTextContent, CheckboxInput } from "../../components/input";
import CsekCard from "../../components/card";
import { InnerBlockEdit, InnerBlockSave } from "../../components/innerblock";

export interface PageHeaderBlockAttributes {
    heading: string;
    subheading: string;
    featuredText: string;
    usesInnerBlock: boolean;
}

export const PageHeaderBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<PageHeaderBlockAttributes>) => {
    const blockProps = useBlockProps();

    const { heading, subheading, featuredText, usesInnerBlock } = attributes;

    const handleChangeHeading = (v: string) => {
        setAttributes({ heading: v });
    };

    const handleChangeSubheading = (v: string) => {
        setAttributes({ subheading: v });
    };

    const handleChangeFeaturedText = (v: string) => {
        setAttributes({ featuredText: v });
    };

    const handleChangeUsesInnerBlock = (v: boolean) => {
        setAttributes({ usesInnerBlock: v });
    };

    return (
        <div {...blockProps}>
            <CsekBlockHeading>Csek Page Header Block</CsekBlockHeading>
            <CsekCard className="flex flex-col gap-2 border border-solid border-slate-700 p-2 rounded my-2">
                <TextInput
                    label="Page Heading"
                    placeholder="Enter a page heading."
                    onChange={handleChangeHeading}
                    initialValue={heading}
                />
                <TextInput
                    label="Subheading"
                    placeholder="Enter a subheading."
                    onChange={handleChangeSubheading}
                    initialValue={subheading}
                />
                <CheckboxInput
                    label="Use inner block for featured content?"
                    onChange={handleChangeUsesInnerBlock}
                    initialValue={usesInnerBlock}
                />
                <Label em>The inner block will be shown below the subheader</Label>
                {usesInnerBlock ? (
                    <InnerBlockEdit blockProps={blockProps} />
                ) : (
                    <RichTextInput
                        label="Caption"
                        placeholder="A caption for the page heading."
                        onChange={handleChangeFeaturedText}
                        initialValue={featuredText}
                    />
                )}
            </CsekCard>
        </div>
    );
};

export const PageHeaderBlockSave = ({ attributes }: GutenCsekBlockSaveProps<PageHeaderBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { heading, subheading, featuredText, usesInnerBlock } = attributes;

    return (
        <section {...blockProps}>
            <div className="block-container">
                <img src="/wp-content/plugins/guten-csek/src/img/serif.svg" className="serif" />
                <h1>{heading}</h1>
                <h2>{subheading}</h2>
                <div className="subheader">
                    {usesInnerBlock ? (
                        <InnerBlockSave blockProps={blockProps} />
                    ) : (
                        <RichTextContent value={featuredText} />
                    )}
                </div>
            </div>
        </section>
    );
};
