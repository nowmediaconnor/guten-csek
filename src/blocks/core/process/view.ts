/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import { ProcessBlock, ProcessStep } from ".";
import { BlockController } from "../../../js/block-controller";

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
            const processImage = block.querySelector(".process-image") as HTMLImageElement;
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
                    imageUrl: stepImage ? stepImage.src ?? "" : "",
                    imageAlt: stepImage ? stepImage.alt ?? "" : "",
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

        const images = processImage.querySelectorAll("img") as NodeListOf<HTMLImageElement>;

        this.log("Found images", images.length, "for step", step, "with url", imageUrl, "and alt", imageAlt);

        images.forEach((image: HTMLImageElement, index: number) => {
            this.log("Updating image", index, imageUrl, imageAlt);
            if (index === step) {
                image.classList.add("active");
            } else {
                image.classList.remove("active");
            }
        });
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

        this.updateProcessImage(processBlock, step);
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
}
