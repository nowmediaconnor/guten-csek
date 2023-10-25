/*
 * Created on Mon Aug 14 2023
 * Author: Connor Doman
 */

import React from "react";
import { CsekBlockHeading } from "../components/heading";
import { TextArea, TextInput } from "../components/input";
import { useBlockProps } from "@wordpress/block-editor";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../scripts/dom";

export interface BlockquoteBlockAttributes {
    heading: string;
    quote: string;
    author: string;
    authorRole: string;
}

export const BlockquoteBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<BlockquoteBlockAttributes>) => {
    const blockProps = useBlockProps();

    const { heading, quote, author, authorRole } = attributes;

    const setHeading = (value: string) => {
        setAttributes({ heading: value });
    };
    const setQuote = (value: string) => {
        setAttributes({ quote: value });
    };
    const setAuthor = (value: string) => {
        setAttributes({ author: value });
    };
    const setAuthorRole = (value: string) => {
        setAttributes({ authorRole: value });
    };

    return (
        <div {...blockProps} className="csek-block">
            <CsekBlockHeading>Csek Blockquote Block</CsekBlockHeading>
            <TextInput placeholder="Heading" label="Heading" initialValue={heading} onChange={setHeading} />
            <TextArea placeholder="Quote" label="Quote" initialValue={quote} onChange={setQuote} />
            <TextInput placeholder="Author" label="Author" initialValue={author} onChange={setAuthor} />
            <TextInput
                placeholder="Author's Role (Optional)"
                label="Author's Role"
                initialValue={authorRole}
                onChange={setAuthorRole}
            />
        </div>
    );
};

export const BlockquoteBlockSave = ({ attributes }: GutenCsekBlockSaveProps<BlockquoteBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { heading, quote, author, authorRole } = attributes;

    return (
        <section {...blockProps}>
            <div className="quote-area">
                <h2 className="block-title">{heading}</h2>
                <div className="quote">
                    <blockquote>“{quote}”</blockquote>
                    <div className="byline">
                        <p className="author">{author}</p>
                        {authorRole && <p className="author-role">{authorRole}</p>}
                    </div>
                </div>
                <img className="serif" src="/wp-content/plugins/guten-csek/src/img/serif-light.svg" />
            </div>
        </section>
    );
};
