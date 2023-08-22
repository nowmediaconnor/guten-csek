/*
 * Created on Tue Aug 15 2023
 * Author: Connor Doman
 */

import React from "react";
import { shuffle } from "../scripts/array";

interface ScrollingProjectsProps {
    attributes: any;
    setAttributes?: any;
}

export const ScrollingProjectsBlockEdit = ({ attributes, setAttributes }: ScrollingProjectsProps) => {
    const { projects } = attributes;

    const onProjectsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAttributes({ projects: e.target.value.split("\n") });
    };

    return (
        <div>
            <h2>Scrolling Projects Block</h2>
            <p>
                Enter project titles and links in the form of <code>name|link</code>
            </p>
            <textarea
                className="w-full h-64"
                value={projects.join("\n")}
                onChange={(event) => {
                    onProjectsChange(event);
                }}
            />
        </div>
    );
};

export const ScrollingProjectsBlockSave = ({ attributes }: ScrollingProjectsProps) => {
    const { projects } = attributes;

    const projectData = projects.map((project: string) => {
        if (project.indexOf("|") === -1) return null;

        const name = project.split("|")[0].trim();
        const link = project.split("|")[1].trim();
        return { name, link };
    });

    const listItems = projectData.map((project: any) => {
        if (project == null) return null;
        return (
            <>
                <li>
                    <a href={project.link}>{project.name}</a>
                </li>
            </>
        );
    });

    return (
        <div>
            <div className="project-blurb">
                <img src="/wp-content/plugins/guten-csek/src/img/project-template.png" />
                <div className="view-button">
                    View
                    <br />
                    Project
                </div>
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
    );
};
