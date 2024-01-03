/*
 * Created on Tue Jan 02 2024
 * Author: Connor Doman
 */

import { BlockController } from "../../dom";
import {
    PostTag,
    WPPost,
    generateRelatedPostDOM,
    getAllPosts,
    getCategoryBySlug,
    getTagsByCategory,
    makeTagList,
} from "../../wp";

interface RelatedPostDOM {
    tags: number[];
    dom: HTMLElement;
}

class PostCollageBlock {
    block: HTMLElement;
    category: number;
    currentTag: number;
    postCount: number;
    posts: WPPost[];
    tags: PostTag[];

    tagLinks: NodeListOf<HTMLAnchorElement>;
    relatedPostsArea: HTMLElement;
    featuredPostArea: HTMLElement;

    relatedPosts: RelatedPostDOM[];

    log: (...args: any[]) => void;

    constructor(block: HTMLElement, log = console.log) {
        this.block = block;
        this.category = -1;
        this.currentTag = -1;
        this.posts = [];
        this.tags = [];
        this.relatedPosts = [];
        this.log = log;
    }

    async setup() {
        this.category = parseInt(this.block.dataset.chosenCategory ?? "-1");
        this.tags = JSON.parse(this.block.dataset.foundTags || "[]") as PostTag[];
        this.postCount = parseInt(this.block.dataset.postCount ?? "6");

        this.posts = await getAllPosts(undefined, [this.category]);

        for (const p of this.posts) {
            const dom = await generateRelatedPostDOM(p);

            const related = {
                tags: p.tags,
                dom,
            };

            this.relatedPosts.push(related);
        }

        this.tagLinks = this.block.querySelectorAll(".tag-nav ul li a");
        this.relatedPostsArea = this.block.querySelector(".collage-related-posts") as HTMLElement;

        this.relatedPosts.forEach((related) => {
            this.relatedPostsArea.appendChild(related.dom);
        });

        this.relatedPostsArea.addEventListener("transitionend", () => {
            for (const post of this.relatedPosts) {
                if (this.currentTag === -1 || post.tags.includes(this.currentTag)) {
                    post.dom.style.display = "block";
                } else {
                    post.dom.style.display = "none";
                }
            }
            this.relatedPostsArea.style.opacity = "1";
        });

        this.tagLinks.forEach((link) => {
            link.addEventListener("click", async (e) => {
                e.preventDefault();

                const id = parseInt(link.dataset.tagId ?? "-1");

                this.currentTag = id;
                await this.update();
            });
        });

        await this.update();
    }

    async update() {
        this.relatedPostsArea.style.opacity = "0";

        this.tagLinks.forEach((link) => {
            const id = parseInt(link.dataset.tagId ?? "-1");
            if (id === this.currentTag) {
                link.classList.add("chosen");
            } else {
                link.classList.remove("chosen");
            }
        });
    }

    async createRelatedPostGrid(posts: WPPost[]) {
        const grid = document.createElement("div");
        grid.classList.add("related-posts-grid");

        for (const post of posts) {
            const postDOM = await generateRelatedPostDOM(post);
            grid.appendChild(postDOM);
        }

        return grid;
    }

    async createFeaturedPost(post: WPPost) {
        const featuredPost = document.createElement("div");
        featuredPost.classList.add("featured-post");

        const featuredInner = document.createElement("div");
        featuredInner.classList.add("inner");
        featuredInner.style.backgroundImage = `url(${
            this.posts[(Math.random() * this.posts.length) | 0].featuredImage.full
        })`;
        if (this.posts.length > this.postCount) {
            featuredInner.classList.add("visible");
        } else {
            featuredInner.classList.remove("visible");
        }

        const featuredContent = document.createElement("div");
        featuredContent.classList.add("featured-content");

        const featuredTitle = document.createElement("h2");
        featuredTitle.classList.add("featured-title");

        const readTime = document.createElement("div");
        readTime.classList.add("read-time");
        readTime.innerHTML = `${post.readTime} min read`;

        const tags = document.createElement("div");
        tags.classList.add("tags");
        tags.append(...(await makeTagList(post)));

        featuredContent.append(featuredTitle, readTime, tags);
        featuredInner.appendChild(featuredContent);
        featuredPost.appendChild(featuredInner);
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
