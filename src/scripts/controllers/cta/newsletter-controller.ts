/*
 * Created on Wed Jan 31 2024
 * Author: Connor Doman
 */

import { BlockController } from "../../dom";

export default class NewsletterController extends BlockController {
    blocks: NodeListOf<HTMLElement>;

    globalNewsletterForm: HTMLElement | undefined;

    constructor() {
        super();
        this.name = "NewsletterController";
    }

    setup(): void {
        this.debug = true;
        this.blocks = document.querySelectorAll(".wp-block-guten-csek-newsletter-cta-block");

        if (this.invalid(this.blocks.length > 0)) {
            this.log("No newsletter blocks found");
            return;
        }

        // get actual form
        this.globalNewsletterForm = document.getElementById("newsletter-form");

        if (this.globalNewsletterForm) {
            this.err(
                'No global newsletter form found. Your theme must contain a global newsletter form with the ID "#newsletter-form". Exiting block setup.'
            );
            this.isInitialized = true;
            return;
        } else {
            this.log("Found global newsletter form");
        }

        // add listeners to each block's links
        this.blocks.forEach((block: HTMLElement, index: number) => {
            const link = block.querySelector("a[href='#newsletter-form']");

            if (!link) return;

            link.addEventListener("click", (e: Event) => {
                e.preventDefault();
                this.globalNewsletterForm?.classList.add("open");
            });
        });

        this.isInitialized = true;
    }

    onMouseMove?(e: MouseEvent, blockIndex: number): void {}
}
