/*
 * Created on Wed Aug 30 2023
 * Author: Connor Doman
 */

import { useBlockProps } from "@wordpress/block-editor";
import React from "react";
import { GutenbergBlockProps } from "../../scripts/dom";

/*
need:
- client name
- title
- header image
- project tagline
- project summary
- tagged services
- website link
*/

export const ProjectMastheadBlockEdit = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps();

    const { clientName, projecTitle, headerImageURL, projectTagline, projectSummary, taggedServices, websiteLink } =
        attributes;

    const onClientNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ clientName: event.target.value });
    };

    const onProjectTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ projecTitle: event.target.value });
    };

    const onHeaderImageURLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ headerImageURL: event.target.value });
    };

    const onProjectTaglineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ projectTagline: event.target.value });
    };

    const onProjectSummaryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAttributes({ projectSummary: event.target.value });
    };

    const onTaggedServicesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ taggedServices: event.target.value });
    };

    const onWebsiteLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ websiteLink: event.target.value });
    };

    return (
        <section {...blockProps}>
            <h2>Csek Project Masthead Block</h2>
            <div className="column">
                <input type="text" className="csek-input" placeholder="Client name" onChange={onClientNameChange} />
                <input type="text" className="csek-input" placeholder="Project title" onChange={onProjectTitleChange} />
                {/* <input type="text" className="csek-input" placeholder="Client name" onChange={onHeaderImageURLChange} /> */}
                <input
                    type="text"
                    className="csek-input"
                    placeholder="Project tagline"
                    onChange={onProjectTaglineChange}
                />
                <textarea className="csek-input" placeholder="Project summary" onChange={onProjectSummaryChange} />
                <input
                    type="text"
                    className="csek-input"
                    placeholder="Tagged services"
                    onChange={onTaggedServicesChange}
                />
                <input type="text" className="csek-input" placeholder="Website link" onChange={onWebsiteLinkChange} />
            </div>
        </section>
    );
};

export const ProjectMastheadBlockSave = () => {
    const blockProps = useBlockProps.save();
    return <section {...blockProps} className="scroll-down-target"></section>;
};
