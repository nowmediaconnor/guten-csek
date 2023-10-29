/*
 * Created on Fri Aug 11 2023
 * Author: Connor Doman
 */
import React from "react";
import { InspectorControls, useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { Panel, PanelBody } from "@wordpress/components";
import { CsekBlockHeading } from "../components/heading";
import { CsekMediaUpload } from "../components/media-upload";
import { CsekAddButton, CsekDeleteButton } from "../components/button";
import { CsekSelectDropdown, TextArea, TextInput } from "../components/input";
import Label from "../components/label";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../scripts/dom";
import CsekCard from "../components/card";

export interface ExpandingVideoBlockAttributes {
    expandingMediaURL: string;
    images: string[];
    messageHeading: string;
    message: string;
    expandingElementType: "video" | "image";
}

export const ExpandingVideoBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<ExpandingVideoBlockAttributes>) => {
    const blockProps = useBlockProps();
    const { children, ...innerBlockProps } = useInnerBlocksProps(blockProps);

    const { expandingMediaURL, images, messageHeading, message, expandingElementType = "video" } = attributes;

    const onSelectMedia = (url: string) => {
        setAttributes({ expandingMediaURL: url });
    };

    const onSelectImages = (newImages: any) => {
        setAttributes({ images: newImages.map((image: { url: string }) => image.url) });
    };

    const onUpdateImage = (url: string, index: number) => {
        const newImages = [...images];
        newImages[index] = url;
        setAttributes({ images: newImages });
    };

    const addNewImage = () => {
        setAttributes({ images: [...images, ""] });
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setAttributes({ images: newImages });
    };

    const onUpdateMessageHeading = (v: string) => {
        setAttributes({ messageHeading: v });
    };

    const onUpdateMessage = (v: string) => {
        setAttributes({ message: v });
    };

    const onUpdateMediaType = (v: string) => {
        setAttributes({ expandingElementType: v as "video" | "image" });
    };

    const imageUploaders = images.map((image: string, index: number) => {
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
                            type={expandingElementType}
                            label="Cover Video"
                            onChange={onSelectMedia}
                            urlAttribute={expandingMediaURL}
                        />
                        {expandingMediaURL ? (
                            <p>Video&nbsp;URL: {expandingMediaURL.split("https://")[1].slice(0, 25)}...</p>
                        ) : null}
                    </PanelBody>
                    <PanelBody title="Surrounding Images" className="flex flex-col gap-2">
                        {imageUploaders}
                        <p>{images.length || "No"} images selected.</p>
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
                initialValue={expandingElementType}
            />
            <Label>Select the Cover Video and Surrounding Images from the Inspector.</Label>
            <TextInput label="Message Heading" onChange={onUpdateMessageHeading} initialValue={messageHeading} />
            <TextArea label="Message Body" onChange={onUpdateMessage} initialValue={message} />
            <CsekCard>
                <h4 className="m-0">Inner Block</h4>
                <Label em>Click the box below to add a block that will appear behind the curtains</Label>
                <div className="csek-input p-4">{children as React.ReactNode}</div>
            </CsekCard>
        </div>
    );
};

export const ExpandingVideoBlockSave = ({ attributes }: GutenCsekBlockSaveProps<ExpandingVideoBlockAttributes>) => {
    const blockProps = useBlockProps.save();
    const { children, ...innerBlockProps } = useInnerBlocksProps.save(blockProps);

    const { expandingMediaURL, images, messageHeading, message, expandingElementType } = attributes;

    const maxImages = images.length < 6 ? images.length : 6;
    const randomImages = images.slice(0, maxImages);

    const firstImageElements: JSX.Element[] = [];
    const secondImageElements: JSX.Element[] = [];

    for (let i = 0; i < randomImages.length; i++) {
        if (i < maxImages / 2) {
            firstImageElements.push(<img src={randomImages[i]} className="floating-image" />);
        } else {
            secondImageElements.push(<img src={randomImages[i]} className="floating-image" />);
        }
    }

    const leftImageColumns: JSX.Element[] = [];
    const rightImageColumns: JSX.Element[] = [];

    const rowHeight = 2;

    for (let i = 0; i < maxImages / (2 * rowHeight); i++) {
        const rightColumnTemp: JSX.Element[] = [];
        const leftColumnTemp: JSX.Element[] = [];
        for (let j = 0; j < rowHeight; j++) {
            leftColumnTemp.push(firstImageElements[i * rowHeight + j]);
            rightColumnTemp.push(secondImageElements[i * rowHeight + j]);
        }

        leftImageColumns.push(<div className="image-column">{leftColumnTemp}</div>);
        rightImageColumns.push(<div className="image-column">{rightColumnTemp}</div>);
    }

    const expandingElement =
        expandingElementType === "video" ? (
            <video controls={false} autoPlay={true} loop={true} muted={true}>
                <source src={expandingMediaURL} />
            </video>
        ) : (
            <img src={expandingMediaURL} />
        );

    return (
        <>
            <section {...blockProps} className={blockProps.className + " curtain-reel"}>
                <div className="content-block curtain">
                    <div className="row">
                        <div className="image-container left">{leftImageColumns}</div>
                        <div className="expanding-video-container">
                            {expandingElement}
                            <div className="message">
                                <h2>{messageHeading}</h2>
                                <p>{message}</p>
                            </div>
                        </div>
                        <div className="image-container right">{rightImageColumns}</div>
                    </div>
                </div>
            </section>
            {children as React.ReactNode}
        </>
    );
};
