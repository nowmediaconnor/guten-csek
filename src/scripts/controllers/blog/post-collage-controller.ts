/*
 * Created on Tue Jan 02 2024
 * Author: Connor Doman
 */

import { BlockController } from "../../dom";
import { log } from "../../global";
import { decodeHtmlEntities } from "../../strings";
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
    post: WPPost;
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

    constructor(block: HTMLElement) {
        this.block = block;
        this.category = -1;
        this.currentTag = -1;
        this.posts = [];
        this.tags = [];
        this.relatedPosts = [];
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
                post: p,
            };

            this.relatedPosts.push(related);
        }

        this.tagLinks = this.block.querySelectorAll(".tag-nav ul li a");
        this.relatedPostsArea = this.block.querySelector(".collage-related-posts") as HTMLElement;

        // const gridElements = await this.buildPostsGrid(this.relatedPosts);
        // this.relatedPostsArea.append(...gridElements);

        this.relatedPostsArea.addEventListener("transitionend", (e) => {
            const target = e.target as HTMLElement;
            if (
                !target ||
                target.classList.contains(".collage-related-posts") ||
                e.propertyName !== "opacity" ||
                target.style.opacity !== "0"
            ) {
                return;
            }

            this.relatedPostsArea.innerHTML = "";

            for (const post of this.relatedPosts) {
                if (this.currentTag === -1 || post.tags.includes(this.currentTag)) {
                    post.dom.style.display = "block";
                } else {
                    post.dom.style.display = "none";
                }
            }

            const visiblePosts = this.relatedPosts.filter((post) => post.dom.style.display === "block");

            this.buildPostsGrid(visiblePosts).then((elmts) => {
                target.append(...elmts);
                target.style.opacity = "1";
            });
        });

        this.tagLinks.forEach((link, index) => {
            if (index === 0) {
                link.classList.add("chosen");
            }

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
        this.log("updating...");
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

    async createRelatedPostGrid(posts: WPPost[] | RelatedPostDOM[]): Promise<HTMLElement> {
        function isRelatedPostDOM(post: any): post is RelatedPostDOM {
            return post.hasOwnProperty("dom");
        }

        const grid = document.createElement("div");
        grid.classList.add("related-posts-grid");

        for (const post of posts) {
            if (isRelatedPostDOM(post)) {
                grid.appendChild(post.dom);
                continue;
            }
            const postDOM = await generateRelatedPostDOM(post);
            grid.appendChild(postDOM);
        }

        return grid;
    }

    async createFeaturedPost(post: WPPost): Promise<HTMLElement> {
        const featuredPost = document.createElement("div");
        featuredPost.classList.add("featured-post");

        const featuredInner = document.createElement("div");
        featuredInner.classList.add("inner");
        featuredInner.style.backgroundImage = `url(${decodeHtmlEntities(post.featuredImage.full)})`;

        if (this.posts.length > this.postCount) {
            featuredInner.classList.add("visible");
        } else {
            featuredInner.classList.remove("visible");
        }

        const featuredContent = document.createElement("div");
        featuredContent.classList.add("featured-content");

        const titleLink = document.createElement("a");
        titleLink.href = post.url;
        const featuredTitle = document.createElement("h2");
        featuredTitle.classList.add("title");
        featuredTitle.innerHTML = post.title;
        titleLink.appendChild(featuredTitle);

        const readTime = document.createElement("div");
        readTime.classList.add("read-time");
        readTime.innerHTML = `${post.readTime} min read`;

        const tags = document.createElement("div");
        tags.classList.add("tags");
        tags.append(...(await makeTagList(post)));

        featuredContent.append(titleLink, readTime, tags);
        featuredInner.appendChild(featuredContent);
        featuredPost.appendChild(featuredInner);
        return featuredPost;
    }

    async buildPostsGrid(posts: RelatedPostDOM[]): Promise<HTMLElement[]> {
        this.log("building posts grid...");

        const elements: HTMLElement[] = [];
        if (posts.length > this.postCount) {
            const firstGrid = await this.createRelatedPostGrid(posts.slice(0, this.postCount));
            elements.push(firstGrid);

            const featuredPost = await this.createFeaturedPost(posts[Math.floor(Math.random() * posts.length)].post);
            elements.push(featuredPost);

            const secondGrid = await this.createRelatedPostGrid(posts.slice(this.postCount));
            elements.push(secondGrid);
        } else {
            const onlyGrid = await this.createRelatedPostGrid(posts);
            elements.push(onlyGrid);
        }
        return elements;
    }

    log(...args: any[]) {
        log("[PostCollageBlock]", ...args);
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
            const collageBlock = new PostCollageBlock(block);
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
