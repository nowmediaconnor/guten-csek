/*
 * Created on Wed Sep 27 2023
 * Author: Connor Doman
 */

import { useBlockProps } from "@wordpress/block-editor";
import { GutenbergBlockProps } from "../../scripts/dom";
import React from "react";
import { CsekMediaUpload } from "../../components/media-upload";
import { Heading } from "../../components/heading";
import { CsekBlockHeading } from "../../components/heading";

export const NextProjectBlockEdit = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps();
    const { projectTitle, projectLink, projectImageURL } = attributes;

    const updateProjectTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ projectTitle: event.target.value });
    };

    const updateProjectLink = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ projectLink: event.target.value });
    };

    const updateProjectImageURL = (v: any) => {
        setAttributes({ projectImageURL: v.url });
    };

    return (
        <div {...blockProps}>
            <CsekBlockHeading>Csek Next Project Block</CsekBlockHeading>
            <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-2 csek-card">
                    <Heading level="3">Project name</Heading>
                    <input
                        className="csek-input"
                        type="text"
                        value={projectTitle}
                        onChange={updateProjectTitle}
                        placeholder="Project name"
                    />
                    <Heading level="3">Project link</Heading>
                    <input
                        className="csek-input"
                        type="text"
                        value={projectLink}
                        onChange={updateProjectLink}
                        placeholder="Project link"
                    />
                </div>
                <CsekMediaUpload onChange={updateProjectImageURL} urlAttribute={projectImageURL} />
            </div>
        </div>
    );
};

export const NextProjectBlockSave = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps.save();

    const { projectTitle, projectLink, projectImageURL } = attributes;

    return (
        <section {...blockProps}>
            <div className="next-project-wrapper">
                <div className="next-project-image">
                    <div className="image-backing"></div>
                    <img src={projectImageURL} alt={projectTitle} />
                </div>
                <div className="next-project-info">
                    <a href={projectLink}>
                        <h1>Next project</h1>
                        <i className="fa fa-arrow-right"></i>
                    </a>
                    <h2>{projectTitle}</h2>
                </div>
            </div>
        </section>
    );
};
