/*
 * Created on Wed Nov 29 2023
 * Author: Connor Doman
 */

import React from "react";
import { BlockController, GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../scripts/dom";
import { CsekBlockHeading, Heading } from "../components/heading";
import { useBlockProps } from "@wordpress/block-editor";
import CsekCard from "../components/card";
import { TextArea, TextInput } from "../components/input";
import { CsekImage } from "../scripts/image";
import { CsekMediaUpload } from "../components/media-upload";
import { CsekAddButton, CsekButton } from "../components/button";

interface ProcessStep {
    title: string;
    description: string;
    imageUrl: string;
}

export interface ProcessBlockAttributes {
    steps: ProcessStep[];
}

export default class ProcessBlockController extends BlockController {
    blocks: NodeListOf<HTMLElement>;

    constructor() {
        super();
        this.name = "ProcessBlock";
    }

    setup(): void {
        this.blocks = document.querySelectorAll(".wp-block-guten-csek-process-block");

        if (this.invalid(this.blocks)) {
            this.err("No process blocks found");
            return;
        }

        this.isInitialized = true;
    }

    onScroll?(scrollY?: number | undefined): void {}
    onMouseMove?(e: MouseEvent, blockIndex: number): void {}

    static editComponent({ attributes, setAttributes }: GutenCsekBlockEditProps<ProcessBlockAttributes>): JSX.Element {
        const blockProps = useBlockProps();

        const { steps } = attributes;

        const handleUpdateStep = (step: ProcessStep, index: number) => {
            const newSteps = [...steps];
            newSteps[index] = step;
            setAttributes({ steps: newSteps });
        };

        const handleAddStep = () => {
            const newSteps = [...steps];
            newSteps.push({ title: "", description: "", imageUrl: "" });
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

        const handleUpdateStepImageUrl = async (imageId: number, index: number) => {
            const newSteps = [...steps];

            const csekImage = new CsekImage(imageId);
            await csekImage.doubleCheckSizes();

            newSteps[index].imageUrl = csekImage.medium;
            setAttributes({ steps: newSteps });
        };

        const cardEditors = steps.map((step: ProcessStep, i: number) => {
            const { title, description, imageUrl } = step;
            return (
                <CsekCard>
                    <Heading level="3">Step {i + 1}</Heading>
                    <TextInput label="Step Title" initialValue={title} onChange={(v) => handleUpdateStepTitle(v, i)} />
                    <TextArea
                        label="Step Description"
                        initialValue={description}
                        onChange={(v) => handleUpdateStepDescription(v, i)}
                    />
                    <CsekMediaUpload
                        label="Featured Image"
                        urlAttribute={imageUrl}
                        onChange={(_v, id) => handleUpdateStepImageUrl(id, i)}
                    />
                </CsekCard>
            );
        });

        return (
            <section {...blockProps}>
                <CsekBlockHeading>Csek Process Block</CsekBlockHeading>
                {cardEditors}
                <CsekAddButton label="Add Step" onAdd={handleAddStep} />
            </section>
        );
    }

    static saveComponent({ attributes }: GutenCsekBlockSaveProps<ProcessBlockAttributes>): JSX.Element {
        const blockProps = useBlockProps.save();
        const { steps } = attributes;

        const stepElements = steps.map((step: ProcessStep, i: number) => {
            const { title, description, imageUrl } = step;
            return (
                <div className="flex flex-col gap-4 py-4 csek-card w-fit">
                    <Heading level="3">Step {i + 1}</Heading>
                    <Heading level="4">{title}</Heading>
                    <p>{description}</p>
                    <img src={imageUrl} />
                </div>
            );
        });

        return <section {...blockProps}>{stepElements}</section>;
    }
}
