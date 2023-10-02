/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import React from "@wordpress/element";
import { GutenbergBlockProps } from "../../scripts/dom";
import { useBlockProps } from "@wordpress/block-editor";
import { Heading } from "../../components/heading";
import { TextInput } from "../../components/input";

const NUMBER_OF_FIRES = 4;

interface ChicagoFireProps {
    heading: string;
    message: string;
    index: number;
    onChangeHeading: (v: string) => void;
    onChangeMessage: (v: string) => void;
}

const ChicagoFireEditor = ({ heading, message, index }: ChicagoFireProps): JSX.Element => {
    return (
        <div className="flex flex-col gap-2 border border-solid border-slate-700 p-2 rounded my-2">
            <Heading level="3">{index + 1}</Heading>
            <TextInput label="Heading" placeholder="Enter a heading." initialValue={heading} />
            <TextInput label="Message" placeholder="Enter a message." initialValue={message} />
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
        newSecondaryHeading();
        newSecondaryMessage();
    };

    const fires: JSX.Element[] = secondaryHeadings.map((_: void, i: number) => {
        return (
            <ChicagoFireEditor
                heading={secondaryHeadings[i]}
                message={secondaryMessages[i]}
                index={i}
                onChangeHeading={(v) => handleChangeSecondaryHeading(v, i)}
                onChangeMessage={(v) => handleChangeSecondaryMessage(v, i)}
            />
        );
    });

    return (
        <div {...blockProps}>
            <Heading level="2">Chicago Fires Block</Heading>
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
        </div>
    );
};
export const ChicagoFiresBlockSave = ({ attributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps.save();

    return <section {...blockProps}></section>;
};
