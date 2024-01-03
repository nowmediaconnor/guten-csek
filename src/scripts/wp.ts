/*
 * Created on Sat Dec 30 2023
 * Author: Connor Doman
 */

import { CsekImage } from "./image";
import { decodeHtmlEntities, removeHTMLTags } from "./strings";

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

export async function getAllPosts(tags?: number[], categories?: number[]) {
    try {
        const tagQuery = tags ? "&tags=" + tags.join(",") : "";
        const categoryQuery = categories ? "&categories=" + categories.join(",") : "";
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
        console.log("found tags");
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
        console.log("found categories");
        const categoryData = await res.json();

        console.table(categoryData);

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

        console.info(parentCategories);

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
    featuredImage.classList.add("featured-image");
    featuredImage.src = post.featuredImage.large;
    featuredImage.alt = post.featuredImage.altText;

    const textContent = document.createElement("div");
    textContent.classList.add("text-content");

    const title = document.createElement("h2");
    title.classList.add("title");
    title.innerHTML = post.title;

    const readTime = document.createElement("div");
    readTime.classList.add("read-time");
    readTime.innerHTML = `${post.readTime} min read`;

    const tags = document.createElement("div");
    tags.classList.add("tags");
    tags.append(...(await makeTagList(post)));

    textContent.append(title, readTime);

    postLink.append(featuredImage, textContent);

    postDOM.append(postLink, tags);

    return postDOM;
}
