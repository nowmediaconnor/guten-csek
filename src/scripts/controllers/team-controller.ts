/*
 * Created on Tue Aug 29 2023
 * Author: Connor Doman
 */

import { BlockController } from "../dom";
import { WaypointInterpolator, Waypoint, randomInRange } from "../math";

interface Position {
    x: number;
    y: number;
}

class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    randomPoint(): Waypoint {
        return {
            x: this.x + randomInRange(0, this.width),
            y: this.y + randomInRange(0, this.height),
        };
    }
}

interface HeadshotNavigator {
    position: Position;
    interpolator: WaypointInterpolator;
    headshot: HTMLDivElement;
    block: HTMLElement;
}

export default class TeamController extends BlockController {
    private timeoutId: number;

    blockClassName: string;
    teamBlocks: NodeListOf<HTMLElement>;
    headshots: NodeListOf<HTMLDivElement>[];

    headshotWaypoints: Waypoint[][];

    interpolator: WaypointInterpolator;

    points: Waypoint[] = [
        { x: 0, y: 0 },
        { x: 1, y: 2 },
        { x: 3, y: 1 },
        { x: 4, y: 4 },
    ];

    headshotNavigators: HeadshotNavigator[] = [];

    animating: boolean = false;

    debugCanvas: HTMLCanvasElement;

    constructor(className: string, points?: Waypoint[]) {
        super();
        this.name = "TeamController";
        this.blockClassName = className;
        this.debug = true;

        if (points) this.points = points;
    }

    setup(): void {
        this.teamBlocks = document.querySelectorAll(this.blockClassName);

        if (this.invalid(this.teamBlocks.length > 0)) {
            this.log("No team blocks found.");
            return;
        }

        this.prepareCanvas();

        for (const block of this.teamBlocks) {
            // this.headshots.push(block.querySelectorAll(".headshot"));
            this.prepareHeadshotPoints(block);
        }

        this.isInitialized = true;
    }

    scroll() {
        this.log("Scrolling...");
        if (this.animating) return;

        this.animating = true;
        this.animate();
    }

    prepareHeadshotPoints(block: HTMLElement) {
        const headshots = block.querySelectorAll(".headshot") as NodeListOf<HTMLDivElement>;

        this.headshotWaypoints = [];

        // evens go left, odds go right
        const leftDimensionZone: Rectangle[] = [
            new Rectangle(0.25, 0.75, 0.125, 0.125),
            new Rectangle(0, 0.5, 0.125, 0.125),
            new Rectangle(0, 0, 0.25, 0.25),
        ];
        const rightDimensionZone: Rectangle[] = [
            new Rectangle(0.625, 0.75, 0.125, 0.125),
            new Rectangle(0.75, 0.375, 0.25, 0.25),
            new Rectangle(0.5, 0, 0.5, 0.25),
        ];

        const start: Waypoint = { x: 0.5, y: 1 };

        const generateWaypoints = (dimensions: Rectangle[]) => {
            const waypoints = [start];
            for (let i = 0; i < dimensions.length; i++) {
                const dim = dimensions[i];
                const point = dim.randomPoint();
                waypoints.push(point);
            }
            return waypoints;
        };

        const blockRect = block.getBoundingClientRect();

        headshots.forEach((headshot: HTMLDivElement, index: number) => {
            const isEven = index % 2 === 0;

            const waypoints = generateWaypoints(isEven ? leftDimensionZone : rightDimensionZone);

            const navigator = {
                position: start,
                interpolator: new WaypointInterpolator(waypoints, blockRect.width, blockRect.height),
                headshot,
                block,
            };
            this.headshotNavigators.push(navigator);
        });
    }

    animate() {
        if (!this.animating) return;

        this.timeoutId = window.setTimeout(() => {
            this.log("Animating...");
            this.animating = this.updateHeadshotPositions();
            this.animate();
        }, 1000);
    }

    updateHeadshotPositions(): boolean {
        let continueAnimation = true;
        this.clearCanvas();
        this.headshotNavigators.forEach((navigator: HeadshotNavigator, index: number) => {
            if (!continueAnimation) return;

            const { position, interpolator, headshot, block } = navigator;

            const blockRect = block.getBoundingClientRect();

            if (blockRect.bottom < 0 || blockRect.top > window.innerHeight) {
                this.log("Block is not on screen...");
                continueAnimation = false;
                return;
            } else {
                this.log("Block is animating");
            }

            const isEven = index % 2 === 0;

            const x = position.x + (isEven ? -0.01 : 0.01);

            const y = interpolator.at(x);

            const newPosition = { x, y };
            this.headshotNavigators[index].position = newPosition;
            this.log({ newPosition });

            headshot.style.left = `${x * blockRect.width}px`;
            headshot.style.top = `${y}px`;

            this.updateCanvas(navigator);
        });

        return continueAnimation;
    }

    prepareCanvas() {
        this.debugCanvas = document.getElementById("spline-debug") as HTMLCanvasElement;
        const ctx = this.debugCanvas.getContext("2d") as CanvasRenderingContext2D;
        this.clearCanvas();
    }

    clearCanvas() {
        if (!this.debugCanvas) return;

        const ctx = this.debugCanvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, this.debugCanvas.width, this.debugCanvas.height);
    }

    updateCanvas(navigator: HeadshotNavigator) {
        if (!this.debug || !this.debugCanvas) return;

        const ctx = this.debugCanvas.getContext("2d") as CanvasRenderingContext2D;

        const { position, interpolator, headshot, block } = navigator;

        this.clearCanvas();
        ctx.fillStyle = "black";
        ctx.fillText(`(${position.x.toFixed(2)}, ${position.y.toFixed(2)})`, 10, 10);

        ctx.beginPath();
        interpolator.interpolatedSet().forEach((y: number, index: number) => {
            const x = interpolator.x(index / 100);
            ctx.lineTo(x * this.debugCanvas.width, y * this.debugCanvas.height);
        });
        ctx.stroke();
    }
}
