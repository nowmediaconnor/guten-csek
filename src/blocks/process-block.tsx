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
    imageAlt: string;
}

export interface ProcessBlockAttributes {
    steps: ProcessStep[];
}

export default class ProcessBlockController extends BlockController {
    blocks: NodeListOf<HTMLElement>;

    observers: IntersectionObserver[] = [];
    stepObservers: IntersectionObserver[][] = [];

    scrollTimeout: number | undefined;
    scrollTargetTop: number | undefined;
    lastIntersetingStep: Element | undefined;
    isScrolling: boolean = false;

    constructor() {
        super();
        this.name = "ProcessBlock";
    }

    setup(): void {
        this.debug = true;
        this.blocks = document.querySelectorAll(".wp-block-guten-csek-process-block");

        if (this.invalid(this.blocks)) {
            this.err("No process blocks found");
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: "-50%",
            threshold: 0,
        };

        this.blocks.forEach((block: HTMLElement) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.log("Process block is visible");
                        document.body.classList.add("snap-scroll");
                    } else {
                        this.log("Process block is not visible");
                        document.body.classList.remove("snap-scroll");
                    }
                });
            }, observerOptions);

            observer.observe(block);
            this.observers.push(observer);

            const stepElements = block.querySelectorAll(".step");
            const stepObserverOptions = {
                root: null,
                rootMargin: "-50%",
                threshold: 0,
            };
            const stepObservers: IntersectionObserver[] = [];
            stepElements.forEach((step: Element, i: number) => {
                const stepObserver = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        const { target } = entry;
                        if (entry.isIntersecting && target !== this.lastIntersetingStep) {
                            this.log(`Step ${i + 1} is visible`);
                            this.scrollTargetTop = target.getBoundingClientRect().top + window.scrollY;
                            this.lastIntersetingStep = target;
                        } else if (!entry.isIntersecting && target === this.lastIntersetingStep) {
                            this.log(`Step ${i + 1} is not visible`);
                            this.scrollTargetTop = undefined;
                            this.lastIntersetingStep = undefined;
                        }
                    });
                }, stepObserverOptions);
                stepObserver.observe(step);
                stepObservers.push(stepObserver);
            });
        });

        this.isInitialized = true;
    }

    scroll(scrollY?: number | undefined): void {
        if (this.scrollTimeout) {
            window.clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = window.setTimeout(() => {
            this.log("Scroll timeout");
            this.scrollTimeout = undefined;

            if (this.scrollTargetTop) {
                window.scrollTo({ top: this.scrollTargetTop, behavior: "smooth" });
            }
        }, 500);
    }
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
            console.log("Updating image url:", imageUrl, "->", imageAlt);

            const newSteps = [...steps];

            newSteps[index].imageUrl = imageUrl;
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
                        onChange={(v, alt) => handleUpdateStepImage(v, alt, i)}
                        size="medium"
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
                <section className="step">
                    <h2>{title}</h2>
                    <p>{description}</p>
                    <img src={imageUrl} className="hidden" />
                </section>
            );
        });

        return (
            <section {...blockProps}>
                <h1 className="process-title">00</h1>
                <div className="block-content">
                    <div className="process-image"></div>
                    <div className="process-steps">{stepElements}</div>
                </div>
            </section>
        );
    }
}
