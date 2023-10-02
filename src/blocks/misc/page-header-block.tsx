/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import React from "@wordpress/element";
import { GutenbergBlockProps } from "../../scripts/dom";
import { useBlockProps } from "@wordpress/block-editor";
import { Heading } from "../../components/heading";

export const PageHeaderBlockEdit = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps();

    const { heading, slogan } = attributes;

    return (
        <div {...blockProps}>
            <Heading level="2">Csek Page Header Block</Heading>
        </div>
    );
};

export const PageHeaderBlockSave = ({ attributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps.save();
    return <section {...blockProps}></section>;
};
