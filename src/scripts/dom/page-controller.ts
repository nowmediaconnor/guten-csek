/*
 * Created on Sat Mar 09 2024
 * Author: Connor Doman
 */

import { prepareCurtainElements } from "../curtainify";
import { getImageColor } from "../files";
import { error, log } from "../global";

export class PageController {
    private _initialized: boolean;
    private _usingEditor: boolean = false;
    private _url: URL;
    private _finishInterval: number;
    private _finishCondition: () => boolean;

    loadingPanel: HTMLElement;

    contactFormScreen: HTMLElement;
    contactFormOpened: boolean;

    constructor() {
        this.initialized = false;
        this.contactFormOpened = false;

        this._url = new URL(window.location.href);
    }

    static get isMobile(): boolean {
        return window.innerWidth <= 768;
    }

    init() {
        log("PageController initializing...");
        this.checkIfEditor();
        this.prepareLoadingPanel();
        this.prepareContactForm();
        this.prepareCurtainElements();
        this.prepareFeaturedColors();
        this.initialized = true;
    }

    finish() {
        if (this.usingEditor) {
            this.log("Using editor, skipping loading screen.");
            this.hideLoadingPanel();
        } else if (!this.usingEditor) {
            this._finishInterval = window.setInterval(() => {
                if (this.isFinished) {
                    this.hideLoadingPanel();
                    window.clearInterval(this._finishInterval);
                    this.log("Finished loading.");
                }
            }, 1000);
        }
    }

    private prepareLoadingPanel(): boolean {
        const existingPanel = document.getElementById("loading");
        if (existingPanel) {
            this.loadingPanel = existingPanel as HTMLElement;
            return true;
        } else {
            this.loadingPanel = document.createElement("div");
            this.loadingPanel.id = "loading";
            document.body.prepend(this.loadingPanel);
            return false;
        }
    }

    private prepareContactForm(id: string = "lets-talk"): boolean {
        const contactForm = document.getElementById("lets-talk");
        if (!contactForm) {
            error("Contact form not found");
            return false;
        }

        const openContactButtons: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(`a[href="#${id}"]`);
        openContactButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                this.openContactForm();
            });
        });

        const closeContactButton: HTMLAnchorElement | undefined = contactForm.querySelector(`.${id}-close`);
        if (!closeContactButton) {
            error("Close button not found");
            return false;
        }
        closeContactButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.closeContactForm();
        });

        this.checkIfContactFormRequested(id);
    }

    private prepareCurtainElements() {
        if (this.usingEditor) return;
        prepareCurtainElements();
    }

    private async prepareFeaturedColors() {
        const featuredImageColorElements: NodeListOf<HTMLElement> = document.querySelectorAll(".featured-image-color");
        if (!featuredImageColorElements || featuredImageColorElements.length === 0) {
            return false;
        }

        featuredImageColorElements.forEach((element: HTMLElement) => {
            element.classList.add("skeleton");
        });

        // step 1: get color from featured image
        const featuredImage = document.getElementById("featured-image") as HTMLImageElement;
        if (!featuredImage || !featuredImage.src) {
            return false;
        }
        const featuredImageColor = await getImageColor(featuredImage.src); // rgb(r, g, b)

        featuredImageColorElements.forEach((element: HTMLElement) => {
            element.style.backgroundColor = featuredImageColor;
            element.classList.remove("skeleton");
        });

        return true;
    }

    private checkIfEditor() {
        const isAdmin = this.pathname.startsWith("/wp-admin");

        const searchParams = new URLSearchParams(this.url.search);
        const isEditing = searchParams.get("action") === "edit";

        this.usingEditor = isAdmin && isEditing;
    }

    private checkIfContactFormRequested(tag: string = "lets-talk"): boolean {
        const locationHash = window.location.hash.replaceAll("#", "");

        if (locationHash === tag) {
            this.openContactForm();
            return true;
        }
        return false;
    }

    private log(...args: any[]) {
        log("[PageController]", ...args);
    }

    private error(...args: any[]) {
        error("[PageController]", ...args);
    }

    showLoadingPanel() {
        this.loadingPanel.classList.remove("complete");
    }
    hideLoadingPanel() {
        this.loadingPanel.classList.add("complete");
    }

    openContactForm() {
        if (!this.contactFormScreen) return;
        this.contactFormScreen.classList.add("open");
        this.contactFormOpened = true;
    }
    closeContactForm() {
        if (!this.contactFormScreen) return;
        this.contactFormScreen.classList.remove("open");
        this.contactFormOpened = false;
    }

    set initialized(value: boolean) {
        this._initialized = value;
    }

    get initialized(): boolean {
        return this._initialized;
    }

    get usingEditor(): boolean {
        return this._usingEditor;
    }

    set usingEditor(value: boolean) {
        this._usingEditor = value;
    }

    get url(): URL {
        return this._url;
    }

    get pathname(): string {
        return this._url.pathname;
    }

    set finishedCondition(condition: () => boolean) {
        this._finishCondition = condition;
    }

    get isFinished(): boolean {
        return this._finishCondition();
    }
}
