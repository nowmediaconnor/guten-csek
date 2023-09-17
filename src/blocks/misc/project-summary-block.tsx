/*
 * Created on Sun Sep 10 2023
 * Author: Connor Doman
 */

import React from "react";
import { GutenbergBlockProps } from "../../scripts/dom";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { ColorPicker } from "@wordpress/components";

import "../../css/project-summary-block.css";
import { LegacyColor } from "@wordpress/components/build-types/color-picker/types";
import { urlExtractSecondLevelDomain } from "../../scripts/strings";

export const ProjectSummaryBlockEdit = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps();
    const { backgroundColor, projectTagline, projectSummary, taggedServices, websiteLink } = attributes;

    const setBackgroundColor = (colors: LegacyColor) => {
        console.log(JSON.stringify(colors, null, 4));
        setAttributes({ backgroundColor: colors["hex"] });
    };

    const setProjectTagline = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ projectTagline: event.target.value });
    };

    const setProjectSummary = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAttributes({ projectSummary: event.target.value });
    };

    const setTaggedServices = (event: React.ChangeEvent<HTMLInputElement>) => {
        const services = event.target.value.split(",").map((service) => service.trim());
        setAttributes({ taggedServices: services });
    };

    const setWebsiteLink = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ websiteLink: event.target.value });
    };

    return (
        <>
            <InspectorControls>
                <ColorPicker color={backgroundColor} onChangeComplete={setBackgroundColor} copyFormat="hex" />
            </InspectorControls>
            <section {...blockProps}>
                <h2>Project Summary Block</h2>
                <input
                    type="text"
                    className="csek-input"
                    value={projectTagline}
                    onChange={setProjectTagline}
                    placeholder="Project tagline"
                />
                <textarea
                    className="csek-input"
                    value={projectSummary}
                    onChange={setProjectSummary}
                    placeholder="Project summary"
                />
                <input
                    type="text"
                    className="csek-input"
                    value={taggedServices}
                    onChange={setTaggedServices}
                    placeholder="Tagged services (comma-separated)"
                />
                <input
                    type="text"
                    className="csek-input"
                    value={websiteLink}
                    onChange={setWebsiteLink}
                    placeholder="Website link"
                />
            </section>
        </>
    );
};

export const ProjectSummaryBlockSave = ({ attributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps.save();

    const { backgroundColor, projectTagline, projectSummary, taggedServices, websiteLink } = attributes;

    const listOfServices = taggedServices?.map((service: string, index: number) => {
        return (
            <li key={service + index}>
                <h3>{service}</h3>
            </li>
        );
    });
    // const listOfServices = [];

    return (
        <section
            {...blockProps}
            className="project-summary-block"
            style={{ backgroundColor: `${backgroundColor.toString()}` }}>
            <div className="max-width">
                <h2 className="project-tagline">{projectTagline}</h2>
                <div className="row">
                    <p className="project-summary">{projectSummary}</p>
                    <div className="column tagged-services">
                        <h4>Our services</h4>
                        <ul>{listOfServices}</ul>
                    </div>
                    <div className="column website-link">
                        <h4>Check out our partner</h4>
                        <h3>
                            <a href={websiteLink}>{urlExtractSecondLevelDomain(websiteLink)}</a>
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </h3>
                    </div>
                </div>
            </div>
        </section>
    );
};
