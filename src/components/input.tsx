/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import React, { useState } from "react";
import { Heading } from "./heading";
import { RichText as GutenbergRichText } from "@wordpress/block-editor";

interface InputProps {
    label: string;
    initialValue?: string;
    placeholder?: string;
    onChange?: (v: string) => void;
}

export const TextInput = ({ label, initialValue = "", placeholder, onChange }: InputProps) => {
    const [text, setText] = useState<string>(initialValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value as string;
        setText(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <>
            {label ? <Heading level="4">{label}</Heading> : null}
            <input
                type="text"
                className="w-full rounded border border-solid border-slate-700 px-2 py-1 text-lg"
                placeholder={placeholder}
                onChange={handleChange}
                value={text}
            />
        </>
    );
};

export const RichText = ({ label, initialValue = "", placeholder, onChange }: InputProps) => {
    const [text, setText] = useState(initialValue);

    const handleChange = (v: string) => {
        setText(v);
        if (onChange) {
            onChange(v);
        }
    };

    return (
        <>
            <Heading level="4">{label}</Heading>
            <em className="italic text-sm text-slate-500">Rich text</em>
            <GutenbergRichText
                tagName="div"
                className="w-full p-2 border border-solid rounded border-slate-700"
                placeholder={placeholder || "Enter text here."}
                label={label}
                value={text}
                onChange={handleChange}
            />
        </>
    );
};

interface RichTextContentProps {
    value: string;
    className?: string;
}

export const RichTextContent = ({ value, className }: RichTextContentProps) => {
    return (
        <GutenbergRichText.Content className={className ? className : "csek-richtext"} tagName="div" value={value} />
    );
};
