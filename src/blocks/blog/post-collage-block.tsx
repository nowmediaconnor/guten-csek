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
import { CsekSelectDropdown, TextInput } from "../../components/input";
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
            <CsekCard className="flex flex-col gap-4">
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
                            const category = findCategoryId(parentCategories, value);
                            setCurrentCategory(category ?? -1);
                            setCategorySlug(value);
                        }}
                        initialValue={categorySlug}
                    />
                )}
                <TextInput
                    label="Number of Posts in First Section"
                    hint="This is the number of of posts to display in the first part of the collage. If there are more posts than this number, a featured post is added and the remaining posts are shown below."
                    onChange={(value: string) => {
                        setAttributes({ postCount: parseInt(value) });
                    }}
                    initialValue={postCount.toString()}
                    type="number"
                />
            </CsekCard>
        </section>
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
                    </ul>
                </nav>
                <div className="collage-related-posts"></div>
            </div>
        </section>
    );
};
