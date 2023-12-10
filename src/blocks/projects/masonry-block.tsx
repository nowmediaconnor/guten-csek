/*
 * Created on Sat Dec 09 2023
 * Author: Connor Doman
 */

import React from "react";
import { BlockController, GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";
import { CsekBlockHeading } from "../../components/heading";
import { useBlockProps } from "@wordpress/block-editor";

export interface ProjectsMasonryBlockAttributes {
    category: string;
    amount: number;
}

export default class ProjectsMasonryBlock {
    block: HTMLElement;

    masonryKernel: HTMLElement;

    projectsData: any[];

    constructor(block: HTMLElement) {
        this.block = block;
        const kernel = block.querySelector(".masonry-kernel") as HTMLElement;
        if (!kernel) throw new Error("No masonry kernel found");
        this.masonryKernel = kernel;
    }

    setup(): void {
        fetch("/wp-json/wp/v2/posts/?filter[category_name]=project")
            .then((res) => res.json())
            .then((data) => {
                this.projectsData = data;
                console.info("Projects data fetched, creating bricks...");
                console.log(this.projectsData);
                this.createSurroundingDivs();
            });
    }

    checkOverlap(div1: HTMLElement, div2: HTMLElement): boolean {
        const rect1 = div1.getBoundingClientRect();
        const rect2 = div2.getBoundingClientRect();

        const overlap = !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );

        return overlap;
    }

    createSurroundingDivs(): void {
        const kernelTop = this.masonryKernel.offsetTop;
        const kernelLeft = this.masonryKernel.offsetLeft;

        const divs: HTMLElement[] = [];
        this.projectsData.forEach((project: any) => {
            const brick = document.createElement("div");
            brick.classList.add("brick");

            while (true) {
                const angle = Math.random() * 2 * Math.PI;
                const distance = Math.random() * 200;

                const x = kernelTop + Math.cos(angle) * distance;
                const y = kernelLeft + Math.sin(angle) * distance;

                brick.style.left = `${x}px`;
                brick.style.top = `${y}px`;

                if (!divs.some((div) => this.checkOverlap(div, brick))) {
                    console.warn("New div not overlapping, adding it...");
                    break;
                }
                console.warn("New div overlapping, trying again...");
            }

            this.block.appendChild(brick);
            divs.push(brick);
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
                <div className="masonry-kernel"></div>
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
