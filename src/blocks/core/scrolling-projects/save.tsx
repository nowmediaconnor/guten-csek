/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import { useBlockProps } from "@wordpress/block-editor";
import React from "react";
import { GutenCsekBlockSaveProps } from "../../../js/guten-csek";
import { Project, ScrollingProjectsBlockAttributes } from ".";

export const ScrollingProjectsBlockSave = ({
    attributes,
}: GutenCsekBlockSaveProps<ScrollingProjectsBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { projects } = attributes;

    const listItems = projects.map((project: Project) => {
        if (project == null) return null;

        const { name, link, imageUrl } = project;

        return (
            <>
                <li>
                    <a href={link}>{name}</a>
                    <img src={imageUrl} style={{ display: "none" }} />
                </li>
            </>
        );
    });

    return (
        <section {...blockProps}>
            <h2 className="selected-project-name"></h2>
            <div className="canvas-container">
                <div className="project-blurb">
                    <img className="project-image" src="/wp-content/plugins/guten-csek/src/img/project-template.png" />
                </div>
                <div className="projects">
                    <div className="project-ribbon">
                        <ul>{listItems}</ul>
                    </div>
                    <hr />
                    <div className="project-ribbon">
                        <ul>{listItems}</ul>
                    </div>
                    <hr />
                    <div className="project-ribbon">
                        <ul>{listItems}</ul>
                    </div>
                </div>
            </div>
            <div className="view-button">
                <a href="#">
                    View
                    <br />
                    Project
                </a>
            </div>
        </section>
    );
};
