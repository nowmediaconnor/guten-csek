/*
 * Created on Sat Nov 11 2023
 * Author: Connor Doman
 */

import { Row } from "./row";

export class MarqueeCanvas {
    static font: string = "10pt serif";

    parent: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    width: number = 100;
    height: number = 100;
    rowCount: number = 1;
    frameCount: number = 0;
    spacing: number[];

    fontSize: number = 50;
    fontFamily: string = "Syne";

    backgroundColor: string = "transparent";

    rows: Row[] = [];

    _words: string[] = [];

    constructor(parent: HTMLElement, w?: number, h?: number, rows?: number) {
        this.parent = parent;

        if (w) this.width = w;
        if (h) this.height = h;
        if (rows) this.rowCount = rows;

        this.canvas = MarqueeCanvas.createHiDPICanvas(this.width, this.height, MarqueeCanvas.PIXEL_RATIO);
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    }

    set words(words: string[]) {
        this._words = words;
    }

    get words() {
        return this._words;
    }

    get rowSpace() {
        return this.height / this.rowCount;
    }

    get font() {
        return `${this.fontSize}pt ${this.fontFamily}`;
    }

    setup() {
        if (!this.words || this.words.length === 0) {
            throw new Error("No words specified");
        }

        this.rows = [];

        for (let i = 0; i < this.rowCount; i++) {
            const row = new Row(this, this.words, i % 2 === 0 ? 1 : -1);
            this.rows.push(row);
        }
        const testString = this.words.join(" ");
        const testStringDims = this.textDimensions(testString);
        const testH = testStringDims.h;

        this.spacing = this.spacesAround(testH, this.height, this.rowCount);
    }

    update() {
        for (let row of this.rows) {
            row.update();
        }
    }

    draw() {
        this.wipe();
        this.fill(this.backgroundColor);

        for (let i = 0; i < this.rowCount; i++) {
            const row = this.rows[i];

            const h = ((this.rowSpace + row.height) / 2) * (i + 1);
            // row.draw(-row.width - row.wordSpacing, spacing[i], "red");
            // row.draw(0, spacing[i]);
            row.draw(0, this.spacing[i]);
        }

        // this.drawFrameCount();
        this.frameCount++;
    }

    drawFrameCount() {
        this.text(this.frameCount.toString(), 14, 21, "lightgreen", "14pt serif");
    }

    wipe() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    fill(color: string) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    text(text: string, x: number, y: number, color?: string, font?: string) {
        if (color) this.ctx.fillStyle = color;
        else this.ctx.fillStyle = "black";

        if (font) this.ctx.font = font;
        else this.ctx.font = this.font;

        this.ctx.fillText(text, x, y);
    }

    textDimensions(text: string, font?: string) {
        if (font) this.ctx.font = font;
        else this.ctx.font = this.font;

        const measured = this.ctx.measureText(text);
        const w = Math.floor(measured.width);
        const h = Math.floor(measured.actualBoundingBoxAscent + measured.actualBoundingBoxDescent);
        return { w, h };
    }

    spacesAround(elementHeight: number, parentHeight: number, numberOfElements: number) {
        // Calculate the total height of all elements
        const totalElementHeight = elementHeight * numberOfElements;

        // Calculate the remaining space in the parent
        let remainingSpace = parentHeight - totalElementHeight;

        // If the total element height is greater than the parent height, set remaining space to 0
        if (remainingSpace < 0) remainingSpace = 0;

        // Calculate the space around each element
        const spaceAround = remainingSpace / (numberOfElements + 1);

        // Initialize the top position of the first element, adjusted for center alignment
        // const difference = remainingSpace / 2 - totalElementHeight / 2;
        const difference = spaceAround;

        // Ensure topPosition is not less than 0 or greater than parentHeight - totalElementHeight
        const topPosition: number = difference + elementHeight;

        // Initialize an array to hold the top positions
        const topPositions: number[] = [];

        let tempTopPosition = topPosition;

        // Calculate the top position for each element
        for (let i = 0; i < numberOfElements; i++) {
            // Add the top position to the array
            topPositions.push(tempTopPosition);

            // Update the top position for the next element
            tempTopPosition += elementHeight + spaceAround;
        }

        console.log({ topPosition, topPositions });

        // Return the top positions
        return topPositions;
    }

    resetRows() {
        for (let row of this.rows) {
            row.reset();
        }
    }

    placeCanvas(x: number = 0, y: number = 0) {
        this.canvas.style.position = "absolute";
        this.canvas.style.top = `${y}px`;
        this.canvas.style.left = `${x}px`;
        if (this.parent) {
            this.parent.appendChild(this.canvas);
        }
    }

    static PIXEL_RATIO = (() => {
        let ctx = document.createElement("canvas").getContext("2d") as any,
            dpr = window.devicePixelRatio || 1,
            bsr = 1;

        if (ctx.webkitBackingStorePixelRatio !== undefined) {
            bsr = ctx.webkitBackingStorePixelRatio;
        } else if (ctx.mozBackingStorePixelRatio !== undefined) {
            bsr = ctx.mozBackingStorePixelRatio;
        } else if (ctx.msBackingStorePixelRatio !== undefined) {
            bsr = ctx.msBackingStorePixelRatio;
        } else if (ctx.oBackingStorePixelRatio !== undefined) {
            bsr = ctx.oBackingStorePixelRatio;
        } else if (ctx.backingStorePixelRatio !== undefined) {
            bsr = ctx.backingStorePixelRatio;
        }

        return dpr / bsr;
    })();

    static createHiDPICanvas(w: number, h: number, ratio: number) {
        if (!ratio) {
            ratio = MarqueeCanvas.PIXEL_RATIO;
        }
        let can = document.createElement("canvas");
        can.width = w * ratio;
        can.height = h * ratio;
        can.style.width = w + "px";
        can.style.height = h + "px";
        can.getContext("2d")?.setTransform(ratio, 0, 0, ratio, 0, 0);
        return can;
    }
}
