/*
 * Created on Mon Dec 11 2023
 * Author: Connor Doman
 */

export enum Shape {
    SQUARE = 0,
    UP = 1,
    DOWN = 2,
    LEFT = 3,
    RIGHT = 4,
}

export interface BrickCompatibility {
    [Shape.SQUARE]: boolean;
    [Shape.UP]: boolean;
    [Shape.DOWN]: boolean;
    [Shape.LEFT]: boolean;
    [Shape.RIGHT]: boolean;
}

export class Brick {
    public static shapeWeights: { [key in Shape]: number } = {
        [Shape.SQUARE]: 3,
        [Shape.UP]: 1,
        [Shape.DOWN]: 1,
        [Shape.LEFT]: 1,
        [Shape.RIGHT]: 1,
    };

    private static weightedShapes: Shape[] = Object.keys(Shape)
        .filter((n) => isNaN(Number(n)))
        .map((n) => {
            const k = Shape[n as keyof typeof Shape];
            const enumValues: Shape[] = [];
            const weight = Brick.shapeWeights[k];
            for (let i = 0; i < weight; i++) {
                enumValues.push(Shape[n]);
            }
            return enumValues;
        })
        .flat();

    private row: number;
    private col: number;
    private orientation: Shape;

    constructor(row: number = 0, col: number = 0, orientation: Shape = Shape.SQUARE) {
        this.row = row;
        this.col = col;
        this.orientation = orientation;
    }

    public randomizeDirection(): void {
        const randomIndex = Math.floor(Math.random() * Brick.weightedShapes.length);
        this.orientation = Brick.weightedShapes[randomIndex];
    }

    get dir(): Shape {
        return this.orientation;
    }

    set dir(dir: Shape) {
        this.orientation = dir;
    }

    get r(): number {
        return this.row;
    }

    set r(row: number) {
        this.row = row;
    }

    get c(): number {
        return this.col;
    }

    set c(col: number) {
        this.col = col;
    }

    toString(): string {
        switch (this.orientation) {
            case Shape.SQUARE:
                return "\u2610";
            case Shape.UP:
                return "\u2191";
            case Shape.DOWN:
                return "\u2193";
            case Shape.LEFT:
                return "\u2190";
            case Shape.RIGHT:
                return "\u2192";
        }
    }
}

export function compatibilityString(compatibility: BrickCompatibility | undefined): string {
    if (!compatibility) {
        return "[X]";
    }

    const dirs: string[] = ["["];
    if (compatibility[Shape.SQUARE]) {
        dirs.push("\u2610");
    }
    if (compatibility[Shape.UP]) {
        dirs.push("\u2191");
    }
    if (compatibility[Shape.DOWN]) {
        dirs.push("\u2193");
    }
    if (compatibility[Shape.LEFT]) {
        dirs.push("\u2190");
    }
    if (compatibility[Shape.RIGHT]) {
        dirs.push("\u2192");
    }
    dirs.push("]");
    return dirs.join("");
}
