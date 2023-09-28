/*
 * Created on Tue Aug 15 2023
 * Author: Connor Doman
 */

import React from "react";
import { shuffle } from "../scripts/array";
import { MediaUpload, MediaUploadCheck, RichText, useBlockProps } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { Heading } from "../components/heading";

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

export const ScrollingProjectsBlockEdit = ({ attributes, setAttributes }: ScrollingProjectsProps) => {
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

    const videoElements = projects.map((project: Project, index: number) => {
        return (
            <div key={index} className="video-carousel-data">
                <div className="flex flex-row justify-between items-center">
                    <Heading level="2">Project {index + 1}</Heading>
                    <Button
                        className="csek-video-remove"
                        icon="trash"
                        label="Remove project"
                        onClick={() => handleRemoveProject(index)}>
                        Delete
                    </Button>
                </div>
                <Heading level="4">Title</Heading>
                <input
                    type="text"
                    className="csek-input"
                    placeholder="Project name"
                    value={project.name}
                    onChange={(e) =>
                        handleProjectChange(
                            { name: e.target.value, link: project.link, imageUrl: project.imageUrl },
                            index
                        )
                    }
                />
                <Heading level="4">Caption</Heading>
                <input
                    type="text"
                    className="csek-input"
                    placeholder="Link to project or project page"
                    value={project.link}
                    onChange={(e) =>
                        handleProjectChange(
                            { name: project.name, link: e.target.value, imageUrl: project.imageUrl },
                            index
                        )
                    }
                />
                <Heading level="4">Image</Heading>
                <MediaUploadCheck>
                    <MediaUpload
                        onSelect={(media) =>
                            handleProjectChange({ name: project.name, link: project.link, imageUrl: media.url }, index)
                        }
                        allowedTypes={["image"]}
                        render={({ open }) => (
                            <Button className="csek-video-upload" icon="camera-alt" label="Upload Image" onClick={open}>
                                Choose Image
                            </Button>
                        )}
                    />
                </MediaUploadCheck>
            </div>
        );
    });
    return (
        <div {...blockProps}>
            <Heading level="2">Csek Scrolling Projects Block</Heading>
            {videoElements}
            <Button onClick={handleAddProject} icon="plus" className="csek-button">
                Add Project
            </Button>
            <p>{projects.length} projects added.</p>
        </div>
    );
};

export const ScrollingProjectsBlockSave = ({ attributes }: ScrollingProjectsProps) => {
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
        <div {...blockProps}>
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
        </div>
    );
};
