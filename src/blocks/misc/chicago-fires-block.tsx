/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import React from "@wordpress/element";
import { GutenbergBlockProps } from "../../scripts/dom";
import { useBlockProps } from "@wordpress/block-editor";
import { Heading } from "../../components/heading";
import { TextInput } from "../../components/input";
import { Button } from "@wordpress/components";
import { CsekAddButton, CsekDeleteButton } from "../../components/button";

const NUMBER_OF_FIRES = 4;

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
        <div className="flex flex-col gap-2 border border-solid border-slate-700 p-2 rounded my-2 relative">
            <Heading level="3">Column {index + 1}</Heading>
            <TextInput
                label="Heading"
                placeholder="Enter a heading."
                initialValue={heading}
                onChange={onChangeHeading}
            />
            <TextInput
                label="Message"
                placeholder="Enter a message."
                initialValue={message}
                onChange={onChangeMessage}
            />
            {/* <Button
                onClick={handleDelete}
                className="border border-solid color-red-600 p-2 absolute right-2 top-2"
                icon="trash">
                Delete
            </Button> */}
            <CsekDeleteButton onDelete={handleDelete} className="absolute right-2 top-2" />
        </div>
    );
};

export const ChicagoFiresBlockEdit = ({ attributes, setAttributes }: GutenbergBlockProps) => {
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

    const fires: JSX.Element[] = secondaryHeadings.map((_: void, i: number) => {
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
            <Heading level="2">Csek Chicago Fires Block</Heading>
            <div className="flex flex-col gap-2 py-2">
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
        </div>
    );
};
export const ChicagoFiresBlockSave = ({ attributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps.save();

    const { secondaryHeadings, secondaryMessages, primaryHeading, primaryMessage } = attributes;

    const fires: JSX.Element[] = secondaryHeadings.map((_: void, i: number) => {
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
                    <p>{primaryMessage}</p>
                </div>
                <div className="fires">{fires}</div>
            </div>
        </section>
    );
};
