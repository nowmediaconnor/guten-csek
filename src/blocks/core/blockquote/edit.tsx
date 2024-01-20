/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import { useBlockProps } from "@wordpress/block-editor";
import React from "react";
import { GutenCsekBlockEditProps } from "../../../js/scripts/dom";
import { CsekBlockHeading } from "../../../components/heading";
import { TextArea, TextInput } from "../../../components/input";
import { BlockquoteBlockAttributes } from ".";

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
