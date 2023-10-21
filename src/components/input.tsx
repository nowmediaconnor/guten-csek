/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import React, { useState } from "react";
import { Heading } from "./heading";
import { RichText } from "@wordpress/block-editor";
import { twMerge } from "tailwind-merge";

interface InputProps {
    label?: string;
    initialValue?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    onChange?: (v: string) => void;
}

export const TextInput = ({ label, initialValue = "", placeholder, className, disabled, onChange }: InputProps) => {
    const [text, setText] = useState<string>(initialValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value as string;
        setText(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className={twMerge("w-full", className)}>
            {label ? <Heading level="4">{label}</Heading> : null}
            <input
                type="text"
                className={twMerge(
                    "w-full rounded border border-solid border-slate-700 px-2 py-1 text-lg",
                    "csek-input",
                    label ? "mt-2" : ""
                )}
                placeholder={placeholder}
                onChange={handleChange}
                value={text}
                disabled={disabled}
            />
        </div>
    );
};

export const RichTextInput = ({ label, initialValue = "", placeholder, onChange }: InputProps) => {
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
            <RichText
                tagName="div"
                className="csek-card"
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
    return <RichText.Content className={className ? className : "csek-richtext"} tagName="div" value={value} />;
};

interface CheckboxInputProps {
    label: string;
    initialValue?: boolean;
    onChange?: (v: boolean) => void;
}

export const CheckboxInput = ({ label, initialValue = false, onChange }: CheckboxInputProps) => {
    const [checked, setChecked] = useState(initialValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked as boolean;
        setChecked(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className="flex flex-row justify-start items-center">
            <input type="checkbox" checked={checked} onChange={handleChange} />
            <Heading level="4">{label}</Heading>
        </div>
    );
};

interface TextAreaProps {
    label?: string;
    initialValue?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    onChange?: (v: string) => void;
}

export const TextArea = ({ label, initialValue = "", placeholder, className, disabled, onChange }: TextAreaProps) => {
    const [text, setText] = useState<string>(initialValue);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value as string;
        setText(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className={twMerge("w-full", className)}>
            {label ? <Heading level="4">{label}</Heading> : null}
            <textarea
                className={twMerge(
                    "w-full h-40 rounded border border-solid border-slate-700 px-2 py-1 text-lg",
                    "csek-input",
                    label ? "mt-2" : ""
                )}
                placeholder={placeholder}
                onChange={handleChange}
                value={text}
                disabled={disabled}
            />
        </div>
    );
};
