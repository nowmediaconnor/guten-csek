/*
 * Created on Wed Jan 31 2024
 * Author: Connor Doman
 */

import { BlockController } from "../../dom";

export default class NewsletterController extends BlockController {
    blocks: NodeListOf<HTMLElement>;

    newsletterForms: (HTMLElement | null)[] = [];

    constructor() {
        super();
        this.name = "NewsletterController";
    }

    setup(): void {
        this.debug = true;
        this.blocks = document.querySelectorAll(".wp-block-guten-csek-newsletter-cta-block");

        if (this.invalid(this.blocks.length > 0)) {
            return;
        }

        // add listeners to each block's links
        this.blocks.forEach((block: HTMLElement, index: number) => {
            // get form for action listener, styling
            const form = block.querySelector(".newsletter-form .gform_wrapper") as HTMLElement;
            if (!form) {
                this.newsletterForms[index] = null;
                return;
            }

            // compute form height for transition
            const formHeight = form.offsetHeight;
            form.classList.add("closed");
            form.style.setProperty("--expanded-height", `${formHeight}px`);

            this.newsletterForms[index] = form;

            // add listener to "Subscribe" link
            this.addEventListenerToLink(block, index);
        });

        this.isInitialized = true;
    }

    addEventListenerToLink(block: HTMLElement, index?: number) {
        const link = block.querySelector("a.subscribe-button");

        if (!link) return;

        link.addEventListener("click", (e: Event) => {
            e.preventDefault();
            this.openForm(index);
        });
    }

    openForm(index: number) {
        this.log(`Opening form ${index}`);
        this.newsletterForms[index].classList.toggle("open");
    }

    onMouseMove?(e: MouseEvent, blockIndex: number): void {}
}
