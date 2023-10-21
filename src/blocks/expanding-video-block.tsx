/*
 * Created on Fri Aug 11 2023
 * Author: Connor Doman
 */
import React from "react";
import {
    MediaUploadCheck,
    MediaUpload,
    InspectorControls,
    useBlockProps,
    useInnerBlocksProps,
} from "@wordpress/block-editor";
import { Button, PanelBody } from "@wordpress/components";
import { Heading } from "../components/heading";
import { CsekBlockHeading } from "../components/heading";

interface ExpandingVideoBlockProps {
    attributes: any;
    setAttributes?: any;
    className?: string;
}

export const ExpandingVideoBlockEdit = ({ attributes, setAttributes }: ExpandingVideoBlockProps) => {
    const blockProps = useBlockProps();
    const { children, ...innerBlockProps } = useInnerBlocksProps(blockProps);

    const { videoURL, images, messageHeading, message } = attributes;

    const onSelectVideo = (media: any) => {
        setAttributes({ videoURL: media.url });
    };

    const onSelectImages = (newImages: any) => {
        setAttributes({ images: newImages.map((image: { url: string }) => image.url) });
    };

    const onUpdateMessageHeading = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ messageHeading: e.target.value });
    };
    const onUpdateMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAttributes({ message: e.target.value });
    };

    return (
        <div {...blockProps} className="p-4 flex flex-col">
            <InspectorControls>
                <div className="flex flex-col">
                    <PanelBody title="Expanding Video Block Media">
                        <MediaUploadCheck>
                            <Heading level="3">Video</Heading>
                            <MediaUpload
                                onSelect={onSelectVideo}
                                allowedTypes={["video"]}
                                value={videoURL}
                                render={({ open }) => <Button onClick={open}>Select video</Button>}
                            />
                            {videoURL && (
                                <div>
                                    <p>Video&nbsp;URL: {videoURL.split("https://")[1].slice(0, 25)}...</p>
                                </div>
                            )}
                            <hr />
                            <Heading level="3">Images</Heading>
                            <MediaUpload
                                onSelect={onSelectImages}
                                allowedTypes={["image"]}
                                multiple={true}
                                value={images}
                                render={({ open }) => <Button onClick={open}>Select images</Button>}
                            />
                            <p>{images.length} images selected.</p>
                        </MediaUploadCheck>
                    </PanelBody>
                </div>
            </InspectorControls>
            <CsekBlockHeading>Csek Curtain Video Block</CsekBlockHeading>
            <Heading level="4">Message Heading</Heading>
            <input
                type="text"
                className="csek-input"
                placeholder="Message heading"
                value={messageHeading}
                onChange={(e) => onUpdateMessageHeading(e)}
            />
            <Heading level="4">Message Body</Heading>
            <textarea
                className="csek-input"
                placeholder="Message"
                value={message}
                onChange={(e) => onUpdateMessage(e)}
            />
            {videoURL ? (
                <>
                    <Heading level="4">Video Preview</Heading>
                    <video width="320" height="180" className="border-2 border-blue-400 mx-auto">
                        <source src={videoURL as string} />
                    </video>
                </>
            ) : null}
            <h4 className="m-0">Inner Block</h4>
            <em className="em-label">Click the box below to add a block that will appear behind the curtains</em>
            <div className="csek-input p-4">{children as React.ReactNode}</div>
        </div>
    );
};

export const ExpandingVideoBlockSave = ({ attributes }: ExpandingVideoBlockProps) => {
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
    const randomImages = images;

    const firstImageElements = randomImages.slice(0, maxImages / 2).map((image: string, index: number) => {
        return <img src={image} className="floating-image" />;
    });
    const secondImageElements = randomImages.slice(maxImages / 2).map((image: string, index: number) => {
        return <img src={image} className="floating-image" />;
    });

    return (
        <>
            {/* <div id="test-thresh" className="threshold"></div> */}
            <div className="curtain-reel undefined">
                <div className="content-block curtain">
                    <div className="row">
                        <div className="image-container-left scroll-fade-away">{firstImageElements}</div>
                        <div className="expanding-video-container">
                            <video controls={false} autoPlay={true} loop={true} muted={true}>
                                <source src={videoURL} />
                            </video>
                            <div className="message">
                                <h2>{messageHeading}</h2>
                                <p>{message}</p>
                            </div>
                        </div>
                        <div className="image-container-right scroll-fade-away">{secondImageElements}</div>
                    </div>
                </div>
            </div>
            {children as React.ReactNode}
        </>
    );
};
