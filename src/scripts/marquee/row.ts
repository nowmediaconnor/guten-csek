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
    acc: number;
    dec: number;

    fadeInAmt: number = 0;
    fadeOutAmt: number = 1;

    activeWord: string = "";
    oldWord: string = "";

    constructor(mq: MarqueeCanvas, words: string[]) {
        this.mq = mq;
        this.words = shuffle(words);

        if (this.mq.separator) {
            this.words = [];
            for (const word of shuffle(words)) {
                this.words.push(word);
                this.words.push(this.mq.separator);
            }
        }

        const dimensions = this.calculateDimensions();
        this.width = dimensions.w;
        this.height = dimensions.h;
        this.acc = dimensions.acc;
        this.dec = dimensions.dec;
    }

    calculateDimensions(): { w: number; h: number; acc: number; dec: number } {
        return this.words.reduce(
            (acc, word) => {
                const dimensions = this.mq.textDimensions(word);
                return {
                    w: acc.w + dimensions.w + Strip.wordSpacing,
                    h: Math.max(acc.h, dimensions.h),
                    acc: Math.max(acc.acc, dimensions.acc),
                    dec: Math.max(acc.dec, dimensions.dec),
                };
            },
            { w: 0, h: 0, acc: 0, dec: 0 }
        );
    }

    update() {
        if (this.activeWord !== this.mq.activeWord) {
            this.oldWord = this.activeWord;
            this.activeWord = this.mq.activeWord;
            this.fadeInAmt = 0;
            this.fadeOutAmt = 1;
        }

        this.fadeInAmt += 0.1;
        this.fadeOutAmt -= 0.1;

        if (this.fadeInAmt > 1) this.fadeInAmt = 1;
        if (this.fadeOutAmt < 0) this.fadeOutAmt = 0;
    }

    draw(x: number = 0, y: number = 0) {
        let localOffset = 0;
        for (let i = 0; i < this.words.length; i++) {
            const word = this.words[i];

            this.mq.text(word, x + localOffset, y, Row.lightColor);

            if (word === this.activeWord) {
                this.mq.ctx.globalAlpha = this.fadeInAmt;
                this.mq.text(word, x + localOffset, y, Row.darkColor);
            } else if (word === this.oldWord) {
                this.mq.ctx.globalAlpha = this.fadeOutAmt;
                this.mq.text(word, x + localOffset, y, Row.darkColor);
            }
            this.mq.ctx.globalAlpha = 1;

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
    acc: number;
    dec: number;

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
        this.acc = firstStrip.acc;
        this.dec = firstStrip.dec;
    }

    calculateWidth(): number {
        return this.strips.reduce((acc, strip) => {
            return acc + strip.width;
        }, 0);
    }

    update(direction: Direction) {
        this.offset += direction * Row.scrollSpeed;

        for (const s of this.strips) {
            s.update();
        }
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
    static lightColor: string = "#e9ebea";
    static darkColor: string = "#131313";

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

    get acc(): number {
        return this.primaryRibbon.acc;
    }

    get dec(): number {
        return this.primaryRibbon.dec;
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
