/*
 * Created on Sat Dec 09 2023
 * Author: Connor Doman
 */

import React from "react";
import { BlockController, GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";
import { CsekBlockHeading } from "../../components/heading";
import { useBlockProps } from "@wordpress/block-editor";
import { MasonryGrid } from "../../scripts/masonry/masonry";

export interface ProjectsMasonryBlockAttributes {
    category: string;
    amount: number;
}

export default class ProjectsMasonryBlock {
    block: HTMLElement;

    gridArea: HTMLElement;

    projectsData: any[];

    brickWidth: number;
    brickHeight: number;

    masonryGrid: MasonryGrid;

    constructor(block: HTMLElement) {
        this.block = block;
        const grid = block.querySelector(".projects-grid");
        if (!grid) {
            this.gridArea = document.createElement("div");
            this.gridArea.classList.add("projects-grid");
        } else {
            this.gridArea = grid as HTMLElement;
        }
        this.projectsData = [];
    }

    setup(): void {
        fetch("/wp-json/wp/v2/posts/?filter[category_name]=project")
            .then((res) => res.json())
            .then((data) => {
                this.projectsData = data;
                console.info("Projects data fetched, creating bricks...");
                console.log(this.projectsData);
                this.calculateMasonry();
                this.createSurroundingDivs();
            });
    }

    calculateMasonry(): void {
        const numBricks = this.projectsData.length;
        this.masonryGrid = new MasonryGrid(10, 3);
        this.masonryGrid.placeBricks(numBricks);
        console.log(this.masonryGrid.toString());
    }

    createSurroundingDivs(): void {
        const gridCoords = this.masonryGrid.calculateCSSGridCoords();

        this.projectsData.forEach((project, index) => {
            const coords = gridCoords[index];
            const projectBrick = document.createElement("div");
            projectBrick.classList.add("project-brick");
            projectBrick.classList.add(coords.size);
            projectBrick.style.gridColumnStart = coords.colStart.toString();
            projectBrick.style.gridColumnEnd = coords.colEnd.toString();
            projectBrick.style.gridRowStart = coords.rowStart.toString();
            projectBrick.style.gridRowEnd = coords.rowEnd.toString();

            this.gridArea.appendChild(projectBrick);
        });
    }

    static editComponent = ({ attributes, setAttributes }: GutenCsekBlockEditProps<ProjectsMasonryBlockAttributes>) => {
        const blockProps = useBlockProps();
        return (
            <section {...blockProps}>
                <CsekBlockHeading>Projects Masonry Block</CsekBlockHeading>
            </section>
        );
    };

    static saveComponent = ({ attributes }: GutenCsekBlockSaveProps<ProjectsMasonryBlockAttributes>) => {
        const blockProps = useBlockProps.save();

        return (
            <section {...blockProps}>
                <div className="projects-grid"></div>
            </section>
        );
    };
}

export class ProjectsMasonryController extends BlockController {
    blocks: NodeListOf<HTMLElement>;

    masonryBlocks: ProjectsMasonryBlock[];

    constructor() {
        super();
        this.name = "Csek Projects Masonry Block";
        this.masonryBlocks = [];
    }

    setup(): void {
        this.debug = true;
        this.blocks = document.querySelectorAll(".wp-block-guten-csek-projects-masonry-block");

        if (this.invalid(this.blocks.length)) {
            this.err("No blocks found");
            return;
        }

        this.blocks.forEach((block) => {
            const masonryBlock = new ProjectsMasonryBlock(block);
            masonryBlock.setup();
            this.masonryBlocks.push(masonryBlock);
        });

        this.isInitialized = true;
    }

    onMouseMove?(e: MouseEvent, blockIndex: number): void {}
}
