/*
 * Created on Tue Jan 02 2024
 * Author: Connor Doman
 */

import { BlockController } from "../../dom";
import { PostTag, WPPost, generateRelatedPostDOM, getAllPosts, getCategoryBySlug, getTagsByCategory } from "../../wp";

class PostCollageBlock {
    block: HTMLElement;
    category: number;
    currentTag: number;
    posts: WPPost[];
    tags: PostTag[];

    tagLinks: NodeListOf<HTMLAnchorElement>;
    relatedPostsArea: HTMLElement;

    log: (...args: any[]) => void;

    constructor(block: HTMLElement, log = console.log) {
        this.block = block;
        this.category = -1;
        this.currentTag = -1;
        this.posts = [];
        this.tags = [];
        this.log = log;
    }

    async setup() {
        this.category = parseInt(this.block.dataset.chosenCategory ?? "-1");
        this.tags = JSON.parse(this.block.dataset.foundTags || "[]") as PostTag[];

        this.tagLinks = this.block.querySelectorAll(".tag-nav ul li a");
        this.relatedPostsArea = this.block.querySelector(".collage-related-posts") as HTMLElement;

        this.tagLinks.forEach((link) => {
            link.addEventListener("click", async (e) => {
                e.preventDefault();

                const id = parseInt(link.dataset.tagId ?? "-1");

                if (id === -1) {
                    return;
                }

                this.currentTag = id;
                await this.update();
            });
        });

        await this.update();
    }

    async update() {
        const tagList = this.currentTag > -1 ? [this.currentTag] : undefined;
        this.posts = await getAllPosts(tagList, [this.category]);

        console.log(this.posts);

        this.relatedPostsArea.style.opacity = "0";
        this.relatedPostsArea.innerHTML = "";

        for (const post of this.posts) {
            const postElement = await generateRelatedPostDOM(post);
            this.relatedPostsArea.appendChild(postElement);
            // this.relatedPostsArea.style.height = `${relatedPostsBox.height}px`;
            this.relatedPostsArea.style.opacity = "1";
        }

        this.tagLinks.forEach((link) => {
            const id = parseInt(link.dataset.tagId ?? "-1");
            if (id === this.currentTag) {
                link.classList.add("chosen");
            } else {
                link.classList.remove("chosen");
            }
        });
    }
}

export default class PostCollageController extends BlockController {
    blocks: NodeListOf<HTMLElement>;

    collageBlocks: PostCollageBlock[];

    constructor() {
        super();
        this.name = "PostCollageBlock";
        this.collageBlocks = [];
    }

    setup(): void {
        this.debug = true;

        this.blocks = document.querySelectorAll(".wp-block-guten-csek-post-collage-block");

        if (this.invalid(this.blocks.length)) {
            this.err("No blocks found");
            return;
        }

        this.blocks.forEach((block) => {
            const collageBlock = new PostCollageBlock(block, (...args: any[]) => this.log(...args));
            this.collageBlocks.push(collageBlock);
        });

        this.collageBlocks.forEach((collageBlock, index: number) => {
            this.log(`Setting up collage block ${index}`);
            collageBlock.setup();
        });

        this.isInitialized = true;
    }

    async setupBlocks() {
        for (const collageBlock of this.collageBlocks) {
            await collageBlock.setup();
        }
    }

    onMouseMove?(e: MouseEvent, blockIndex: number): void {}
}
