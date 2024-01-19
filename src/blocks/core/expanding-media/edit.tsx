/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import { InspectorControls, useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import React from "react";
import { GutenCsekBlockEditProps } from "../../../scripts/dom";
import { ExpandingMediaBlockAttributes } from ".";
import { CsekAddButton, CsekDeleteButton } from "../../../components/button";
import { CsekMediaUpload } from "../../../components/media-upload";
import { Panel, PanelBody } from "@wordpress/components";
import { CsekBlockHeading } from "../../../components/heading";
import { CsekSelectDropdown, RichTextInput, TextInput } from "../../../components/input";
import Label from "../../../components/label";
import CsekCard from "../../../components/card";

export const ExpandingMediaBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<ExpandingMediaBlockAttributes>) => {
    const blockProps = useBlockProps();
    const { children, ...innerBlockProps } = useInnerBlocksProps(blockProps);

    const { mediaURL, floatingImages, messageHeading, message, expandingMediaType } = attributes;

    const onSelectMedia = (url: string) => {
        setAttributes({ mediaURL: url });
    };

    const onSelectImages = (newImages: any) => {
        setAttributes({ floatingImages: newImages.map((image: { url: string }) => image.url) });
    };

    const onUpdateImage = (url: string, index: number) => {
        const newImages = [...floatingImages];
        newImages[index] = url;
        setAttributes({ floatingImages: newImages });
    };

    const addNewImage = () => {
        setAttributes({ floatingImages: [...floatingImages, ""] });
    };

    const removeImage = (index: number) => {
        const newImages = [...floatingImages];
        newImages.splice(index, 1);
        setAttributes({ floatingImages: newImages });
    };

    const onUpdateMessageHeading = (v: string) => {
        setAttributes({ messageHeading: v });
    };

    const onUpdateMessage = (v: string) => {
        setAttributes({ message: v });
    };

    const onUpdateMediaType = (v: string) => {
        setAttributes({ expandingMediaType: v as "video" | "image" });
    };

    const imageUploaders = floatingImages.map((image: string, index: number) => {
        return (
            <div className="relative">
                <CsekDeleteButton
                    onDelete={() => removeImage(index)}
                    label="Remove"
                    className="absolute top-2 right-2"
                />
                <CsekMediaUpload
                    type="image"
                    label={`Image ${index + 1}`}
                    onChange={(url: string) => onUpdateImage(url, index)}
                    urlAttribute={image}
                />
            </div>
        );
    });

    return (
        <div {...blockProps} className="csek-block">
            <InspectorControls>
                <Panel>
                    <PanelBody title="Curtain Video" className="flex flex-col gap-2">
                        <CsekMediaUpload
                            type={expandingMediaType}
                            label="Cover Video"
                            onChange={onSelectMedia}
                            urlAttribute={mediaURL}
                        />
                        {mediaURL ? <p>Video&nbsp;URL: {mediaURL.split("https://")[1].slice(0, 25)}...</p> : null}
                    </PanelBody>
                    <PanelBody title="Surrounding Images" className="flex flex-col gap-2">
                        {imageUploaders}
                        <p>{floatingImages.length || "No"} images selected.</p>
                        <CsekAddButton onAdd={addNewImage} label="Add Image" />
                    </PanelBody>
                </Panel>
            </InspectorControls>
            <CsekBlockHeading>Csek Curtain Video Block</CsekBlockHeading>
            <CsekSelectDropdown
                label="Expanding Media Type"
                options={[
                    { value: "video", label: "Video" },
                    { value: "image", label: "Image" },
                ]}
                defaultOption={1}
                onChange={onUpdateMediaType}
                initialValue={expandingMediaType}
            />
            <Label>Select the Cover Video and Surrounding Images from the Inspector.</Label>
            <TextInput label="Message Heading" onChange={onUpdateMessageHeading} initialValue={messageHeading} />
            <RichTextInput label="Message Body" onChange={onUpdateMessage} initialValue={message} />
            {/* <TextArea label="Message Body" onChange={onUpdateMessage} initialValue={message} /> */}
            <CsekCard>
                <h4 className="m-0">Inner Block</h4>
                <Label em>Click the box below to add a block that will appear behind the curtains</Label>
                <div className="csek-input p-4">{children as React.ReactNode}</div>
            </CsekCard>
        </div>
    );
};
