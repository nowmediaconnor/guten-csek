/*
 * Created on Sat Dec 09 2023
 * Author: Connor Doman
 */

import React from "react";
import { BlockController, GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";
import { CsekBlockHeading } from "../../components/heading";
import { useBlockProps } from "@wordpress/block-editor";
import { MasonryGrid } from "../../scripts/masonry/masonry";
import { CsekSelectDropdown, TextInput } from "../../components/input";

interface WPPostData {
    id: number;
    link: string;
    title: {
        rendered: string;
    };
    _links: { [key: string]: [{ href: string; embeddable?: boolean; taxonomy?: string }] };
}

interface CsekProject {
    id: number;
    title: string;
    link: string;
    featuredImageUrl: string;
}

async function getAllProjects(): Promise<CsekProject[]> {
    const projectsData: CsekProject[] = [];
    const res = await fetch("/wp-json/wp/v2/posts/?filter[category_name]=project&_fields=id,link,title,_links");
    const data: WPPostData[] = await res.json();
    for (const project of data) {
        if (project._links["wp:featuredmedia"]) {
            const res = await fetch(project._links["wp:featuredmedia"][0].href);
            const data = await res.json();
            const projectData: CsekProject = {
                id: project.id,
                title: project.title.rendered,
                link: project.link,
                featuredImageUrl: data.source_url,
            };
            projectsData.push(projectData);
        }
    }
    return projectsData;
}

export interface ProjectsMasonryBlockAttributes {
    category: string;
    amount: number;
    gridColumns: number;
    gridRows: number;
}

export default class ProjectsMasonryBlock {
    debug: boolean = false;
    block: HTMLElement;

    gridArea: HTMLElement;

    projectsData: CsekProject[];

    brickWidth: number;
    brickHeight: number;

    masonryGrid: MasonryGrid;
    gridCols: number;
    gridRows: number;

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
        console.warn(this.gridArea.dataset);
        this.gridRows = parseInt(this.gridArea.dataset.gridrows || "10");
        this.gridCols = parseInt(this.gridArea.dataset.gridcols || "3");

        getAllProjects().then((data: CsekProject[]) => {
            this.projectsData = data;
            console.info("Projects data fetched, creating bricks...");
            console.log(this.projectsData);
            this.calculateMasonry();
            this.createSurroundingDivs();
        });
    }

    calculateMasonry(): void {
        const numBricks = this.projectsData.length;
        this.masonryGrid = new MasonryGrid(this.gridRows, this.gridCols);
        this.masonryGrid.debug = this.debug;
        // this.masonryGrid.excludeCell(0, 0);
        // this.masonryGrid.excludeCell(0, 1);
        // this.masonryGrid.excludeCell(0, 2);
        this.masonryGrid.placeBricks(numBricks);
        console.log(this.masonryGrid.toString());
    }

    createSurroundingDivs(): void {
        const gridCoords = this.masonryGrid.calculateCSSGridCoords();

        this.gridArea.style.setProperty("--num-rows", this.masonryGrid.numRowsNeeded().toString());
        this.gridArea.style.setProperty("--num-cols", this.masonryGrid.width.toString());

        this.projectsData.forEach((project: CsekProject, index) => {
            const coords = gridCoords[index];
            const projectBrick = document.createElement("div");
            projectBrick.classList.add("project-brick");
            projectBrick.classList.add(coords.size);
            projectBrick.style.gridColumnStart = coords.colStart.toString();
            projectBrick.style.gridColumnEnd = coords.colEnd.toString();
            projectBrick.style.gridRowStart = coords.rowStart.toString();
            projectBrick.style.gridRowEnd = coords.rowEnd.toString();

            const projectLink = document.createElement("a");
            projectLink.href = project.link;
            projectLink.style.animationDelay = `${index * 133}ms`;

            const projectTitle = document.createElement("span");
            projectTitle.innerHTML = project.title;

            const projectImage = document.createElement("img");
            projectImage.src = project.featuredImageUrl;
            projectImage.alt = project.title;

            projectLink.appendChild(projectImage);
            projectLink.appendChild(projectTitle);
            projectBrick.appendChild(projectLink);
            this.gridArea.appendChild(projectBrick);
        });
    }

    static editComponent = ({ attributes, setAttributes }: GutenCsekBlockEditProps<ProjectsMasonryBlockAttributes>) => {
        const blockProps = useBlockProps();

        const { category, amount, gridColumns, gridRows } = attributes;

        return (
            <section {...blockProps}>
                <CsekBlockHeading>Projects Masonry Block</CsekBlockHeading>
                <div className="flex flex-row gap-2">
                    <CsekSelectDropdown
                        options={[
                            { value: "1", label: "1" },
                            { value: "3", label: "3" },
                            { value: "5", label: "5" },
                        ]}
                        label="Grid Columns"
                        initialValue={gridColumns.toString()}
                        onChange={(value) => setAttributes({ gridColumns: parseInt(value) })}
                    />
                    {/* <CsekSelectDropdown
                        options={[
                            { value: "1", label: "1" },
                            { value: "2", label: "2" },
                            { value: "3", label: "3" },
                            { value: "4", label: "4" },
                            { value: "5", label: "5" },
                        ]}
                        label="Grid Rows"
                        initialValue={gridRows.toString()}
                        onChange={(value) => setAttributes({ gridRows: parseInt(value) })}
                    /> */}
                </div>
            </section>
        );
    };

    static saveComponent = ({ attributes }: GutenCsekBlockSaveProps<ProjectsMasonryBlockAttributes>) => {
        const blockProps = useBlockProps.save();

        const { category, amount, gridColumns, gridRows } = attributes;

        return (
            <section {...blockProps}>
                <div className="projects-grid" data-gridcols={gridColumns} data-gridrows={gridRows}></div>
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
            masonryBlock.debug = this.debug;
            masonryBlock.setup();
            this.masonryBlocks.push(masonryBlock);
        });

        this.isInitialized = true;
    }

    onMouseMove?(e: MouseEvent, blockIndex: number): void {}
}
