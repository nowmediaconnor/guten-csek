/*
 * Created on Tue Aug 15 2023
 * Author: Connor Doman
 */

import React from "react";
import { shuffle } from "../scripts/array";
import { MediaUpload, MediaUploadCheck, RichText, useBlockProps } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { Heading } from "../components/heading";
import { CsekBlockHeading } from "../components/heading";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../scripts/dom";
import { TextInput } from "../components/input";
import { CsekMediaUpload } from "../components/media-upload";
import { CsekAddButton, CsekDeleteButton } from "../components/button";

interface ScrollingProjectsProps {
    attributes: {
        projects: Project[];
    };
    setAttributes?: any;
}

interface Project {
    name: string;
    link: string;
    imageUrl: string;
}

export interface ScrollingProjectsBlockAttributes {
    projects: Project[];
}

export const ScrollingProjectsBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<ScrollingProjectsBlockAttributes>) => {
    const blockProps = useBlockProps();

    const { projects } = attributes;

    const handleAddProject = () => {
        const newProjects = [...projects];
        newProjects.push({ name: "", link: "", imageUrl: "" });
        setAttributes({ projects: newProjects });
    };

    const handleRemoveProject = (index: number) => {
        const newProjects = [...projects];
        newProjects.splice(index, 1);
        setAttributes({ projects: newProjects });
    };

    const handleProjectChange = (project: Project, index: number) => {
        const newProjects = [...projects];
        newProjects[index] = project;
        setAttributes({ projects: newProjects });
    };

    const handleChangeProjectTitle = (value: string, index: number) => {
        const newProjects = [...projects];
        newProjects[index].name = value;
        setAttributes({ projects: newProjects });
    };

    const handleChangeProjectLink = (value: string, index: number) => {
        const newProjects = [...projects];
        newProjects[index].link = value;
        setAttributes({ projects: newProjects });
    };

    const handleChangeProjectImage = (value: string, index: number) => {
        const newProjects = [...projects];
        newProjects[index].imageUrl = value;
        setAttributes({ projects: newProjects });
    };

    const videoElements = projects.map((project: Project, index: number) => {
        return (
            <div key={index} className="csek-card flex flex-col gap-4">
                <div className="flex flex-row justify-between items-center">
                    <Heading level="2">Project {index + 1}</Heading>
                    <CsekDeleteButton
                        label="Remove project"
                        onDelete={() => handleRemoveProject(index)}
                        className="flex-shrink-0"
                    />
                </div>
                <div className="flex flex-row justify-between items-start gap-4">
                    <div className="csek-card flex flex-col gap-2">
                        <TextInput
                            label="Title"
                            placeholder="Title"
                            initialValue={project.name}
                            onChange={(v) => handleChangeProjectTitle(v, index)}
                        />
                        <TextInput
                            label="Link"
                            placeholder="https://example.com"
                            initialValue={project.link}
                            onChange={(v) => handleChangeProjectLink(v, index)}
                        />
                    </div>
                    <CsekMediaUpload
                        label="Image"
                        type="image"
                        urlAttribute={project.imageUrl}
                        onChange={(v) => handleChangeProjectImage(v, index)}
                    />
                </div>
            </div>
        );
    });
    return (
        <div {...blockProps} className="csek-block">
            <CsekBlockHeading>Csek Scrolling Projects Block</CsekBlockHeading>
            <p>{projects.length} projects added.</p>
            {videoElements}
            <CsekAddButton onAdd={handleAddProject} label="Add Project" />
        </div>
    );
};

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
            <div className="project-blurb">
                <img className="project-image" src="/wp-content/plugins/guten-csek/src/img/project-template.png" />
                <div className="view-button">
                    <a href="#">
                        View
                        <br />
                        Project
                    </a>
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
        </section>
    );
};
