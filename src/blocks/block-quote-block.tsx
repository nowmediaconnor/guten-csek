/*
 * Created on Mon Aug 14 2023
 * Author: Connor Doman
 */

import React from "react";

interface BlockQuoteProps {
    attributes: any;
    setAttributes?: any;
}

export const BlockQuoteEdit = ({ attributes, setAttributes }: BlockQuoteProps) => {
    const { heading, quote, author, authorRole } = attributes;

    const setHeading = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ heading: e.target.value });
    };
    const setQuote = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAttributes({ quote: e.target.value });
    };
    const setAuthor = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ author: e.target.value });
    };
    const setAuthorRole = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ authorRole: e.target.value });
    };

    return (
        <div className="flex flex-col w-full gap-4">
            <h2>Blockquote</h2>
            <input type="text" placeholder="Heading" value={heading} onChange={setHeading} />
            <textarea placeholder="Quote" value={quote} onChange={setQuote} />
            <input type="text" placeholder="Author" value={author} onChange={setAuthor} />
            <input type="text" placeholder="Author's Role (Optional)" value={authorRole} onChange={setAuthorRole} />
        </div>
    );
};

export const BlockQuoteSave = ({ attributes }: BlockQuoteProps) => {
    const { heading, quote, author, authorRole } = attributes;

    return (
        <div>
            <div className="quote-area">
                <h2>{heading}</h2>
                <div className="quote">
                    <blockquote>“{quote}”</blockquote>
                    <div className="byline">
                        <p className="author">{author}</p>
                        {authorRole && <p className="author-role">{authorRole}</p>}
                    </div>
                </div>
                <img className="serif" src="/wp-content/plugins/guten-csek/src/img/serif.svg" />
            </div>
        </div>
    );
};
