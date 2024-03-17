/*
 * Created on Sat Mar 16 2024
 * Author: Connor Doman
 */

import BlockController from "../block-controller";

interface ProcessStep {
    title: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
}

export default class ProcessController extends BlockController {
    private static readonly STEP_OBSERVER_OPTIONS: IntersectionObserverInit = {
        root: null,
        rootMargin: "-50%",
        threshold: 0,
    };

    private stepObservers: IntersectionObserver[];

    private _scrollTimeout: number;
    private _isScrolling: boolean;
    private _stepElements: NodeListOf<HTMLElement>;

    private scrollTargetTop: number;

    private steps: ProcessStep[];

    private processImage: HTMLImageElement;
    private processTitle: HTMLElement;
    private lastIntersectingStep: Element;

    debug = true;

    setup(): boolean {
        this.steps = [];
        this.stepObservers = [];

        this.processImage = this.block.querySelector(".process-image") as HTMLImageElement;
        this.processTitle = this.block.querySelector(".process-title") as HTMLElement;

        this._stepElements = this.block.querySelectorAll(".step");
        this._stepElements.forEach((step: HTMLElement) => {
            const stepTitle = step.querySelector("h3") as HTMLElement;
            const stepDescription = step.querySelector("p") as HTMLElement;
            const stepImage = step.querySelector("img") as HTMLImageElement;

            if (!this.validate(stepTitle, "Step title is invalid", "Step title is valid")) return;
            // if (!this.validate(stepDescription, "Step description is invalid", "Step description is valid")) return;
            // if (!this.validate(stepImage, "Step image is invalid", "Step image is valid")) return;

            const stepData: ProcessStep = {
                title: stepTitle.textContent ?? "",
                description: stepDescription.textContent ?? "",
                imageUrl: stepImage ? stepImage.src ?? "" : "",
                imageAlt: stepImage ? stepImage.alt ?? "" : "",
            };

            this.steps.push(stepData);
        });

        this.prepareStepObservers();

        return true;
    }

    prepareStepObservers() {
        this.stepObservers = [...this._stepElements].map((step: HTMLElement, index: number) => {
            const stepObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    const { target } = entry;
                    this.info("Step observer fired for step", index);

                    if (entry.isIntersecting && target !== this.lastIntersectingStep) {
                        return this.onStepEnterViewport(target as HTMLElement, index);
                    } else if (!entry.isIntersecting && target === this.lastIntersectingStep) {
                        return this.onStepExitViewport(target as HTMLElement, index);
                    }
                });
            }, ProcessController.STEP_OBSERVER_OPTIONS);
            stepObserver.observe(step);
            return stepObserver;
        });
    }

    onStepEnterViewport(step: HTMLElement, index: number) {
        this.info(`Step ${index} is in the viewport`);
        this.scrollTargetTop = step.getBoundingClientRect().top + window.scrollY;
        this.lastIntersectingStep = step;

        this.updateProcessImage(index);
        this.updateProcessTitle(index);
    }

    onStepExitViewport(step: HTMLElement, index: number) {
        this.info(`Step ${index} is out of the viewport`);
        this.scrollTargetTop = undefined;
        this.lastIntersectingStep = undefined;
    }

    updateProcessImage(stepIndex: number) {
        const { imageUrl, imageAlt } = this.steps[stepIndex];
        const images = this.processImage.querySelectorAll("img") as NodeListOf<HTMLImageElement>;

        this.log("Found images", images.length, "for step", stepIndex, "with url", imageUrl, "and alt", imageAlt);

        images.forEach((image: HTMLImageElement, i: number) => {
            this.log("Updating image", stepIndex, imageUrl, imageAlt);
            if (i === stepIndex) {
                image.classList.add("active");
            } else {
                image.classList.remove("active");
            }
        });
    }

    updateProcessTitle(stepIndex: number) {
        const rightDigits = this.processTitle.querySelectorAll(".right-digit") as NodeListOf<HTMLElement>;

        rightDigits.forEach((digit: HTMLElement, i: number) => {
            if (i === stepIndex + 1) {
                digit.classList.add("active");
            } else {
                digit.classList.remove("active");
            }
        });
    }

    onEnterViewport(): void {
        document.body.classList.add("snap-scroll");
        this.processTitle.classList.add("appear");
    }
    onExitViewport(): void {
        document.body.classList.remove("snap-scroll");
        this.processTitle.classList.remove("appear");
    }
    onPageScroll(scrollY: number): void {
        if (this._scrollTimeout) {
            window.clearTimeout(this._scrollTimeout);
        }

        // scroll the page slightly to align the step in the viewport
        this._scrollTimeout = window.setTimeout(() => {
            this.info("Scroll timeout fired");
            this._scrollTimeout = undefined;

            if (this.scrollTargetTop) {
                window.scrollTo({ top: this.scrollTargetTop, behavior: "smooth" });
            }
        }, 500);
    }

    onMouseMove(e: MouseEvent): void {}
    onMouseEnter(e: MouseEvent): void {}
    onMouseLeave(e: MouseEvent): void {}
    onClick(x: number, y: number): void {}
    onPageResize(width: number, height: number): void {}
    onPageLoad(): void {}

    get isScrolling(): boolean {
        return this._isScrolling;
    }

    set isScrolling(value: boolean) {
        this._isScrolling = value;
    }
}
