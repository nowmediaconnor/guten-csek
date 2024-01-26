/*
 * Created on Thu Jan 25 2024
 * Author: Connor Doman
 */

import React from "react";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";
import { useBlockProps } from "@wordpress/block-editor";
import { CsekBlockHeading } from "../../components/heading";
import CsekCard from "../../components/card";
import { RichTextContent, RichTextInput, TextInput } from "../../components/input";
import { RedButton } from "../../components/red-button";

export interface NewsletterBlockAttributes {
    heading: string;
    subheading: string;
    message: string;
    buttonText: string;
    buttonLink: string;
}

export const NewsletterBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<NewsletterBlockAttributes>) => {
    const { heading, subheading, message, buttonText, buttonLink } = attributes;

    const handleChangeHeading = (v: string) => {
        setAttributes({ heading: v });
    };

    const handleChangeSubheading = (v: string) => {
        setAttributes({ subheading: v });
    };

    const handleChangeMessage = (v: string) => {
        setAttributes({ message: v });
    };

    const handleChangeButtonText = (v: string) => {
        setAttributes({ buttonText: v });
    };

    const handleChangeButtonLink = (v: string) => {
        setAttributes({ buttonLink: v });
    };

    return (
        <section>
            <CsekBlockHeading>Csek Newsletter CTA Block</CsekBlockHeading>
            <CsekCard className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <TextInput label="Heading" initialValue={heading} onChange={handleChangeHeading} />
                    <TextInput label="Subheading" initialValue={subheading} onChange={handleChangeSubheading} />
                    <RichTextInput label="Message" initialValue={message} onChange={handleChangeMessage} />
                </div>
                <div className="flex flex-col gap-2">
                    <TextInput label="Button Text" initialValue={buttonText} onChange={handleChangeButtonText} />
                    <TextInput label="Button Link" initialValue={buttonLink} onChange={handleChangeButtonLink} />
                </div>
            </CsekCard>
        </section>
    );
};

export const NewsletterBlockSave = ({ attributes }: GutenCsekBlockSaveProps<NewsletterBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { heading, subheading, message, buttonText, buttonLink } = attributes;

    return (
        <section {...blockProps}>
            <div className="block-content">
                <div className="text-content">
                    <h2>{heading}</h2>
                    <span>{subheading}</span>
                    <RichTextContent value={message} />
                </div>
                <div className="visual-content">
                    <img
                        src="/wp-content/plugins/guten-csek/src/img/envelope.svg"
                        alt="A stock photo of a closed envelope hovering at a -30 angle over a transparent background."
                    />
                    <RedButton text={buttonText} link={buttonLink} />
                </div>
            </div>
        </section>
    );
};
