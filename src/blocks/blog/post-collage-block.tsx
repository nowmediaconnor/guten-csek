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
    findCategoryId,
    getAllCategories,
    getAllPosts,
    getAllTags,
    getTagsByCategory,
} from "../../scripts/wp";
import { CsekSelectDropdown } from "../../components/input";

export interface PostCollageBlockAttributes {
    chosenTag: string;
    postCount: number;
    foundTags: string[];
    featuredPost: number;
}

export const PostCollageBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<PostCollageBlockAttributes>) => {
    const [tags, setTags] = useState<any>({});
    const [allTags, setAllTags] = useState<any>({});
    const [parentCategories, setParentCategories] = useState<PostCategory[]>([]);
    const [posts, setPosts] = useState<any>({});
    const [currentCategory, setCurrentCategory] = useState<string>("");

    useEffect(() => {
        getAllTags().then((tags) => {
            setAllTags(tags);
        });

        getAllCategories().then((categories) => {
            setParentCategories(categories);
        });

        getAllPosts().then((posts) => {
            setPosts(posts);
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
        }
    }, [currentCategory, parentCategories]);

    return (
        <div>
            <CsekBlockHeading text="Post Collage Block" />
            <CsekSelectDropdown
                options={parentCategories.map((c) => {
                    return { label: c.name, value: c.slug };
                })}
                onChange={(value: string) => {
                    setCurrentCategory(value);
                }}
            />
            <pre>{JSON.stringify(parentCategories, null, 2)}</pre>
        </div>
    );
};

export const PostCollageBlockSave = ({ attributes }: GutenCsekBlockSaveProps<PostCollageBlockAttributes>) => {
    return (
        <div>
            <p>Post Collage Block</p>
        </div>
    );
};
