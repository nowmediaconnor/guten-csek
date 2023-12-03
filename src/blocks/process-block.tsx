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
import { pad } from "../scripts/strings";

interface ProcessStep {
    title: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
}

interface ProcessBlock {
    block: HTMLElement;
    steps: ProcessStep[];
    processImage: HTMLImageElement;
    processTitle: HTMLElement;
    stepObservers?: IntersectionObserver[];
}

export interface ProcessBlockAttributes {
    steps: ProcessStep[];
}

export default class ProcessBlockController extends BlockController {
    blocks: NodeListOf<HTMLElement>;

    processBlocks: ProcessBlock[] = [];

    observers: IntersectionObserver[] = [];
    stepObservers: IntersectionObserver[][] = [];

    scrollTimeout: number | undefined;
    scrollTargetTop: number | undefined;
    lastIntersetingStep: Element | undefined;
    isScrolling: boolean = false;

    blockObserverOptions: IntersectionObserverInit;
    stepObserverOptions: IntersectionObserverInit;

    constructor() {
        super();
        this.name = "ProcessBlock";
        this.blockObserverOptions = {
            root: null,
            rootMargin: "-50%",
            threshold: 0,
        };
        this.stepObserverOptions = {
            root: null,
            rootMargin: "-50%",
            threshold: 0,
        };
    }

    setup(): void {
        this.debug = true;
        this.blocks = document.querySelectorAll(".wp-block-guten-csek-process-block");

        if (this.invalid(this.blocks)) {
            this.err("No process blocks found");
            return;
        }

        this.prepareProcessBlocks();
        this.prepareObservers();

        this.isInitialized = true;
    }

    prepareProcessBlocks(): void {
        this.blocks.forEach((block: HTMLElement) => {
            const processSteps: ProcessStep[] = [];
            const processImage = block.querySelector(".process-image img") as HTMLImageElement;
            const processTitle = block.querySelector(".process-title") as HTMLElement;

            const stepElements = block.querySelectorAll(".step");
            stepElements.forEach((step: Element) => {
                const stepTitle = step.querySelector("h2") as HTMLElement;
                const stepDescription = step.querySelector("p") as HTMLElement;
                const stepImage = step.querySelector("img") as HTMLImageElement;

                if (this.invalid(stepTitle)) {
                    this.err("Invalid step element");
                    return;
                }

                const stepData: ProcessStep = {
                    title: stepTitle.textContent || "",
                    description: stepDescription.textContent || "",
                    imageUrl: stepImage.src,
                    imageAlt: stepImage.alt,
                };

                processSteps.push(stepData);
            });

            const processBlock: ProcessBlock = {
                block,
                steps: processSteps,
                processImage,
                processTitle,
            };

            this.processBlocks.push(processBlock);
        });
    }

    prepareObservers(): void {
        this.processBlocks.forEach((processBlock: ProcessBlock) => {
            const { block } = processBlock;

            // prepare block observers
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) return this.onBlockEnterViewport(processBlock);
                    return this.onBlockLeaveViewport(processBlock);
                });
            }, this.blockObserverOptions);

            observer.observe(block);
            this.observers.push(observer);

            const stepElements = block.querySelectorAll(".step");
            const stepObservers: IntersectionObserver[] = [];
            stepElements.forEach((step: Element, i: number) => {
                // prepare observers for each step
                const stepObserver = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        const { target } = entry;
                        this.log("Step observer fired for step", i);

                        if (entry.isIntersecting && target !== this.lastIntersetingStep)
                            return this.onStepEnterViewport(processBlock, target as HTMLElement, i);
                        else if (!entry.isIntersecting && target === this.lastIntersetingStep)
                            return this.onStepLeaveViewport(processBlock, target as HTMLElement, i);
                    });
                }, this.stepObserverOptions);
                stepObserver.observe(step);
                stepObservers.push(stepObserver);
            });
            processBlock.stepObservers = stepObservers;
        });
    }

    updateProcessTitle(processBlock: ProcessBlock, step: number): void {
        const { processTitle } = processBlock;

        const rightDigits = processTitle.querySelectorAll(`.right-digit`) as NodeListOf<HTMLElement>;

        rightDigits.forEach((digit: HTMLElement, index: number) => {
            if (index === step + 1) {
                digit.classList.add("active");
            } else {
                digit.classList.remove("active");
            }
        });
    }

    updateProcessImage(processBlock: ProcessBlock, step: number): void {
        const { processImage } = processBlock;
        const { imageUrl, imageAlt } = processBlock.steps[step];

        if (this.invalid(processImage)) {
            this.err("Invalid process image");
            return;
        }

        if (this.invalid(imageUrl)) {
            this.err("Invalid image url");
            return;
        }

        if (this.invalid(imageAlt)) {
            this.err("Invalid image alt");
            return;
        }

        processImage.src = imageUrl;
        processImage.alt = imageAlt;
    }

    onBlockEnterViewport(processBlock: ProcessBlock) {
        document.body.classList.add("snap-scroll");
        processBlock.processTitle.classList.add("appear");
    }

    onBlockLeaveViewport(processBlock: ProcessBlock) {
        document.body.classList.remove("snap-scroll");
        processBlock.processTitle.classList.remove("appear");
    }

    onStepEnterViewport(processBlock: ProcessBlock, processStep: HTMLElement, i: number) {
        if (processStep === this.lastIntersetingStep) return;

        const step = i;

        this.log(`Step ${i + 1} is visible`);
        this.scrollTargetTop = processStep.getBoundingClientRect().top + window.scrollY;
        this.lastIntersetingStep = processStep;

        this.updateProcessTitle(processBlock, step);
    }

    onStepLeaveViewport(processBlock: ProcessBlock, _processStep: HTMLElement, i: number) {
        const { processTitle } = processBlock;

        this.log(`Step ${i + 1} is not visible`);
        this.scrollTargetTop = undefined;
        this.lastIntersetingStep = undefined;
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

        const stepNumbers: JSX.Element[] = [
            <span className="right-digit appear" key={0}>
                0
            </span>,
        ];

        const stepElements = steps.map((step: ProcessStep, i: number) => {
            const { title, description, imageUrl } = step;

            stepNumbers.push(
                <span className="right-digit" key={i + 1}>
                    {i + 1}
                </span>
            );

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
                <h1 className="process-title">
                    <span className="left-digit">0</span>
                    <div className="right-digits">{stepNumbers}</div>
                </h1>
                <div className="block-content">
                    <div className="process-image"></div>
                    <div className="process-steps">{stepElements}</div>
                </div>
            </section>
        );
    }
}
