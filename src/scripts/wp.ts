/*
 * Created on Sat Dec 30 2023
 * Author: Connor Doman
 */

export interface WPPost {
    id: number;
    url: string;
    slug: string;
    title: string;
    categories: number[];
    tags: number[];
    featuredImage: number;
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

        postsData.forEach((post: any) => {
            posts.push({
                id: post.id,
                url: post.link,
                slug: post.slug,
                title: post.title.rendered,
                categories: post.categories,
                tags: post.tags,
                featuredImage: post.featured_media,
            });
        });

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
