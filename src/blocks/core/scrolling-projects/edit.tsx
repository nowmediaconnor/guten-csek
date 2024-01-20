/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import { useBlockProps } from "@wordpress/block-editor";
import React from "react";
import { GutenCsekBlockEditProps } from "../../../js/guten-csek";
import { CsekBlockHeading, Heading } from "../../components/heading";
import { TextInput } from "../../components/input";
import { Project, ScrollingProjectsBlockAttributes } from ".";
import { CsekDeleteButton, CsekAddButton } from "../../components/button";
import CsekCard from "../../components/card";
import { CsekMediaUpload } from "../../components/media-upload";

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
            <CsekCard key={index} className="flex flex-col gap-4">
                <div className="flex flex-row justify-between items-center">
                    <Heading level="2">Project {index + 1}</Heading>
                    <CsekDeleteButton
                        label="Remove project"
                        onDelete={() => handleRemoveProject(index)}
                        className="flex-shrink-0"
                    />
                </div>
                <div className="flex flex-row justify-between items-start gap-4">
                    <CsekCard className="flex flex-col gap-2">
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
                    </CsekCard>
                    <CsekMediaUpload
                        label="Image"
                        type="image"
                        urlAttribute={project.imageUrl}
                        onChange={(v) => handleChangeProjectImage(v, index)}
                    />
                </div>
            </CsekCard>
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
