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
import { TextArea, TextInput } from "../components/input";
import Label from "../components/label";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../scripts/dom";

export interface ExpandingVideoBlockAttributes {
    videoURL: string;
    images: string[];
    messageHeading: string;
    message: string;
}

export const ExpandingVideoBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<ExpandingVideoBlockAttributes>) => {
    const blockProps = useBlockProps();
    const { children, ...innerBlockProps } = useInnerBlocksProps(blockProps);

    const { videoURL, images, messageHeading, message } = attributes;

    const onSelectVideo = (media: any) => {
        setAttributes({ videoURL: media.url });
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
                            type="video"
                            label="Cover Video"
                            onChange={onSelectVideo}
                            urlAttribute={videoURL}
                        />
                        {videoURL ? <p>Video&nbsp;URL: {videoURL.split("https://")[1].slice(0, 25)}...</p> : null}
                    </PanelBody>
                    <PanelBody title="Surrounding Images" className="flex flex-col gap-2">
                        {imageUploaders}
                        <p>{images.length || "No"} images selected.</p>
                        <CsekAddButton onAdd={addNewImage} label="Add Image" />
                    </PanelBody>
                </Panel>
            </InspectorControls>
            <CsekBlockHeading>Csek Curtain Video Block</CsekBlockHeading>
            <Label>Select the Cover Video and Surrounding Images from the Inspector.</Label>
            <TextInput label="Message Heading" onChange={onUpdateMessageHeading} initialValue={messageHeading} />
            <TextArea label="Message Body" onChange={onUpdateMessage} initialValue={message} />
            <div className="csek-card">
                <h4 className="m-0">Inner Block</h4>
                <Label em>Click the box below to add a block that will appear behind the curtains</Label>
                <div className="csek-input p-4">{children as React.ReactNode}</div>
            </div>
        </div>
    );
};

export const ExpandingVideoBlockSave = ({ attributes }: GutenCsekBlockSaveProps<ExpandingVideoBlockAttributes>) => {
    const blockProps = useBlockProps.save();
    const { children, ...innerBlockProps } = useInnerBlocksProps.save(blockProps);

    const { videoURL, images, messageHeading, message } = attributes;

    // there will be 3 columns: images, video, images
    // the video will be the middle column and will expand to fill the viewport as the screen is scrolled
    // the images will be the left and right columns and will be pushed offscreen as the video expands

    // pick a random subset of up to 6 images
    // shuffle that subset
    // split the images into 2 arrays of 3
    // the left array will be the left column
    // the right array will be the right column

    const maxImages = images.length < 6 ? images.length : 6;
    // const randomImages = images.sort(() => Math.random() - Math.random()).slice(0, maxImages);
    const randomImages = images.slice(0, maxImages);

    // const firstImageElements = randomImages.slice(0, maxImages / 2).map((image: string, index: number) => {
    //     return <img src={image} className="floating-image" />;
    // });

    // const secondImageElements = randomImages.slice(maxImages / 2).map((image: string, index: number) => {
    //     return <img src={image} className="floating-image" />;
    // });
    const firstImageElements: JSX.Element[] = [];
    const secondImageElements: JSX.Element[] = [];

    for (let i = 0; i < randomImages.length; i++) {
        if (i < maxImages / 2) {
            firstImageElements.push(<img src={randomImages[i]} className="floating-image" />);
        } else {
            secondImageElements.push(<img src={randomImages[i]} className="floating-image" />);
        }
    }

    return (
        <>
            <section {...blockProps} className={blockProps.className + " curtain-reel"}>
                <div className="content-block curtain">
                    <div className="row">
                        <div className="image-container left">{firstImageElements}</div>
                        <div className="expanding-video-container">
                            <video controls={false} autoPlay={true} loop={true} muted={true}>
                                <source src={videoURL} />
                            </video>
                            <div className="message">
                                <h2>{messageHeading}</h2>
                                <p>{message}</p>
                            </div>
                        </div>
                        <div className="image-container right">{secondImageElements}</div>
                    </div>
                </div>
            </section>
            {children as React.ReactNode}
        </>
    );
};
