/*
 * Created on Mon Nov 13 2023
 * Author: Connor Doman
 */

import { shuffle } from "../array";
import { MarqueeCanvas } from "./marquee";

export type Direction = 1 | -1;

export class Strip {
    static wordSpacing: number = 64;

    mq: MarqueeCanvas;
    words: string[];

    width: number;
    height: number;

    constructor(mq: MarqueeCanvas, words: string[]) {
        this.mq = mq;
        this.words = shuffle(words);

        const dimensions = this.calculateDimensions();
        this.width = dimensions.w;
        this.height = dimensions.h;
    }

    calculateDimensions(): { w: number; h: number } {
        return this.words.reduce(
            (acc, word) => {
                const dimensions = this.mq.textDimensions(word);
                return {
                    w: acc.w + dimensions.w + Strip.wordSpacing,
                    h: Math.max(acc.h, dimensions.h),
                };
            },
            { w: 0, h: 0 }
        );
    }

    update() {}

    draw(x: number = 0, y: number = 0) {
        let localOffset = 0;
        for (let i = 0; i < this.words.length; i++) {
            const word = this.words[i];
            this.mq.text(word, x + localOffset, y, Row.color);
            localOffset += this.mq.textDimensions(word).w + Strip.wordSpacing;
        }
    }

    clone(): Strip {
        const clone = new Strip(this.mq, [...this.words]);
        return clone;
    }
}

export class Ribbon {
    mq: MarqueeCanvas;
    numberOfStrips: number;
    strips: Strip[];
    words: string[];

    offset: number = 0;

    width: number;
    height: number;

    constructor(mq: MarqueeCanvas, words: string[]) {
        this.mq = mq;
        this.words = words;

        const firstStrip = new Strip(mq, words);
        this.strips = [firstStrip];

        this.numberOfStrips = Math.ceil(this.mq.width / firstStrip.width);

        for (let i = 1; i < this.numberOfStrips; i++) {
            const strip = firstStrip.clone();
            this.strips.push(strip);
        }

        this.width = this.calculateWidth();
        this.height = firstStrip.height;
    }

    calculateWidth(): number {
        return this.strips.reduce((acc, strip) => {
            return acc + strip.width;
        }, 0);
    }

    update(direction: Direction) {
        this.offset += direction * Row.scrollSpeed;
    }

    draw(x: number = 0, y: number = 0) {
        let localOffset = 0;
        for (let i = 0; i < this.numberOfStrips; i++) {
            const strip = this.strips[i];
            strip.draw(x + localOffset + this.offset, y);
            localOffset += strip.width;
        }
    }

    clone(): Ribbon {
        const clone = new Ribbon(this.mq, [...this.words]);
        return clone;
    }
}

export class Row {
    static scrollSpeed: number = 1;
    static color: string = "#e9ebea";

    mq: MarqueeCanvas;
    primaryRibbon: Ribbon;
    secondaryRibbon: Ribbon;
    direction: Direction = 1;

    words: string[];

    constructor(mq: MarqueeCanvas, words: string[], direction?: Direction) {
        this.mq = mq;
        this.words = words;

        if (direction) this.direction = direction;

        this.primaryRibbon = new Ribbon(mq, words);
        this.secondaryRibbon = this.primaryRibbon.clone();

        this.direction
            ? this.moveRibbonBehind(this.secondaryRibbon, this.primaryRibbon)
            : this.moveRibbonAhead(this.secondaryRibbon, this.primaryRibbon);
    }

    get width(): number {
        return this.primaryRibbon.width + this.secondaryRibbon.width;
    }

    get height(): number {
        return this.primaryRibbon.height;
    }

    update() {
        this.primaryRibbon.update(this.direction);
        this.secondaryRibbon.update(this.direction);

        switch (this.direction) {
            case 1:
                if (this.primaryRibbon.offset >= this.mq.width) {
                    console.log("Moving primary ribbon behind");
                    this.moveRibbonBehind(this.primaryRibbon, this.secondaryRibbon);
                }

                if (this.secondaryRibbon.offset >= this.mq.width) {
                    console.log("Moving secondary ribbon behind");
                    this.moveRibbonBehind(this.secondaryRibbon, this.primaryRibbon);
                }
                break;
            case -1:
                if (this.primaryRibbon.offset <= -this.primaryRibbon.width) {
                    console.log("Moving primary ribbon ahead");
                    this.moveRibbonAhead(this.primaryRibbon, this.secondaryRibbon);
                }

                if (this.secondaryRibbon.offset <= -this.secondaryRibbon.width) {
                    console.log("Moving secondary ribbon ahead");
                    this.moveRibbonAhead(this.secondaryRibbon, this.primaryRibbon);
                }
                break;
        }

        // console.log({ primary: this.primaryRibbon.offset, secondary: this.secondaryRibbon.offset });
    }

    draw(x: number = 0, y: number = 0) {
        // Row.color = "black";
        this.primaryRibbon.draw(x, y);
        // Row.color = "red";
        this.secondaryRibbon.draw(x, y);
    }

    moveRibbonBehind(thisRibbon: Ribbon, thatRibbon: Ribbon) {
        thisRibbon.offset = thatRibbon.offset - thisRibbon.width;
    }

    moveRibbonAhead(thisRibbon: Ribbon, thatRibbon: Ribbon) {
        thisRibbon.offset = thatRibbon.offset + thatRibbon.width;
    }

    reset() {
        this.primaryRibbon.offset = 0;
        this.secondaryRibbon.offset = 0;
        this.direction === 1
            ? this.moveRibbonBehind(this.secondaryRibbon, this.primaryRibbon)
            : this.moveRibbonAhead(this.secondaryRibbon, this.primaryRibbon);
    }
}
