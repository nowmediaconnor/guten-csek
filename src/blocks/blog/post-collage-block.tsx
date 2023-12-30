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
    findCategoryId,
    getAllCategories,
    getAllPosts,
    getTagsByCategory,
} from "../../scripts/wp";
import { CsekSelectDropdown } from "../../components/input";
import CsekCard from "../../components/card";
import { useBlockProps } from "@wordpress/block-editor";

export interface PostCollageBlockAttributes {
    chosenCategory: string;
    postCount: number;
    foundTags: string[];
    featuredPost: number;
}

export const PostCollageBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<PostCollageBlockAttributes>) => {
    const { chosenCategory, postCount, foundTags, featuredPost } = attributes;

    const [tags, setTags] = useState<PostTag[]>([]);
    const [allTags, setAllTags] = useState<any>({});
    const [parentCategories, setParentCategories] = useState<PostCategory[]>([]);
    const [posts, setPosts] = useState<any>({});
    const [currentCategory, setCurrentCategory] = useState<string>(chosenCategory);

    useEffect(() => {
        getAllCategories().then((categories) => {
            setParentCategories(categories);
            if (!chosenCategory) setCurrentCategory(categories[0].slug);
        });
    }, []);

    useEffect(() => {
        if (currentCategory) {
            const cId = findCategoryId(parentCategories, currentCategory);
            if (!cId) return;

            getAllPosts(undefined, [cId]).then((posts) => {
                setPosts(posts);
            });

            getTagsByCategory(cId).then((tags) => {
                setTags(tags);
            });

            setAttributes({ chosenCategory: currentCategory });
        }
    }, [currentCategory, parentCategories]);

    useEffect(() => {
        if (tags) {
            setAttributes({ foundTags: tags.map((t) => t.name) });
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
                        setCurrentCategory(value);
                    }}
                    initialValue={currentCategory}
                />
                <pre>{JSON.stringify(parentCategories, null, 2)}</pre>
            </CsekCard>
        </section>
    );
};

export const PostCollageBlockSave = ({ attributes }: GutenCsekBlockSaveProps<PostCollageBlockAttributes>) => {
    const blockProps = useBlockProps.save();
    const { chosenCategory, postCount, foundTags, featuredPost } = attributes;

    return (
        <section {...blockProps}>
            <div className="block-content">
                <nav className="tag-nav">
                    <ul>
                        {foundTags.map((tag) => (
                            <li key={tag}>{tag}</li>
                        ))}
                    </ul>
                </nav>
            </div>
        </section>
    );
};
