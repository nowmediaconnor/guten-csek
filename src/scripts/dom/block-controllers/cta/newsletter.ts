/*
 * Created on Sat Mar 16 2024
 * Author: Connor Doman
 */

import BlockController from "../block-controller";

export default class NewsletterController extends BlockController {
    form: HTMLElement | null = null;

    setup(): boolean {
        // look for a form in this block
        this.form = this.block.querySelector(".newsletter-form .gform_wrapper") as HTMLElement;
        if (!this.validate(this.form, "Form not found")) return false;

        // compute form height so transition works properly
        const formHeight = this.form.offsetHeight;
        this.form.classList.add("closed");
        this.form.style.setProperty("--expanded-height", `${formHeight}px`);

        this.addSubscribeButtonListener();

        return true;
    }

    addSubscribeButtonListener() {
        const link = this.block.querySelector("a.subscribe-button");
        if (!this.validate(link, "Subscribe button not found")) {
            return;
        }

        link.addEventListener("click", (e: Event) => {
            e.preventDefault();
            this.toggleFormOpen();
        });
    }

    toggleFormOpen() {
        this.form?.classList.toggle("open");
    }

    onMouseMove(e: MouseEvent): void {}
    onMouseEnter(e: MouseEvent): void {}
    onMouseLeave(e: MouseEvent): void {}
    onClick(x: number, y: number): void {}
    onPageScroll(scrollY: number): void {}
    onPageResize(width: number, height: number): void {}
    onPageLoad(): void {}
    onEnterViewport(): void {}
    onExitViewport(): void {}
}
