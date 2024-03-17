/*
 * Created on Sat Mar 09 2024
 * Author: Connor Doman
 */

import { runAccumulators } from "../accumulators";
import { prepareCurtainElements } from "../curtainify";
import { getImageColor } from "../files";

export class PageController {
    private static readonly INIT_CHECK_INTERVAL = 1000;
    private static readonly INIT_CHECK_TIMEOUT = 5000;

    private _initialized: boolean;
    private _usingEditor: boolean = false;
    private _url: URL;
    private _finishInterval: number;
    private _fallbackTimeout: number;
    private _finishCondition: () => boolean;

    debug: boolean;

    private loadingPanel: HTMLElement;

    private contactFormScreen: HTMLElement;

    constructor() {
        this.debug = false;
        this.initialized = false;

        this._url = new URL(window.location.href);
    }

    static get isMobile(): boolean {
        return window.innerWidth <= 768;
    }

    init() {
        this.info("PageController initializing...");
        this.checkIfEditor();
        this.prepareLoadingPanel();
        this.prepareContactForm();
        this.prepareCurtainElements();
        this.prepareFeaturedColors();
        runAccumulators();
        this.initialized = true;
    }

    finish() {
        if (this.usingEditor) {
            this.info("Using editor, skipping loading screen.");
            this.hideLoadingPanel();
        } else if (!this.usingEditor) {
            this._finishInterval = window.setInterval(() => {
                if (this.isFinished) {
                    this.hideLoadingPanel();
                    window.clearInterval(this._finishInterval);
                    window.clearTimeout(this._fallbackTimeout);
                    this.info("Finished loading.");
                }
            }, PageController.INIT_CHECK_INTERVAL);

            // if the above fails for some reason, just hide the loading panel after 5 seconds
            this._fallbackTimeout = window.setTimeout(() => {
                this.error("Failed to finish loading properly, hiding panel...");
                this.hideLoadingPanel();
                window.clearInterval(this._finishInterval);
            }, PageController.INIT_CHECK_TIMEOUT);
        }
    }

    private prepareLoadingPanel(): boolean {
        const existingPanel = document.getElementById("loading");
        if (existingPanel) {
            this.warn("Loading panel found");
            this.loadingPanel = existingPanel as HTMLElement;
            return true;
        } else {
            this.warn("Loading panel not found, creating...");
            this.loadingPanel = document.createElement("div");
            this.loadingPanel.id = "loading";
            document.body.prepend(this.loadingPanel);
            return false;
        }
    }

    private prepareContactForm(id: string = "lets-talk"): boolean {
        this.contactFormScreen = document.getElementById(id);
        if (!this.contactFormScreen) {
            this.error("Contact form not found");
            return false;
        }

        const openContactButtons: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(`.${id}-open`);
        openContactButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                this.info("Contact form requested");
                this.openContactForm();
            });
        });

        const closeContactButton: HTMLAnchorElement | undefined = this.contactFormScreen.querySelector(`#${id}-close`);
        if (!closeContactButton) {
            this.error("Close button not found");
            return false;
        }

        closeContactButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.closeContactForm();
        });

        this.checkIfContactFormRequested();
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

    private checkIfContactFormRequested(tag: string = "contact"): boolean {
        const locationHash = window.location.hash.replaceAll("#", "");

        if (locationHash === tag) {
            this.info("Contact form requested");
            this.openContactForm();
            return true;
        }
        this.info("Contact form not requested");
        return false;
    }

    log(...msg: any[]) {
        console.log(`[${this.name}]`, ...msg);
    }

    info(...msg: any[]) {
        if (this.debug) console.info(`[${this.name}]`, ...msg);
    }

    error(...msg: any[]) {
        if (this.debug) console.error(`[${this.name}]`, ...msg);
    }

    warn(...msg: any[]) {
        if (this.debug) console.warn(`[${this.name}]`, ...msg);
    }

    showLoadingPanel() {
        this.loadingPanel.classList.remove("complete");
    }
    hideLoadingPanel() {
        this.loadingPanel.classList.add("complete");
    }

    openContactForm() {
        if (!this.contactFormScreen) {
            this.warn("Contact form not found");
            return;
        }
        this.contactFormScreen.classList.add("open");
    }
    closeContactForm() {
        if (!this.contactFormScreen) {
            this.warn("Contact form not found");
            return;
        }
        this.contactFormScreen.classList.remove("open");
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

    get name(): string {
        return this.constructor.name;
    }
}
