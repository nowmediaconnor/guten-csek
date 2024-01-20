/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import { useBlockProps } from "@wordpress/block-editor";
import React from "react";
import { GutenCsekBlockEditProps } from "../../../js/guten-csek";
import { CsekBlockHeading, Heading } from "../../components/heading";
import { TextArea, TextInput } from "../../components/input";
import { ProcessBlockAttributes, ProcessStep } from ".";
import { CsekDeleteButton, CsekAddButton } from "../../components/button";
import CsekCard from "../../components/card";
import { CsekMediaUpload } from "../../components/media-upload";

export const ProcessBlockEdit = ({ attributes, setAttributes }: GutenCsekBlockEditProps<ProcessBlockAttributes>) => {
    const blockProps = useBlockProps();

    const { steps } = attributes;

    const handleUpdateStep = (step: ProcessStep, index: number) => {
        const newSteps = [...steps];
        newSteps[index] = step;
        setAttributes({ steps: newSteps });
    };

    const handleAddStep = () => {
        const newSteps = [...steps];
        newSteps.push({ title: "", description: "", imageUrl: "", imageAlt: "" });
        setAttributes({ steps: newSteps });
    };

    const handleRemoveStep = (index: number) => {
        const newSteps = [...steps];
        newSteps.splice(index, 1);
        setAttributes({ steps: newSteps });
    };

    const handleUpdateStepTitle = (title: string, index: number) => {
        const newSteps = [...steps];
        newSteps[index].title = title;
        setAttributes({ steps: newSteps });
    };

    const handleUpdateStepDescription = (description: string, index: number) => {
        const newSteps = [...steps];
        newSteps[index].description = description;
        setAttributes({ steps: newSteps });
    };

    const handleUpdateStepImage = async (imageUrl: string, imageAlt: string, index: number) => {
        const newSteps = [...steps];

        newSteps[index].imageUrl = imageUrl;
        setAttributes({ steps: newSteps });
    };

    const cardEditors = steps.map((step: ProcessStep, i: number) => {
        const { title, description, imageUrl } = step;
        return (
            <CsekCard className="flex flex-col gap-2">
                <Heading level="3" className="text-2xl flex flex-row justify-between">
                    Step {i + 1}
                    <CsekDeleteButton label="Remove Step" onDelete={() => handleRemoveStep(i)} />
                </Heading>
                <div className="flex flex-row gap-2">
                    <CsekMediaUpload
                        label="Featured Image"
                        urlAttribute={imageUrl}
                        onChange={(v, alt) => handleUpdateStepImage(v, alt ?? "", i)}
                        size="large"
                    />
                    <CsekCard className="flex flex-col gap-2 basis-full">
                        <TextInput
                            label="Step Title"
                            initialValue={title}
                            onChange={(v) => handleUpdateStepTitle(v, i)}
                        />
                        <TextArea
                            label="Step Description"
                            initialValue={description}
                            className="h-full"
                            onChange={(v) => handleUpdateStepDescription(v, i)}
                        />
                    </CsekCard>
                </div>
            </CsekCard>
        );
    });
    return (
        <section {...blockProps} className="csek-block">
            <CsekBlockHeading>Csek Process Block</CsekBlockHeading>
            {cardEditors}
            <CsekAddButton label="Add Step" onAdd={handleAddStep} />
        </section>
    );
};
