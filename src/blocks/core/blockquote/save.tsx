/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import { useBlockProps } from "@wordpress/block-editor";
import React from "react";
import { GutenCsekBlockSaveProps } from "../../../js/guten-csek";
import { BlockquoteBlockAttributes } from ".";

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
