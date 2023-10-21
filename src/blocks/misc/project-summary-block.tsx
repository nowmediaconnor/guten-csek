/*
 * Created on Sun Sep 10 2023
 * Author: Connor Doman
 */

import React from "react";
import { GutenCsekBlockProps, GutenbergBlockProps } from "../../scripts/dom";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { urlExtractSecondLevelDomain } from "../../scripts/strings";
import { CsekBlockHeading } from "../../components/heading";
import { CheckboxInput, TextArea, TextInput } from "../../components/input";
import CsekColorPicker from "../../components/color-picker";
import { OutboundLink } from "../../components/links";

export interface ProjectSummaryBlockAttributes {
    backgroundColor: string;
    projectTagline: string;
    projectSummary: string;
    taggedServices: string[];
    websiteLink: string;
    usesCustomBackgroundColor: boolean;
}

export const ProjectSummaryBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockProps<ProjectSummaryBlockAttributes>) => {
    const blockProps = useBlockProps();

    const { backgroundColor, projectTagline, projectSummary, taggedServices, websiteLink, usesCustomBackgroundColor } =
        attributes;

    const setBackgroundColor = (hexColor: string) => {
        console.log(JSON.stringify(hexColor, null, 4));
        setAttributes({ backgroundColor: hexColor });
    };

    const setProjectTagline = (value: string) => {
        setAttributes({ projectTagline: value });
    };

    const setProjectSummary = (value: string) => {
        setAttributes({ projectSummary: value });
    };

    const setTaggedServices = (value: string) => {
        const services = value.split(",").map((service) => service.trim());
        setAttributes({ taggedServices: services });
    };

    const setWebsiteLink = (value: string) => {
        setAttributes({ websiteLink: value });
    };

    const setUsesCustomBackgroundColor = (value: boolean) => {
        setAttributes({ usesCustomBackgroundColor: value });
    };

    return (
        <section {...blockProps}>
            <CsekBlockHeading>Project Summary Block</CsekBlockHeading>
            <div className="csek-card py-4 flex flex-col gap-4">
                <TextInput
                    label="Project tagline"
                    initialValue={projectTagline}
                    onChange={setProjectTagline}
                    placeholder="Project tagline"
                />
                <TextArea
                    label="Project summary"
                    initialValue={projectSummary}
                    onChange={setProjectSummary}
                    placeholder="Project summary"
                />
                <TextInput
                    label="Tagged services"
                    initialValue={taggedServices.join(", ")}
                    onChange={setTaggedServices}
                    placeholder="Tagged services (comma-separated)"
                />
                <TextInput
                    label="Website link"
                    initialValue={websiteLink}
                    onChange={setWebsiteLink}
                    placeholder="Website link"
                />
                <CheckboxInput label="Use custom background color" onChange={setUsesCustomBackgroundColor} />
                <p className="em-label">
                    If you do not to use a custom color, Csek will use machine learning to determine a color based on
                    the post&apos;s featured image.
                </p>
                {usesCustomBackgroundColor ? (
                    <CsekColorPicker
                        label="Background color"
                        initialValue={backgroundColor}
                        onChange={setBackgroundColor}
                    />
                ) : null}
            </div>
        </section>
    );
};

export const ProjectSummaryBlockSave = ({ attributes }: GutenCsekBlockProps<ProjectSummaryBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { backgroundColor, projectTagline, projectSummary, taggedServices, websiteLink, usesCustomBackgroundColor } =
        attributes;

    const listOfServices = taggedServices?.map((service: string, index: number) => {
        return (
            <li key={service + index}>
                <h3>{service}</h3>
            </li>
        );
    });
    // const listOfServices = [];

    const customStyle: React.CSSProperties = {
        backgroundColor: `${backgroundColor}`,
    };

    return (
        <section
            {...blockProps}
            className="project-summary-block featured-image-color"
            style={usesCustomBackgroundColor ? customStyle : {}}>
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
                            <OutboundLink href={websiteLink}>{urlExtractSecondLevelDomain(websiteLink)}</OutboundLink>
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </h3>
                    </div>
                </div>
            </div>
        </section>
    );
};
