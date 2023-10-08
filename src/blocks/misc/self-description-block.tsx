/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import React from "react";
import { Heading } from "../../components/heading";
import { GutenCsekBlockProps, GutenbergBlockProps } from "../../scripts/dom";
import { useBlockProps } from "@wordpress/block-editor";
import { RichTextInput, TextInput } from "../../components/input";
import { CsekMediaUpload } from "../../components/media-upload";
import { CsekAddButton, CsekDeleteButton } from "../../components/button";

export interface SelfDescriptionBlockAttributes {
    heading: string;
    caption: string;
    primaryImageURL: string;
    secondaryImageURL: string;
    factHeaders: string[];
    factDescriptions: string[];
}

export const SelfDescriptionBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockProps<SelfDescriptionBlockAttributes>) => {
    const blockProps = useBlockProps();

    const { heading, caption, primaryImageURL, secondaryImageURL, factHeaders, factDescriptions } = attributes;

    const handleChangeHeading = (v: string) => {
        setAttributes({ heading: v });
    };

    const handleChangeCaption = (v: string) => {
        setAttributes({ caption: v });
    };

    const handleChangePrimaryImageURL = (v: string) => {
        setAttributes({ primaryImageURL: v });
    };

    const handleChangeSecondaryImageURL = (v: string) => {
        setAttributes({ secondaryImageURL: v });
    };

    const handleChangeFactHeader = (v: string, i: number) => {
        const newFactHeaders = [...factHeaders];
        newFactHeaders[i] = v;
        setAttributes({ factHeaders: newFactHeaders });
    };

    const handleChangeFactDescription = (v: string, i: number) => {
        const newFactDescriptions = [...factDescriptions];
        newFactDescriptions[i] = v;
        setAttributes({ factDescriptions: newFactDescriptions });
    };

    const newFactHeader = () => {
        const newFactHeaders = [...factHeaders];
        newFactHeaders.push("");
        setAttributes({ factHeaders: newFactHeaders });
    };

    const newFactDescription = () => {
        const newFactDescriptions = [...factDescriptions];
        newFactDescriptions.push("");
        setAttributes({ factDescriptions: newFactDescriptions });
    };

    const newFactEntry = () => {
        newFactHeader();
        newFactDescription();
    };

    const deleteFactEntry = (i: number) => {
        const newFactHeaders = [...factHeaders];
        const newFactDescriptions = [...factDescriptions];
        newFactHeaders.splice(i, 1);
        newFactDescriptions.splice(i, 1);
        setAttributes({ factHeaders: newFactHeaders, factDescriptions: newFactDescriptions });
    };

    const factEntries = factHeaders.map((_, i) => {
        const headerText = factHeaders[i];
        const descriptionText = factDescriptions[i];

        const handleDelete = () => {
            deleteFactEntry(i);
        };

        return (
            <div className="flex flex-row gap-2 justify-between items-end">
                <TextInput
                    label="Fact Header"
                    placeholder="Enter a fact header."
                    onChange={(v) => handleChangeFactHeader(v, i)}
                    initialValue={headerText}
                    className="basis-2/5"
                />
                <TextInput
                    label="Fact Description"
                    placeholder="Enter a fact description."
                    onChange={(v) => handleChangeFactDescription(v, i)}
                    initialValue={descriptionText}
                    className="basis-2/5"
                />
                <CsekDeleteButton className="basis-1/5" onDelete={handleDelete} />
            </div>
        );
    });

    const separatedFactEntries = factEntries.map((entry: JSX.Element, index: number) => {
        return (
            <>
                {entry}
                {index < factEntries.length - 1 ? <hr className="border border-solid border-slate-700" /> : null}
            </>
        );
    });

    return (
        <div {...blockProps}>
            <Heading level="2">Csek Self Description Block</Heading>
            <div className="flex flex-row gap-2 border border-solid border-slate-700 p-2 rounded my-2">
                <div className="flex flex-col gap-2 w-1/2">
                    <TextInput
                        label="Primary Heading"
                        placeholder="Enter a primary heading."
                        onChange={handleChangeHeading}
                        initialValue={heading}
                    />
                    <TextInput
                        label="Caption"
                        placeholder="A caption for this self description."
                        onChange={handleChangeCaption}
                        initialValue={caption}
                    />
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                    <div>
                        <Heading level="4">Primary Image</Heading>
                        <CsekMediaUpload
                            type="image"
                            onChange={handleChangePrimaryImageURL}
                            urlAttribute={primaryImageURL}
                        />
                    </div>
                    <div>
                        <Heading level="4">Secondary Image</Heading>
                        <CsekMediaUpload
                            type="image"
                            onChange={handleChangeSecondaryImageURL}
                            urlAttribute={secondaryImageURL}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 border border-solid border-slate-700 p-2 rounded my-2">
                <Heading level="3">Facts</Heading>
                {separatedFactEntries}
            </div>
            <CsekAddButton onAdd={newFactEntry} />
        </div>
    );
};

export const SelfDescriptionBlockSave = ({ attributes }: GutenCsekBlockProps<SelfDescriptionBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { heading, caption, primaryImageURL, secondaryImageURL, factHeaders, factDescriptions } = attributes;

    const factEntries = factHeaders.map((_, i) => {
        const headerText = factHeaders[i];
        const descriptionText = factDescriptions[i];

        return (
            <div className="fact-entry">
                <h2>{headerText}</h2>
                <p>{descriptionText}</p>
            </div>
        );
    });

    return (
        <section {...blockProps}>
            <div className="block-container">
                <div className="left-right-area">
                    <div className="left-content">
                        <img className="primary-image" src={primaryImageURL} />
                    </div>
                    <div className="right-content">
                        <div className="desc-masthead">
                            <h2>{heading}</h2>
                            <img className="serif" src="/wp-content/plugins/guten-csek/src/img/serif.svg" />
                        </div>
                        <p>{caption}</p>
                        <img className="secondary-image" src={secondaryImageURL} />
                    </div>
                </div>
                <div className="facts-list">{factEntries}</div>
            </div>
        </section>
    );
};
