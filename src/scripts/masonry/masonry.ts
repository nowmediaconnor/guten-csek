/*
 * Created on Mon Dec 11 2023
 * Author: Connor Doman
 */

import { Brick, BrickCompatibility, Shape, compatibilityString } from "./brick";

export interface CSSGridCoordinates {
    size: "square" | "tall" | "wide";
    rowStart: number;
    rowEnd: number;
    colStart: number;
    colEnd: number;
}

export interface SurroundingBricks {
    center: Brick;
    up?: Brick;
    down?: Brick;
    left?: Brick;
    right?: Brick;
}

export interface MasonryCell {
    r: number;
    c: number;
    allowed?: BrickCompatibility;
}

export class MasonryGrid {
    public debug: boolean = true;

    private bricks: Brick[] = [];
    private gridState: number[][] = [];
    private rows: number;
    private cols: number;

    private gridSpiral: MasonryCell[] = [];

    private exclusions: Set<string> = new Set();

    constructor(rows: number = 1, cols: number = 1) {
        this.rows = rows; // height
        this.cols = cols; // width

        // initialize grid state with no ids
        for (let i = 0; i < rows; i++) {
            this.gridState[i] = [];
            for (let j = 0; j < cols; j++) {
                this.gridState[i][j] = -1;
            }
        }

        // this.gridSpiral = this.getGridSprial();
        this.gridSpiral = this.getGridSnake();
    }

    public placeBricks(numBricks: number): void {
        this.log(`Attempting to place ${numBricks} bricks...`);

        for (let i = 0; i < numBricks; i++) {
            this.log(`Trying to place brick #${i + 1}...`);
            this.addBrick();
        }

        this.log(`Placed ${this.bricks.length}/${numBricks} bricks`);
    }

    public displayAllowances(): void {
        this.gridSpiral.forEach(({ r, c, allowed }, index) => {
            this.log(`${index}.\t[${r},${c}]:`, compatibilityString(allowed));
        });
    }

    public excludeCell(row: number, col: number): void {
        this.exclusions.add(`${row},${col}`);
    }

    public brickData() {
        this.bricks.forEach((brick, index) => {
            this.log(`${index}.`.padEnd(4, " ") + `(${brick.r}, ${brick.c}) ${brick.toString()}`);
        });
    }

    public calculateCSSGridCoords(): CSSGridCoordinates[] {
        const coords: CSSGridCoordinates[] = [];

        this.bricks.forEach((brick) => {
            const { r: row, c: col } = brick;
            const { dir } = brick;

            const gridRow = row + 1;
            const gridCol = col + 1;

            switch (dir) {
                case Shape.SQUARE:
                    coords.push({
                        size: "square",
                        rowStart: gridRow,
                        rowEnd: gridRow + 1,
                        colStart: gridCol,
                        colEnd: gridCol + 1,
                    });
                    break;
                case Shape.UP:
                    coords.push({
                        size: "tall",
                        rowStart: gridRow - 1,
                        rowEnd: gridRow + 1,
                        colStart: gridCol,
                        colEnd: gridCol + 1,
                    });
                    break;
                case Shape.DOWN:
                    coords.push({
                        size: "tall",
                        rowStart: gridRow,
                        rowEnd: gridRow + 2,
                        colStart: gridCol,
                        colEnd: gridCol + 1,
                    });
                    break;
                case Shape.LEFT:
                    coords.push({
                        size: "wide",
                        rowStart: gridRow,
                        rowEnd: gridRow + 1,
                        colStart: gridCol - 1,
                        colEnd: gridCol + 1,
                    });
                    break;
                case Shape.RIGHT:
                    coords.push({
                        size: "wide",
                        rowStart: gridRow,
                        rowEnd: gridRow + 1,
                        colStart: gridCol,
                        colEnd: gridCol + 2,
                    });
                    break;
            }
        });

        return coords;
    }

    public numRowsNeeded = (): number => {
        return this.bricks.reduce((max, brick) => {
            return Math.max(max, brick.r + 1);
        }, 0);
    };

    private isExcluded(row: number, col: number): boolean {
        return this.exclusions.has(`${row},${col}`);
    }

    private getGridSnake(): MasonryCell[] {
        const snake: MasonryCell[] = [];

        for (let row = 0; row < this.rows; row++) {
            if (row % 2 === 0) {
                for (let col = 0; col < this.cols; col++) {
                    const cell = { r: row, c: col };
                    snake.push(cell);
                }
            } else if (row % 2 !== 0) {
                for (let col = this.cols - 1; col >= 0; col--) {
                    const cell = { r: row, c: col };
                    snake.push(cell);
                }
            }
        }

        return snake;
    }

    private getGridSprial(): MasonryCell[] {
        const center: MasonryCell = {
            r: Math.floor(Math.min(this.rows, this.cols) / 2),
            c: Math.floor(this.cols / 2),
        };
        const visited: Set<string> = new Set([center.toString()]);

        const directions: MasonryCell[] = [
            { r: -1, c: 0 },
            { r: 0, c: 1 },
            { r: 1, c: 0 },
            { r: 0, c: -1 },
        ];

        const spiral: MasonryCell[] = [center];

        let directionIndex = 0;
        let steps = 1;
        let stepCounter = 0;
        let directionChangeCounter = 0;

        let currentCell: MasonryCell = { ...center };

        // spiral portion
        while (visited.size < this.rows * this.cols) {
            const { r: dRow, c: dCol } = directions[directionIndex];
            const nextCell: MasonryCell = { r: currentCell.r + dRow, c: currentCell.c + dCol };

            if (
                nextCell.r >= 0 &&
                nextCell.r < this.rows &&
                nextCell.c >= 0 &&
                nextCell.c < this.cols &&
                !visited.has(`${nextCell.r},${nextCell.c}`)
            ) {
                currentCell = nextCell;
                visited.add(`${currentCell.r},${currentCell.c}`);
                stepCounter++;
                if (stepCounter === steps) {
                    stepCounter = 0;
                    directionIndex = (directionIndex + 1) % 4;
                    directionChangeCounter++;
                    if (directionChangeCounter % 2 === 0) {
                        steps++;
                    }
                }
            } else {
                directionIndex = (directionIndex + 1) % 4;
            }

            const compatibility = this.computeCellCompatibility(currentCell);
            currentCell.allowed = compatibility;
            spiral.push(currentCell);

            if (currentCell.r == 0 && currentCell.c == 0) {
                break;
            }
        }

        // snake portion
        for (let row = this.cols; row < this.rows; row++) {
            if (row % 2 === 0) {
                for (let col = 0; col < this.cols; col++) {
                    const cell = { r: row, c: col };
                    spiral.push(cell);
                }
            } else if (row % 2 !== 0) {
                for (let col = this.cols - 1; col >= 0; col--) {
                    const cell = { r: row, c: col };
                    spiral.push(cell);
                }
            }
        }

        return spiral;
    }

    private computeCellCompatibility(cell: MasonryCell): BrickCompatibility {
        // square bricks are not allowed to be placed 3 or more in a row on the same axis
        // up bricks and down bricks are not allowed to be placed 2 or more in a row on the same axis
        // left bricks and right bricks are not allowed to be placed 2 or more in a row on the same axis
        // up, down, left, and right bricks have width 2 in the direction they are pointing (cross-axis = 1)
        // square bricks have width 1 in all directions

        const { r: row, c: col } = cell;

        const compatibility: BrickCompatibility = {
            [Shape.SQUARE]: true,
            [Shape.UP]: true,
            [Shape.DOWN]: true,
            [Shape.LEFT]: true,
            [Shape.RIGHT]: true,
        };

        const vert = [Shape.UP, Shape.DOWN];
        const horz = [Shape.LEFT, Shape.RIGHT];

        const { up, down, left, right } = this.getSurroundingBricks(row, col);

        // check long bricks
        if (up) {
            compatibility[Shape.UP] = false;
            compatibility[Shape.DOWN] = !vert.includes(up.dir);
        }
        if (down) {
            compatibility[Shape.UP] = !vert.includes(down.dir) && compatibility[Shape.UP];
            compatibility[Shape.DOWN] = false;
        }
        if (left) {
            compatibility[Shape.LEFT] = false;
            compatibility[Shape.RIGHT] = !horz.includes(left.dir);
        }
        if (right) {
            compatibility[Shape.LEFT] = !horz.includes(right.dir) && compatibility[Shape.LEFT];
            compatibility[Shape.RIGHT] = false;
        }

        // check square bricks
        if (up && down) {
            compatibility[Shape.SQUARE] = up.dir !== Shape.SQUARE && down.dir !== Shape.SQUARE;
        }
        if (left && right) {
            compatibility[Shape.SQUARE] = left.dir !== Shape.SQUARE && right.dir !== Shape.SQUARE;
        }

        // check grid edges
        if (row === 0) {
            compatibility[Shape.UP] = false;
        }
        if (row === this.rows - 1) {
            compatibility[Shape.DOWN] = false;
        }
        if (col === 0) {
            compatibility[Shape.LEFT] = false;
        }
        if (col === this.cols - 1) {
            compatibility[Shape.RIGHT] = false;
        }

        return compatibility;
    }

    private addBrick(): Brick | undefined {
        const b = new Brick();
        b.randomizeDirection();

        for (let i = 0; i < this.gridSpiral.length; i++) {
            const cell = this.gridSpiral[i];
            if (this.containsBrick(cell.r, cell.c) || this.isExcluded(cell.r, cell.c)) {
                continue;
            }
            cell.allowed = this.computeCellCompatibility(cell);

            this.log(`\t(${b.toString()}) at [${cell.r},${cell.c}] =>`, compatibilityString(cell.allowed));

            this.gridSpiral[i].allowed = cell.allowed;
            if (cell.allowed[b.dir]) {
                this.log(`\t✔ Placed ${this.bricks.length} (${b.toString()}) at [${cell.r},${cell.c}]`);
                b.r = cell.r;
                b.c = cell.c;
                return this.placeBrick(cell.r, cell.c, b);
            }
        }
        return undefined;
    }

    private placeBrick(row: number, col: number, brick: Brick): Brick {
        const index = this.bricks.length;
        this.gridState[row][col] = this.bricks.length;
        switch (brick.dir) {
            case Shape.SQUARE:
                break;
            case Shape.UP:
                this.gridState[row - 1][col] = index;
                break;
            case Shape.DOWN:
                this.gridState[row + 1][col] = index;
                break;
            case Shape.LEFT:
                this.gridState[row][col - 1] = index;
                break;
            case Shape.RIGHT:
                this.gridState[row][col + 1] = index;
                break;
        }
        this.bricks.push(brick);
        return brick;
    }

    private getSurroundingBricks(row: number, col: number): SurroundingBricks {
        const bricks: SurroundingBricks = {
            center: this.getBrickAt(row, col),
        };

        if (row > 0) {
            bricks.up = this.getBrickAt(row - 1, col);
        }
        if (row < this.rows - 1) {
            bricks.down = this.getBrickAt(row + 1, col);
        }
        if (col > 0) {
            bricks.left = this.getBrickAt(row, col - 1);
        }
        if (col < this.cols - 1) {
            bricks.right = this.getBrickAt(row, col + 1);
        }
        return bricks;
    }

    private getBrickAt(row: number, col: number): Brick {
        return this.bricks[this.gridState[row][col]];
    }

    private containsBrick(row: number, col: number): boolean {
        return this.gridState[row][col] !== -1;
    }

    private log(...args: any[]): void {
        if (this.debug) {
            console.log(...args);
        }
    }

    public getBricks(): Brick[] {
        return this.bricks;
    }

    public get width(): number {
        return this.cols;
    }

    public get height(): number {
        return this.rows;
    }

    public toString(): string {
        let str = "";
        for (let i = 0; i < this.rows; i++) {
            str +=
                this.gridState[i].map((n: number) => (n === -1 ? "\u2B1A" : n.toString()).padStart(2, " ")).join(" ") +
                "\n";
        }
        return str;
    }
}
