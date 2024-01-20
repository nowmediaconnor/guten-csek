/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import { useBlockProps } from "@wordpress/block-editor";
import React from "react";
import { GutenCsekBlockSaveProps } from "../../../js/guten-csek";
import { ProcessBlockAttributes, ProcessStep } from ".";

export const ProcessBlockSave = ({ attributes }: GutenCsekBlockSaveProps<ProcessBlockAttributes>) => {
    const blockProps = useBlockProps.save();
    const { steps } = attributes;

    const stepNumbers: JSX.Element[] = [
        <span className="right-digit appear" key={0}>
            0
        </span>,
    ];

    const stepImages: JSX.Element[] = [];

    const stepElements = steps.map((step: ProcessStep, i: number) => {
        const { title, description, imageUrl, imageAlt } = step;

        stepNumbers.push(
            <span className="right-digit" key={i + 1}>
                {i + 1}
            </span>
        );

        stepImages.push(<img src={imageUrl} key={i} alt={imageAlt} />);

        return (
            <section className="step">
                <h2>{title}</h2>
                <p>{description}</p>
            </section>
        );
    });

    return (
        <section {...blockProps}>
            <h1 className="process-title">
                <span className="left-digit">0</span>
                <div className="right-digits">{stepNumbers}</div>
            </h1>
            <div className="block-content">
                <div className="process-image">{stepImages}</div>
                <div className="process-steps">{stepElements}</div>
            </div>
        </section>
    );
};
