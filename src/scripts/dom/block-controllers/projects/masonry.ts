/*
 * Created on Sat Mar 16 2024
 * Author: Connor Doman
 */

import { CSSGridCoordinates, MasonryGrid } from "../../../masonry/masonry";
import { decodeHtmlEntities } from "../../../strings";
import { WPPost, getAllPosts } from "../../../wp";
import BlockController from "../block-controller";

interface CsekProject {
    id: number;
    title: string;
    link: string;
    featuredImageUrl: string;
}

/**
 * Retrieves all projects from the WordPress API.
 *
 * @param category - Optional category ID to filter the projects by.
 * @returns A promise that resolves to an array of CsekProject objects.
 */
async function getAllProjects(category?: number): Promise<CsekProject[]> {
    const projectsData: CsekProject[] = [];

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

export default class MasonryController extends BlockController {
    debug = true;

    private gridArea: HTMLElement;

    private projectsData: CsekProject[];

    private brickWidth: number;
    private brickHeight: number;

    private masonryGrid: MasonryGrid;
    private gridCols: number;
    private gridRows: number;

    private category: number;

    setup(): boolean {
        const grid = this.block.querySelector(".projects-grid");
        if (!grid) {
            this.warn("No grid area found in block, creating one...");
            this.gridArea = document.createElement("div");
            this.gridArea.classList.add("projects-grid");
        } else {
            this.info("Grid area found in block, using it.");
            this.gridArea = grid as HTMLElement;
        }

        this.projectsData = [];

        this.category = parseInt(this.gridArea.dataset.category || "-1");

        getAllProjects(this.category).then((data: CsekProject[]) => {
            this.projectsData = data;

            const gridAreaData = this.gridArea.dataset;
            const rowString = gridAreaData.gridrows ?? "-1";
            const colString = gridAreaData.gridcols ?? "3";

            const cols = parseInt(colString);

            // check if rows are specified and set accordingly
            if (rowString === "-1") {
                const backupRows = MasonryGrid.calculateGridHeight(cols, this.projectsData.length);
                this.gridRows = backupRows;
                this.warn("No grid rows specified. Using:", backupRows);
            } else {
                this.gridRows = parseInt(rowString);
            }

            // set cols
            this.gridCols = cols;

            this.info("Found projects data:", this.projectsData);
            this.calculdateMasonry();
            this.createSurroundingDivs();
        });

        return true;
    }

    calculdateMasonry() {
        const numBricks = this.projectsData.length;
        this.masonryGrid = new MasonryGrid(this.gridRows, this.gridCols);
        this.masonryGrid.debug = this.debug;
        this.masonryGrid.placeBricks(numBricks);
        this.info("\n" + this.masonryGrid.toString());
    }

    createSurroundingDivs() {
        const gridCoords = this.masonryGrid.calculateCSSGridCoords();

        this.gridArea.style.setProperty("--num-rows", this.masonryGrid.numRowsNeeded().toString());
        this.gridArea.style.setProperty("--num-cols", this.masonryGrid.width.toString());

        this.projectsData.forEach((project: CsekProject, index: number) => {
            const coords = gridCoords[index];

            if (!this.validate(coords, `Invalid grid coordinates for index ${index}`, "Valid grid coordinates")) return;

            const brick = this.createBrick(coords, project, index);

            this.gridArea.appendChild(brick);
        });
    }

    createBrick(gridCoords: CSSGridCoordinates, project: CsekProject, projectIndex: number): HTMLElement {
        const projectBrick = document.createElement("div");
        projectBrick.classList.add("project-brick");
        projectBrick.classList.add(gridCoords.size);
        projectBrick.style.gridColumnStart = gridCoords.colStart.toString();
        projectBrick.style.gridColumnEnd = gridCoords.colEnd.toString();
        projectBrick.style.gridRowStart = gridCoords.rowStart.toString();
        projectBrick.style.gridRowEnd = gridCoords.rowEnd.toString();

        const projectLink = document.createElement("a");
        projectLink.href = project.link;
        projectLink.style.animationDelay = `${projectIndex * 133}ms`;

        const projectTitle = document.createElement("span");
        projectTitle.innerHTML = project.title;

        const projectImage = document.createElement("img");
        projectImage.src = project.featuredImageUrl;
        projectImage.alt = project.title;

        projectLink.appendChild(projectImage);
        projectLink.appendChild(projectTitle);
        projectBrick.appendChild(projectLink);
        return projectBrick;
    }

    onMouseMove(e: MouseEvent): void {}
    onMouseEnter(e: MouseEvent): void {}
    onMouseLeave(e: MouseEvent): void {}
    onClick(x: number, y: number): void {}
    onPageScroll(scrollY: number): void {}
    onPageResize(width: number, height: number): void {}
    onPageLoad(): void {}
    onEnterViewport(): void {}
    onExitViewport(): void {}
}
