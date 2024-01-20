/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import { InspectorControls } from "@wordpress/block-editor";
import React from "react";
import { GutenCsekBlockEditProps } from "../../../js/guten-csek";
import { CsekBlockHeading } from "../../components/heading";
import { TextInput } from "../../components/input";
import { TaglineHeaderAttributes } from ".";
import { PanelBody } from "@wordpress/components";
import CsekCard from "../../components/card";
import { CsekMediaUpload } from "../../components/media-upload";

export const TaglineHeaderEdit = ({ attributes, setAttributes }: GutenCsekBlockEditProps<TaglineHeaderAttributes>) => {
    const { preTagline, tagline, subTagline, imageURL } = attributes;

    const preTaglineChange = (value: string) => {
        setAttributes({ preTagline: value });
    };

    const taglineChange = (value: string) => {
        setAttributes({ tagline: value });
    };

    const subTaglineChange = (value: string) => {
        setAttributes({ subTagline: value });
    };

    const onSelectImage = (url: string) => {
        setAttributes({ imageURL: url });
    };

    return (
        <div className="csek-block">
            <InspectorControls>
                <PanelBody title="Csek Tagline Header Editor">
                    <CsekMediaUpload
                        label="Accent image"
                        urlAttribute={imageURL}
                        onChange={onSelectImage}
                        type="image"
                    />
                </PanelBody>
            </InspectorControls>
            <CsekBlockHeading>Csek Tagline Header Block</CsekBlockHeading>
            <CsekCard className="flex flex-col gap-2">
                <TextInput label="Pre-Tagline" initialValue={preTagline} onChange={preTaglineChange} />
                <TextInput label="Tagline" initialValue={tagline} onChange={taglineChange} />
                <TextInput label="Subtagline" initialValue={subTagline} onChange={subTaglineChange} />
            </CsekCard>
            {imageURL && <img src={imageURL} className="w-48 relative mx-auto" alt="Tagline Header Image" />}
        </div>
    );
};
