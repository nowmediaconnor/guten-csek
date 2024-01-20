/*
 * Created on Sat Dec 30 2023
 * Author: Connor Doman
 */

import { CsekImage } from "./image";
import { decodeHtmlEntities, removeHTMLTags } from "./strings";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";
import { WP_Query, WP_REST_API_Attachment, WP_REST_API_Attachments } from "wp-types";

export interface WPPost {
    id: number;
    url: string;
    slug: string;
    title: string;
    categories: number[];
    tags: number[];
    featuredImage: CsekImage;
    readTime: number;
}

export interface PostTag {
    id: number;
    name: string;
    slug: string;
    description: string;
    url: string;
}

export interface PostCategory {
    id: number;
    name: string;
    slug: string;
    description: string;
    url: string;
    children?: PostCategory[];
}

export async function getAllMedia(): Promise<WP_REST_API_Attachments> {
    const media: WP_REST_API_Attachments = await apiFetch({ path: "/wp/v2/media", method: "GET" });
    return media;
}

export async function getMediaById(id: number): Promise<WP_REST_API_Attachment> {
    const media: WP_REST_API_Attachment = await apiFetch({ path: `/wp/v2/media/${id}`, method: "GET" });
    return media;
}

export async function getAllPosts(tags?: number[], categories?: number[]) {
    try {
        // check if parameters provided, filter out -1 values ("all")
        const filteredTags = tags && tags.length > 0 ? tags.filter((t) => t > -1) : [];
        const filteredCategories = categories && categories.length > 0 ? categories.filter((c) => c > -1) : [];

        // build query string if tags or categories still remaining
        const tagQuery = filteredTags.length > 0 ? "&tags=" + filteredTags.join(",") : "";
        const categoryQuery = filteredCategories.length > 0 ? "&categories=" + filteredCategories.join(",") : "";

        // fetch posts
        const res = await fetch(`/wp-json/wp/v2/posts?context=view${tagQuery}${categoryQuery}`);
        const postsData = await res.json();

        const posts: WPPost[] = [];

        for (const post of postsData) {
            const img = new CsekImage(post.featured_media);
            await img.preload();

            posts.push({
                id: post.id,
                url: post.link,
                slug: post.slug,
                title: post.title.rendered,
                categories: post.categories,
                tags: post.tags,
                featuredImage: img,
                readTime: calculateReadTime(post.content.rendered),
            });
        }

        return posts;
    } catch (error: any) {
        console.error(error);
    }
    return [];
}

export async function getAllTags(): Promise<PostTag[]> {
    try {
        const res = await fetch(`/wp-json/wp/v2/tags?context=view`);
        const tagData = await res.json();

        const tags: PostTag[] = [];

        tagData.forEach((tag: any) => {
            tags.push({
                id: tag.id,
                name: tag.name,
                slug: tag.slug,
                description: tag.description,
                url: tag.link,
            });
        });

        return tags;
    } catch (error: any) {
        console.error(error);
    }
    return [];
}

export async function getAllCategories(): Promise<PostCategory[]> {
    try {
        const res = await fetch(`/wp-json/wp/v2/categories?context=view`);
        const categoryData = await res.json();

        const categories: PostCategory[] = [];

        const parentCategories: Set<PostCategory> = new Set();

        categoryData.forEach((category: any) => {
            if (category.parent === 0) {
                parentCategories.add({
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    url: category.link,
                });
            }
        });

        categoryData.forEach((category: any) => {
            if (category.parent !== 0) {
                const parent = [...parentCategories].find((parent) => parent.id === category.parent);
                if (parent) {
                    if (!parent.children) {
                        parent.children = [];
                    }
                    parent.children.push({
                        id: category.id,
                        name: category.name,
                        slug: category.slug,
                        description: category.description,
                        url: category.link,
                    });
                }
            }
        });

        parentCategories.forEach((parent) => {
            categories.push(parent);
        });

        return categories;
    } catch (error) {
        console.error(error);
    }
    return [];
}

export async function getTagsByCategory(...categories: number[]): Promise<PostTag[]> {
    const allTags: PostTag[] = await getAllTags();

    const foundTags = new Set<PostTag>();

    const posts = await getAllPosts(undefined, categories);

    posts.forEach((post: WPPost) => {
        post.tags.forEach((tagId: number) => {
            const tag = allTags.find((tag) => tag.id === tagId);
            if (tag) {
                foundTags.add(tag);
            }
        });
    });

    return [...foundTags];
}

export function findCategoryId(categories: PostCategory[], slug: string): number | undefined {
    const category = categories.find((category) => category.slug === slug);
    return category?.id;
}

export function getCategoryBySlug(slug: string): Promise<PostCategory | undefined> {
    return new Promise(async (resolve, reject) => {
        try {
            const categories = await getAllCategories();
            const category = categories.find((category) => category.slug === slug);

            if (!category) {
                reject(`Could not find category with slug ${slug}`);
                return;
            }

            resolve(category);
        } catch (error) {
            reject(error);
        }
    });
}

export async function getCategoriesFromParent(parentId: number): Promise<PostCategory[] | undefined> {
    try {
        const parentCategory = parentId > -1 ? `&parent=${parentId}` : "";

        const res = await fetch(`/wp-json/wp/v2/categories?context=view${parentCategory}`);
        const categoryData = await res.json();

        const categories: PostCategory[] = [];

        categoryData.forEach((category: any) => {
            categories.push({
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                url: category.link,
            });
        });

        return categories;
    } catch (err) {
        console.error(err);
    }
    return undefined;
}

export function calculateReadTime(content: string): number {
    const words = removeHTMLTags(content).split(" ");
    const readTime = Math.ceil(words.length / 225);
    return readTime;
}

export async function makeTagList(post: WPPost): Promise<HTMLElement[]> {
    const allTags = await getAllTags();
    const postTags = allTags.filter((tag: PostTag) => {
        return post.tags.includes(tag.id);
    });

    const tagLimit = 2;

    const tagLinks: HTMLElement[] = postTags
        .filter((_, index: number) => {
            return index < tagLimit;
        })
        .map((tag: PostTag) => {
            const tagLink = document.createElement("a");
            tagLink.href = tag.url;
            tagLink.classList.add("chip");
            tagLink.innerHTML = tag.name;
            return tagLink;
        });

    if (postTags.length > tagLimit) {
        const remainingTags = postTags
            .slice(tagLimit)
            .map((tag: PostTag) => {
                return decodeHtmlEntities(tag.name);
            })
            .join(", ");
        const moreTagLink = document.createElement("a");
        moreTagLink.href = "#";
        moreTagLink.classList.add("chip");
        moreTagLink.title = remainingTags;
        moreTagLink.innerHTML = `+${postTags.length - tagLimit}`;

        tagLinks.push(moreTagLink);
    }

    return tagLinks;
}

export async function generateRelatedPostDOM(post: WPPost): Promise<HTMLElement> {
    const postDOM = document.createElement("div");
    postDOM.classList.add("related-post");

    const postLink = document.createElement("a");
    postLink.href = post.url;
    postLink.classList.add("post-link");

    const featuredImage = document.createElement("img");
    if (post.featuredImage) {
        featuredImage.classList.add("featured-image");
        featuredImage.src = post.featuredImage.getSize("large", "full");
        featuredImage.alt = post.featuredImage.altText;
        postLink.append(featuredImage);
    }

    const textContent = document.createElement("div");
    textContent.classList.add("text-content");

    const title = document.createElement("h2");
    title.classList.add("title");
    const splitTitle = decodeHtmlEntities(post.title).split("|");
    const mainTitle = splitTitle[0].trim();
    title.innerText = mainTitle;

    const readTime = document.createElement("div");
    readTime.classList.add("read-time");
    readTime.innerHTML = `${post.readTime} min read`;

    const tags = document.createElement("div");
    tags.classList.add("tags");
    tags.append(...(await makeTagList(post)));

    textContent.append(title, readTime);

    postLink.append(textContent);

    postDOM.append(postLink, tags);

    return postDOM;
}
