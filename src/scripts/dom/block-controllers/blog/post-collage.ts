/*
 * Created on Sat Mar 16 2024
 * Author: Connor Doman
 */

import { decodeHtmlEntities } from "../../../strings";
import {
    PostCategory,
    PostTag,
    WPPost,
    generateRelatedPostDOM,
    getAllPosts,
    getCategoriesFromParent,
    makeTagList,
} from "../../../wp";
import BlockController from "../block-controller";

interface RelatedPostDOM {
    tags: number[];
    categories: number[];
    dom: HTMLElement;
    post: WPPost;
}

export default class PostCollageController extends BlockController {
    category: number;
    currentCategory: number;
    postCount: number;
    posts: WPPost[];
    tags: PostTag[];

    categories: PostCategory[];

    categoryLinkList: HTMLUListElement;

    categoryLinks: NodeListOf<HTMLAnchorElement>;
    relatedPostsArea: HTMLElement;
    featuredPostArea: HTMLElement;

    relatedPosts: RelatedPostDOM[];

    constructor(block: HTMLElement) {
        super(block);
        this.category = -1;
        this.currentCategory = -1;
        this.posts = [];
        this.tags = [];
        this.relatedPosts = [];
    }

    setup(): boolean {
        const blockData = this.block.dataset;

        this.category = parseInt(blockData.chosenCategory ?? "-1");
        this.tags = JSON.parse(blockData.foundTags || "[]") as PostTag[];
        this.postCount = parseInt(blockData.postCount ?? "6");

        this.setupAsync();

        return true;
    }

    async setupAsync() {
        await this.fetchPostData();

        this.categoryLinkList = this.block.querySelector(".tag-nav ul") as HTMLUListElement;
        this.validate(this.categoryLinkList, "Category link list not found", "Category link list found.");
        await this.buildCategoryLinks();

        await this.fetchRelatedPosts();
        this.categoryLinks = this.categoryLinkList.querySelectorAll("li a");
        this.validate(this.categoryLinks, "Category links not found", "Category links found.");
        this.relatedPostsArea = this.block.querySelector(".collage-related-posts") as HTMLElement;
        this.validate(this.relatedPostsArea, "Related posts area not found", "Related posts area found.");

        this.addEventListeners();
        this.prepareCategoryLinks();
        await this.updatePostData();
    }

    async updatePostData() {
        this.info("Updating post data...");
        this.relatedPostsArea.style.opacity = "0";

        this.categoryLinks.forEach((link) => {
            const id = parseInt(link.dataset.tagId ?? "-1");
            if (id === this.currentCategory) {
                link.classList.add("chosen");
            } else {
                link.classList.remove("chosen");
            }
        });
    }

    async fetchPostData() {
        this.posts = await getAllPosts(undefined, [this.category]);
        this.categories = await this.fetchCategories();
    }

    async fetchRelatedPosts() {
        for (const post of this.posts) {
            const dom = await generateRelatedPostDOM(post);

            const relatedPost = {
                tags: post.tags,
                categories: post.categories,
                dom,
                post,
            };

            this.relatedPosts.push(relatedPost);
        }
    }

    async buildCategoryLinks() {
        const links: HTMLElement[] = [];

        for (const cat of this.categories) {
            const link = document.createElement("a");
            link.href = "#" + cat.slug;
            link.textContent = decodeHtmlEntities(cat.name);
            link.dataset.tagId = cat.id.toString();

            const li = document.createElement("li");
            li.appendChild(link);

            links.push(li);
        }

        this.categoryLinkList.append(...links);
    }

    async fetchCategories(): Promise<PostCategory[]> {
        const cats = await getCategoriesFromParent(this.category);

        if (cats) {
            this.info("Post categories", cats);
            return cats;
        }

        return [];
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
        this.info("Building posts grid:", posts);

        const grid: HTMLElement[] = [];

        if (posts.length > this.postCount) {
            const firstGrid = await this.createRelatedPostGrid(posts.slice(0, this.postCount));
            grid.push(firstGrid);

            const featuredPost = await this.createFeaturedPost(posts[Math.floor(Math.random() * posts.length)].post);
            grid.push(featuredPost);

            const secondGrid = await this.createRelatedPostGrid(posts.slice(this.postCount));
            grid.push(secondGrid);
        } else {
            const onlyGrid = await this.createRelatedPostGrid(posts);
            grid.push(onlyGrid);
        }

        return grid;
    }

    addEventListeners() {
        this.relatedPostsArea.addEventListener("transitionend", (e: TransitionEvent) => {
            const target = e.target as HTMLElement;
            if (!target) {
                this.warn("No target");
                return;
            }

            if (!target.classList.contains("collage-related-posts")) {
                this.warn("Target not related posts area", { target });
                return;
            }

            if (e.propertyName !== "opacity") {
                this.warn("Transition not occurring on opacity", { e });
                return;
            }

            if (target.style.opacity !== "0") {
                this.warn("Opacity > 0", { target });
                return;
            }

            this.relatedPostsArea.innerHTML = "";

            for (const post of this.relatedPosts) {
                if (this.currentCategory === -1 || post.categories.includes(this.currentCategory)) {
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
    }

    prepareCategoryLinks() {
        this.categoryLinks.forEach((link, index) => {
            if (index === 0) {
                link.classList.add("chosen");
            }

            link.addEventListener("click", async (e) => {
                e.preventDefault();
                this.currentCategory = parseInt(link.dataset.tagId ?? "-1");
                this.updatePostData();
            });
        });
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
