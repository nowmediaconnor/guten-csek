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
import { RawHTML } from "@wordpress/element";
import { VerticalBar } from "../../components/bar";

export interface NewsletterBlockAttributes {
    heading: string;
    subheading: string;
    message: string;
    buttonText: string;
    buttonLink: string;
    gravityFormId: number;
}

export const NewsletterBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<NewsletterBlockAttributes>) => {
    const { heading, subheading, message, buttonText, buttonLink, gravityFormId } = attributes;

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

    const handleChangeGravityFormId = (v: string) => {
        const id: number = parseInt(v);
        if (isNaN(id)) return;

        setAttributes({ gravityFormId: id });
    };

    return (
        <section>
            <CsekBlockHeading>Csek Newsletter CTA Block</CsekBlockHeading>
            <CsekCard className="flex flex-row gap-2 items-stretch">
                <div className="flex flex-col gap-2 basis-2/3">
                    <TextInput label="Heading" initialValue={heading} onChange={handleChangeHeading} />
                    <TextInput label="Subheading" initialValue={subheading} onChange={handleChangeSubheading} />
                    <RichTextInput label="Message" initialValue={message} onChange={handleChangeMessage} />
                </div>
                <VerticalBar />
                <div className="flex flex-col gap-2 basis-1/3">
                    <TextInput label="Button Text" initialValue={buttonText} onChange={handleChangeButtonText} />
                    <TextInput label="Button Link" initialValue={buttonLink} onChange={handleChangeButtonLink} />
                    <TextInput
                        label="Gravity Form ID"
                        hint="The ID of the Gravity Form that will appear when the user clicks the subscribe button."
                        initialValue={gravityFormId.toString()}
                        onChange={handleChangeGravityFormId}
                    />
                </div>
            </CsekCard>
        </section>
    );
};

export const NewsletterBlockSave = ({ attributes }: GutenCsekBlockSaveProps<NewsletterBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { heading, subheading, message, buttonText, buttonLink, gravityFormId } = attributes;

    return (
        <section {...blockProps}>
            <div className="block-content">
                <div className="cta">
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
                        <RedButton text={buttonText} link={buttonLink} ping={false} className="subscribe-button" />
                    </div>
                </div>
                {gravityFormId > -1 ? (
                    <div className="newsletter-form">
                        <RawHTML>{`[gravityform id="${gravityFormId}" title="false" ajax="true"]`}</RawHTML>
                    </div>
                ) : null}
            </div>
        </section>
    );
};
