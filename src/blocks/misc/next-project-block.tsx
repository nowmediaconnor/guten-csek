/*
 * Created on Wed Sep 27 2023
 * Author: Connor Doman
 */

import { useBlockProps } from "@wordpress/block-editor";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";
import React from "react";
import { CsekMediaUpload } from "../../components/media-upload";
import { CsekBlockHeading } from "../../components/heading";
import { TextInput } from "../../components/input";
import CsekCard from "../../components/card";

export interface NextProjectBlockAttributes {
    projectTitle: string;
    projectLink: string;
    projectImageURL: string;
}

export const NextProjectBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<NextProjectBlockAttributes>) => {
    const blockProps = useBlockProps();
    const { projectTitle, projectLink, projectImageURL } = attributes;

    const updateProjectTitle = (value: string) => {
        setAttributes({ projectTitle: value });
    };

    const updateProjectLink = (value: string) => {
        setAttributes({ projectLink: value });
    };

    const updateProjectImageURL = (url: string) => {
        setAttributes({ projectImageURL: url });
    };

    return (
        <div {...blockProps}>
            <CsekBlockHeading>Csek Next Project Block</CsekBlockHeading>
            <div className="flex flex-row gap-4">
                <CsekCard className="flex flex-col gap-2">
                    <TextInput label="Project name" onChange={updateProjectTitle} initialValue={projectTitle} />
                    <TextInput label="Project link" onChange={updateProjectLink} initialValue={projectLink} />
                </CsekCard>
                <CsekMediaUpload onChange={updateProjectImageURL} urlAttribute={projectImageURL} />
            </div>
        </div>
    );
};

export const NextProjectBlockSave = ({ attributes }: GutenCsekBlockSaveProps<NextProjectBlockAttributes>) => {
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
