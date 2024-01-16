/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import React from "@wordpress/element";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps, GutenbergBlockProps } from "../../scripts/dom";
import { useBlockProps } from "@wordpress/block-editor";
import { Heading } from "../../components/heading";
import { TextArea, TextInput } from "../../components/input";
import { Button } from "@wordpress/components";
import { CsekAddButton, CsekDeleteButton } from "../../components/button";
import { CsekBlockHeading } from "../../components/heading";
import CsekCard from "../../components/card";

const NUMBER_OF_FIRES = 4;

export interface ChicagoFiresBlockAttributes {
    primaryHeading: string;
    primaryMessage: string;
    secondaryHeadings: string[];
    secondaryMessages: string[];
}

interface ChicagoFireProps {
    heading: string;
    message: string;
    index: number;
    onChangeHeading: (v: string) => void;
    onChangeMessage: (v: string) => void;
    onDelete: (index: number) => void;
}

const ChicagoFireEditor = ({
    heading,
    message,
    index,
    onChangeHeading,
    onChangeMessage,
    onDelete,
}: ChicagoFireProps): JSX.Element => {
    const handleDelete = () => {
        onDelete(index);
    };

    return (
        <CsekCard className="flex flex-col gap-2 p-2">
            <Heading level="3">Column {index + 1}</Heading>
            <TextInput
                label="Heading"
                placeholder="Enter a heading."
                initialValue={heading}
                onChange={onChangeHeading}
            />
            <TextArea
                label="Message"
                placeholder="Enter a message."
                initialValue={message}
                onChange={onChangeMessage}
            />
            <CsekDeleteButton onDelete={handleDelete} className="absolute right-2 top-2" />
        </CsekCard>
    );
};

export const ChicagoFiresBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<ChicagoFiresBlockAttributes>) => {
    const blockProps = useBlockProps();

    const { primaryHeading, primaryMessage, secondaryHeadings, secondaryMessages } = attributes;

    const handleChangePrimaryHeading = (v: string) => {
        setAttributes({ primaryHeading: v });
    };

    const handleChangePrimaryMessage = (v: string) => {
        setAttributes({ primaryMessage: v });
    };

    const handleChangeSecondaryHeading = (v: string, index: number) => {
        const newSecondaryHeadings = [...secondaryHeadings];
        newSecondaryHeadings[index] = v;
        setAttributes({ secondaryHeadings: newSecondaryHeadings });
    };

    const handleChangeSecondaryMessage = (v: string, index: number) => {
        const newSecondaryMessages = [...secondaryMessages];
        newSecondaryMessages[index] = v;
        setAttributes({ secondaryMessages: newSecondaryMessages });
    };

    const deleteSecondaryHeading = (index: number) => {
        const newSecondaryHeadings = [...secondaryHeadings];
        newSecondaryHeadings.splice(index, 1);
        setAttributes({ secondaryHeadings: newSecondaryHeadings });
    };

    const deleteSecondaryMessage = (index: number) => {
        const newSecondaryMessages = [...secondaryMessages];
        newSecondaryMessages.splice(index, 1);
        setAttributes({ secondaryMessages: newSecondaryMessages });
    };

    const deleteFire = (index: number) => {
        deleteSecondaryHeading(index);
        deleteSecondaryMessage(index);
    };

    const newSecondaryHeading = () => {
        const newSecondaryHeadings = [...secondaryHeadings];
        newSecondaryHeadings.push("");
        setAttributes({ secondaryHeadings: newSecondaryHeadings });
    };

    const newSecondaryMessage = () => {
        const newSecondaryMessages = [...secondaryMessages];
        newSecondaryMessages.push("");
        setAttributes({ secondaryMessages: newSecondaryMessages });
    };

    const newFire = () => {
        if (secondaryHeadings.length < NUMBER_OF_FIRES) {
            newSecondaryHeading();
            newSecondaryMessage();
        }
    };

    const fires: JSX.Element[] = secondaryHeadings.map((_, i: number) => {
        return (
            <ChicagoFireEditor
                heading={secondaryHeadings[i]}
                message={secondaryMessages[i]}
                index={i}
                onChangeHeading={(v) => handleChangeSecondaryHeading(v, i)}
                onChangeMessage={(v) => handleChangeSecondaryMessage(v, i)}
                onDelete={deleteFire}
            />
        );
    });

    return (
        <div {...blockProps}>
            <CsekBlockHeading>Csek Chicago Fires Block</CsekBlockHeading>
            <CsekCard>
                <p className="text-sm">
                    The flag of Chicago famously contains 4 stars, each representing one of the city&apos;s great fires.
                    This block evokes that image using 4 statements meant to represent significant influences on company
                    culture.
                </p>
                <div className="flex flex-col gap-4 pt-2">
                    <TextInput
                        label="Primary Heading"
                        placeholder="Enter a heading."
                        onChange={handleChangePrimaryHeading}
                        initialValue={primaryHeading}
                    />
                    <TextInput
                        label="Primary Message"
                        placeholder="Enter a message."
                        onChange={handleChangePrimaryMessage}
                        initialValue={primaryMessage}
                    />
                    {fires}
                    <CsekAddButton label="Add column" onAdd={newFire} />
                </div>
            </CsekCard>
        </div>
    );
};
export const ChicagoFiresBlockSave = ({ attributes }: GutenCsekBlockSaveProps<ChicagoFiresBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { secondaryHeadings, secondaryMessages, primaryHeading, primaryMessage } = attributes;

    const fires: JSX.Element[] = secondaryHeadings.map((_, i: number) => {
        return (
            <div className="secondary-text">
                <h3>{secondaryHeadings[i]}</h3>
                <p>{secondaryMessages[i]}</p>
            </div>
        );
    });

    return (
        <section {...blockProps}>
            <div className="block-container">
                <div className="primary-text">
                    <h2>{primaryHeading}</h2>
                    {primaryMessage ? <p>{primaryMessage}</p> : null}
                </div>
                <div className="fires">{fires}</div>
            </div>
        </section>
    );
};
