/*
 * Created on Fri Aug 11 2023
 * Author: Connor Doman
 */
import React, { useEffect } from "@wordpress/element";
import { MediaUploadCheck, MediaUpload, InspectorControls } from "@wordpress/block-editor";
import { Button, PanelBody } from "@wordpress/components";

interface ExpandingVideoBlockProps {
    attributes: any;
    setAttributes?: any;
}

export const ExpandingVideoBlockEdit = ({ attributes, setAttributes }: ExpandingVideoBlockProps) => {
    const { videoURL, images } = attributes;

    const onSelectVideo = (media: any) => {
        setAttributes({ videoURL: media.url });
    };

    const onSelectImages = (newImages: any) => {
        setAttributes({ images: newImages.map((image: { url: string }) => image.url) });
    };

    return (
        <div className="p-4 flex flex-col gap-4">
            <InspectorControls>
                <div className="flex flex-col">
                    <PanelBody title="Expanding Video Block Media">
                        <MediaUploadCheck>
                            <h3>Video</h3>
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
                            <h3>Images</h3>
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
            <h2>Expanding Video Block</h2>
            {videoURL && (
                <video width="320" height="180" className="border-2 border-blue-400 mx-auto">
                    <source src={videoURL} />
                </video>
            )}
        </div>
    );
};

export const ExpandingVideoBlockSave = ({ attributes }: ExpandingVideoBlockProps) => {
    const { videoURL, images } = attributes;

    // there will be 3 columns: images, video, images
    // the video will be the middle column and will expand to fill the viewport as the screen is scrolled
    // the images will be the left and right columns and will be pushed offscreen as the video expands

    return (
        <div className="expanding-video-container h-[100vh] sticky top-0 mx-auto flex flex-col w-1/3 justify-start items-center overflow-hidden">
            <video
                controls={false}
                autoPlay={true}
                loop={true}
                muted={true}
                className="object-cover max-w-none object-center relative left-1/2 translate-x-[-50%]">
                <source src={videoURL} />
            </video>
        </div>
    );
};
