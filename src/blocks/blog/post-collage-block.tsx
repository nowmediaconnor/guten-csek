/*
 * Created on Wed Dec 27 2023
 * Author: Connor Doman
 */

import React, { useEffect, useState } from "react";
import { useSelect } from "@wordpress/data";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";
import { CsekBlockHeading } from "../../components/heading";
import {
    PostCategory,
    PostTag,
    WPPost,
    findCategoryId,
    getAllCategories,
    getAllPosts,
    getTagsByCategory,
} from "../../scripts/wp";
import { CsekSelectDropdown } from "../../components/input";
import CsekCard from "../../components/card";
import { useBlockProps } from "@wordpress/block-editor";

export interface PostCollageBlockAttributes {
    chosenCategory: number;
    postCount: number;
    foundTags: PostTag[];
}

export const PostCollageBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<PostCollageBlockAttributes>) => {
    const { chosenCategory, postCount, foundTags } = attributes;

    const [tags, setTags] = useState<PostTag[]>([]);
    const [allTags, setAllTags] = useState<any>({});
    const [parentCategories, setParentCategories] = useState<PostCategory[]>([]);
    const [posts, setPosts] = useState<any>({});
    const [currentCategory, setCurrentCategory] = useState<number>(chosenCategory);
    const [categorySlug, setCategorySlug] = useState<string>("");

    useEffect(() => {
        getAllCategories().then((categories) => {
            setParentCategories(categories);
            if (!chosenCategory) setCurrentCategory(categories[0].id);
        });
    }, []);

    useEffect(() => {
        if (currentCategory) {
            getAllPosts(undefined, [currentCategory]).then((posts) => {
                setPosts(posts);
            });

            getTagsByCategory(currentCategory).then((tags) => {
                setTags(tags);
            });

            setAttributes({ chosenCategory: currentCategory });
        }
    }, [currentCategory, parentCategories]);

    useEffect(() => {
        if (tags) {
            setAttributes({ foundTags: tags });
        }
    }, [tags]);

    return (
        <section>
            <CsekBlockHeading text="Post Collage Block" />
            <CsekCard>
                <CsekSelectDropdown
                    label="Category"
                    options={parentCategories.map((c) => {
                        return { label: c.name, value: c.slug };
                    })}
                    onChange={(value: string) => {
                        const category = findCategoryId(parentCategories, value);
                        setCurrentCategory(category ?? -1);
                        setCategorySlug(value);
                    }}
                    initialValue={categorySlug}
                />
                <pre>{JSON.stringify(parentCategories, null, 2)}</pre>
            </CsekCard>
        </section>
    );
};

interface RelatedPostProps {
    post: WPPost;
    tags: PostTag[];
}

const RelatedPost = ({ post, tags }: RelatedPostProps) => {
    const { url, title, featuredImage, readTime } = post;

    const tagLimit = 2;

    const tagLinks: JSX.Element[] = tags
        .filter((_, index: number) => {
            return index < tagLimit;
        })
        .map((tag: PostTag) => {
            return (
                <a href={tag.url} key={tag.slug} className="chip">
                    {tag.name}
                </a>
            );
        });

    if (tags.length > tagLimit) {
        const remainingTags = tags
            .slice(tagLimit)
            .map((tag: PostTag) => {
                return tag.name;
            })
            .join(", ");

        tagLinks.push(
            <a href="#" key="more" className="chip" title={remainingTags}>
                +{tags.length - tagLimit}
            </a>
        );
    }

    return (
        <div className="related-post">
            <div className="featured-image">
                <img src={featuredImage.medium} />
            </div>
            <div className="text-content">
                <h2 className="title">
                    <a href={url}>{title}</a>
                </h2>
                <div className="read-time">
                    <span>{readTime}</span> MIN READ
                </div>
                <div className="tags">{tagLinks}</div>
            </div>
        </div>
    );
};

export const PostCollageBlockSave = ({ attributes }: GutenCsekBlockSaveProps<PostCollageBlockAttributes>) => {
    const blockProps = useBlockProps.save();
    const { chosenCategory, postCount, foundTags } = attributes;

    return (
        <section
            {...blockProps}
            data-post-count={postCount}
            data-chosen-category={chosenCategory}
            data-found-tags={JSON.stringify(foundTags)}>
            <div className="inner-container">
                <nav className="tag-nav">
                    <ul>
                        <li>
                            <a href="#">All</a>
                        </li>
                        {foundTags.map((tag) => (
                            <li key={tag.slug}>
                                <a href={`#${tag.url}`} data-tag-id={tag.id}>
                                    {tag.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="collage-related-posts"></div>
                <div className="featured-post">
                    <div className="inner"></div>
                </div>
            </div>
        </section>
    );
};
