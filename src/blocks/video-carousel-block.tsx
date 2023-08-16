/*
 * Created on Wed Aug 16 2023
 * Author: Connor Doman
 */

import React from "react";
import { MediaUploadCheck, MediaUpload, InspectorControls } from "@wordpress/block-editor";
import {
    Button,
    PanelBody,
    IconButton,
    TextControl,
    Panel,
    Card,
    CardHeader,
    CardBody,
    __experimentalHeading as Heading,
    __experimentalText as Text,
    __experimentalVStack as VStack,
    CardFooter,
} from "@wordpress/components";

interface Video {
    videoUrl: string;
    videoCaption: string;
}

interface VideoCarouselBlockProps {
    attributes: {
        videos: Video[];
    };
    setAttributes?: any;
}

export const VideoCarouselBlockEdit = ({ attributes, setAttributes }: VideoCarouselBlockProps) => {
    const { videos } = attributes;

    const onUpdateVideoUrl = (videoUrl: string, index: number) => {
        const newVideos = [...videos];
        newVideos[index].videoUrl = videoUrl;
        setAttributes({ videos: newVideos });
    };

    const onUpdateVideoCaption = (videoCaption: string, index: number) => {
        const newVideos = [...videos];
        newVideos[index].videoCaption = videoCaption;
        setAttributes({ videos: newVideos });
    };

    const handleAddVideo = () => {
        const newVideos = [...videos];
        newVideos.push({ videoUrl: "", videoCaption: "" });
        setAttributes({ videos: newVideos });
    };

    const handleRemoveVideo = (index: number) => {
        const newVideos = [...videos];
        newVideos.splice(index, 1);
        setAttributes({ videos: newVideos });
    };

    const handleVideoChange = (video: Video, index: number) => {
        const newVideos = [...videos];
        newVideos[index] = video;
        setAttributes({ videos: newVideos });
    };

    const videoFields = videos.map((video: Video, index: number) => {
        return (
            <Card key={index}>
                <CardHeader>
                    <Heading level={4}>Video {index + 1}</Heading>
                </CardHeader>
                <CardBody>
                    <TextControl
                        className="csek-video-caption"
                        placeholder="A short video from our sales team."
                        label="Video Caption"
                        value={video.videoCaption}
                        onChange={(videoCaption) =>
                            handleVideoChange({ videoUrl: video.videoUrl, videoCaption }, index)
                        }
                    />
                    <VStack>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={(media) =>
                                    handleVideoChange({ videoUrl: media.url, videoCaption: video.videoCaption }, index)
                                }
                                allowedTypes={["video"]}
                                render={({ open }) => (
                                    <Button
                                        className="csek-video-upload"
                                        icon="video-alt3"
                                        label="Upload Video"
                                        onClick={open}>
                                        Choose Video
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>
                        {video.videoUrl !== "" ? (
                            <Text title={video.videoUrl}>{video.videoUrl.slice(0, 25)}...</Text>
                        ) : null}
                    </VStack>
                </CardBody>
                <CardFooter>
                    <Button
                        className="csek-video-remove"
                        icon="trash"
                        label="Remove Video"
                        onClick={() => handleRemoveVideo(index)}>
                        Delete
                    </Button>
                </CardFooter>
            </Card>
        );
    });

    return (
        <div>
            <InspectorControls>
                <PanelBody title="Videos">
                    {videoFields}
                    <Button onClick={handleAddVideo} icon="plus">
                        Add Video
                    </Button>
                </PanelBody>
            </InspectorControls>
            <h2>Csek Video Carousel Block</h2>
            <p>{videos.length} videos selected.</p>
        </div>
    );
};

export const VideoCarouselBlockSave = ({ attributes }: VideoCarouselBlockProps) => {
    const { videos } = attributes;

    const videoElements = videos.map((video: Video, index: number) => {
        return (
            <div className="video-block">
                <video controls={false} onPlay={(e) => e.preventDefault()}>
                    <source src={video.videoUrl} type="video/mp4" />
                </video>
                <div className="video-caption">
                    <p>{video.videoCaption}</p>
                    <a className="video-playbutton" href="#opendialog">
                        <i className="fa fa-play"></i>
                        Watch the video
                    </a>
                    <div className="slider-progress">
                        <span className="start">01</span>
                        <div className="bar">
                            <span className="progress"></span>
                        </div>
                        <span className="stop">04</span>
                    </div>
                </div>
            </div>
        );
    });

    return (
        <section>
            <dialog className="video-player">
                <video controls={false} src="">
                    Videos aren't supported in your browser. Frankly we're impressed you got this far.
                </video>
            </dialog>
            {videoElements}
        </section>
    );
};
