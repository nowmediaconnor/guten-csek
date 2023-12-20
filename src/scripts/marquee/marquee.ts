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

    lineColor: string = Row.lightColor;
    lineWidth: number = 0.9;
    lineStart: number;
    lineEnd: number;

    rows: Row[] = [];
    separator?: string;

    activeWord: string = "";

    private _words: string[] = [];

    constructor(parent: HTMLElement, w?: number, h?: number, rows?: number) {
        this.parent = parent;

        if (w) this.width = w;
        if (h) this.height = h;
        if (rows) this.rowCount = rows;

        this.canvas = MarqueeCanvas.createHiDPICanvas(this.width, this.height, MarqueeCanvas.PIXEL_RATIO);
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        const lineSize = this.width * this.lineWidth;
        this.lineStart = (this.width - lineSize) / 2;
        this.lineEnd = this.width - this.lineStart;
    }

    set words(words: string[]) {
        console.log("Setting words in marquee...");
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

        this.spacing = this.spacesAround(testH, this.height, this.rowCount, testStringDims.acc);
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

            row.draw(0, this.spacing[i]);

            if (i !== this.rowCount - 1) {
                const topDiff = this.spacing[i + 1] - this.spacing[i];
                const y = this.spacing[i] + (topDiff - row.acc) / 2 + row.dec / 2;
                this.drawHorizontalLine(y);
            }
        }

        // this.drawFrameCount();
        this.frameCount++;
    }

    drawFrameCount() {
        this.text(this.frameCount.toString(), 14, 21, "lightgreen", "14pt serif");
    }

    drawHorizontalLine(y: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.lineStart, y);
        this.ctx.lineTo(this.lineEnd, y);
        this.ctx.strokeStyle = this.lineColor;
        this.ctx.stroke();
    }

    wipe() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    fill(color: string) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    rect(x: number, y: number, w: number, h: number, color: string) {
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(x, y, w, h);
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
        const acc = Math.floor(measured.actualBoundingBoxAscent);
        const dec = Math.floor(measured.actualBoundingBoxDescent);
        return { w, h, acc, dec };
    }

    spacesAround(elementHeight: number, parentHeight: number, numberOfElements: number, offset: number = 0) {
        // Calculate the total height of all elements
        const totalElementHeight = elementHeight * numberOfElements;

        // Calculate the remaining space in the parent
        let remainingSpace = parentHeight - totalElementHeight;

        // If the total element height is greater than the parent height, set remaining space to 0
        if (remainingSpace < 0) remainingSpace = 0;

        // Calculate the space around each element
        const spaceAround = remainingSpace / (numberOfElements + 1);

        // Calculate the top positions of each element
        const topPositions: number[] = [];
        for (let i = 0; i < numberOfElements; i++) {
            const top = spaceAround * (i + 1) + elementHeight * i + offset;
            topPositions.push(top);
        }

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
