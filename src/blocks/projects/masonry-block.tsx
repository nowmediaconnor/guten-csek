/*
 * Created on Sat Dec 09 2023
 * Author: Connor Doman
 */

import React, { useEffect, useState } from "react";
import { BlockController, GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";
import { CsekBlockHeading } from "../../components/heading";
import { useBlockProps } from "@wordpress/block-editor";
import { MasonryGrid } from "../../scripts/masonry/masonry";
import { CsekSelectDropdown, TextInput } from "../../components/input";
import { error, log } from "../../scripts/global";
import CsekCard from "../../components/card";
import { PostCategory, WPPost, findCategoryId, getAllCategories, getAllPosts } from "../../scripts/wp";
import { decodeHtmlEntities } from "../../scripts/strings";

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

async function getAllProjects(category?: number): Promise<CsekProject[]> {
    const projectsData: CsekProject[] = [];
    const categoryFilter = category ? `&_filter[category_name]=${category}` : "";

    // const targetUrl = `/wp-json/wp/v2/posts/?_fields=id,link,title,_links${categoryFilter}`;
    // console.log(`Fetching projects from ${targetUrl}...`);
    // const res = await fetch(targetUrl);
    // const data: WPPostData[] = await res.json();

    const posts: WPPost[] = await getAllPosts(undefined, [category ?? -1]);

    for (const project of posts) {
        if (project.featuredImage) {
            const projectData: CsekProject = {
                id: project.id,
                title: decodeHtmlEntities(project.title),
                link: project.url,
                featuredImageUrl: project.featuredImage.large,
            };
            projectsData.push(projectData);
        }
    }
    return projectsData;
}

export interface ProjectsMasonryBlockAttributes {
    categoryId: number;
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

    category: number;

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
        this.category = parseInt(this.gridArea.dataset.category || "-1");

        getAllProjects(this.category).then((data: CsekProject[]) => {
            this.projectsData = data;

            const rowString = this.gridArea.dataset.gridrows || "-1";
            const colString = this.gridArea.dataset.gridcols || "3";

            const cols = parseInt(colString);

            if (rowString === "-1") {
                console.warn("No grid rows specified, using:", MasonryGrid.calculateGridHeight(cols, data.length));
            }
            this.gridRows =
                rowString !== "-1" ? parseInt(rowString) : MasonryGrid.calculateGridHeight(cols, data.length);
            this.gridCols = cols;

            log(this.projectsData);
            this.calculateMasonry();
            this.createSurroundingDivs();
        });
    }

    calculateMasonry(): void {
        const numBricks = this.projectsData.length;
        this.masonryGrid = new MasonryGrid(this.gridRows, this.gridCols);
        this.masonryGrid.debug = this.debug;
        this.masonryGrid.placeBricks(numBricks);
        log(this.masonryGrid.toString());
    }

    createSurroundingDivs(): void {
        const gridCoords = this.masonryGrid.calculateCSSGridCoords();

        this.gridArea.style.setProperty("--num-rows", this.masonryGrid.numRowsNeeded().toString());
        this.gridArea.style.setProperty("--num-cols", this.masonryGrid.width.toString());

        this.projectsData.forEach((project: CsekProject, index) => {
            const coords = gridCoords[index];

            if (!coords) {
                error(`No coords for index ${index} (project ${project.title})`);
                return;
            }

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

        const { categoryId, category, amount, gridColumns, gridRows } = attributes;

        const [parentCategories, setParentCategories] = useState<PostCategory[]>([]);
        const [currentCategory, setCurrentCategory] = useState<number>(categoryId);
        const [categorySlug, setCategorySlug] = useState<string>("");

        useEffect(() => {
            getAllCategories().then((categories) => {
                setParentCategories(categories);
                if (!category) setCurrentCategory(categories[0].id);
            });
        }, []);

        return (
            <section {...blockProps}>
                <CsekBlockHeading>Posts Masonry Block</CsekBlockHeading>
                <CsekCard className="flex flex-row gap-2">
                    {parentCategories.length === 0 ? (
                        <p>Loading categories...</p>
                    ) : (
                        <CsekSelectDropdown
                            label="Category"
                            hint="This is the parent category for the posts to be displayed. The categories shown to the user will be subcategories of this category."
                            options={parentCategories.map((c) => {
                                return { label: c.name, value: c.slug };
                            })}
                            onChange={(value: string) => {
                                const category = findCategoryId(parentCategories, value) ?? -1;
                                setCurrentCategory(category);
                                setCategorySlug(value);
                                setAttributes({ categoryId: category, category: value ?? "projects" });
                            }}
                            initialValue={categorySlug}
                        />
                    )}
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
                </CsekCard>
            </section>
        );
    };

    static saveComponent = ({ attributes }: GutenCsekBlockSaveProps<ProjectsMasonryBlockAttributes>) => {
        const blockProps = useBlockProps.save();

        const { categoryId, category, amount, gridColumns, gridRows } = attributes;

        return (
            <section {...blockProps}>
                <div
                    className="projects-grid"
                    data-gridcols={gridColumns}
                    data-gridrows={gridRows}
                    data-category={categoryId}></div>
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
