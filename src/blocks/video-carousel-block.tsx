/*
 * Created on Wed Aug 16 2023
 * Author: Connor Doman
 */

import React from "react";
import { MediaUploadCheck, MediaUpload, InspectorControls, RichText, useBlockProps } from "@wordpress/block-editor";
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
    TextareaControl,
} from "@wordpress/components";

interface Video {
    videoTitle: string;
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
    const blockProps = useBlockProps();

    const { videos } = attributes;

    const handleAddVideo = () => {
        const newVideos = [...videos];
        newVideos.push({ videoTitle: "", videoUrl: "", videoCaption: "" });
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

    const videoElements = videos.map((video: Video, index: number) => {
        return (
            <div key={index} className="video-carousel-data">
                <div className="flex flex-row justify-between items-center">
                    <h3>Video {index + 1}</h3>
                    <Button
                        className="csek-video-remove"
                        icon="trash"
                        label="Remove Video"
                        onClick={() => handleRemoveVideo(index)}>
                        Delete
                    </Button>
                </div>
                <h4>Title</h4>
                <input
                    type="text"
                    className="csek-input"
                    placeholder="A great title"
                    value={video.videoTitle}
                    onChange={(e) =>
                        handleVideoChange(
                            { videoTitle: e.target.value, videoCaption: video.videoCaption, videoUrl: video.videoUrl },
                            index
                        )
                    }
                />
                <h4>Caption</h4>
                <em className="em-label">Rich text</em>
                <RichText
                    tagName="div"
                    className="csek-input"
                    placeholder="A caption for a video."
                    label="Video Caption"
                    value={video.videoCaption}
                    onChange={(videoCaption) =>
                        handleVideoChange(
                            { videoTitle: video.videoTitle, videoUrl: video.videoUrl, videoCaption },
                            index
                        )
                    }
                />
                <h4>URL</h4>
                <MediaUploadCheck>
                    <MediaUpload
                        onSelect={(media) =>
                            handleVideoChange(
                                { videoTitle: video.videoTitle, videoUrl: media.url, videoCaption: video.videoCaption },
                                index
                            )
                        }
                        allowedTypes={["video"]}
                        render={({ open }) => (
                            <Button className="csek-video-upload" icon="video-alt3" label="Upload Video" onClick={open}>
                                Choose Video
                            </Button>
                        )}
                    />
                </MediaUploadCheck>
            </div>
        );
    });
    return (
        <div {...blockProps}>
            <h2>Csek Video Carousel Block</h2>
            {videoElements}
            <Button onClick={handleAddVideo} icon="plus" className="csek-button">
                Add Video
            </Button>
            <p>{videos.length} videos selected.</p>
        </div>
    );
};

export const VideoCarouselBlockSave = ({ attributes }: VideoCarouselBlockProps) => {
    const blockProps = useBlockProps.save();
    const { videos } = attributes;

    const videoElements = videos.map((video: Video, index: number) => {
        const title = video.videoTitle;
        const caption = video.videoCaption;
        const url = video.videoUrl;

        if (!url) return null;

        return (
            <div className="video-block">
                <video controls={false} onPlay={(e) => e.preventDefault()}>
                    <source src={url} type="video/mp4" />
                </video>
                <div className="video-caption">
                    {title ? <h2>{title}</h2> : null}
                    {caption ? <RichText.Content className="caption" tagName="div" value={caption} /> : null}
                    <a className="video-playbutton" href="#opendialog">
                        <i className="fa fa-play"></i>
                        Watch the video
                    </a>
                </div>
            </div>
        );
    });

    return (
        <section {...blockProps}>
            <dialog className="video-player">
                <a href="#closedialog" className="close-dialog">
                    <i className="fas fa-x"></i>
                </a>
                <video controls={false}>
                    Videos aren't supported in your browser. Frankly we're impressed you got this far.
                </video>
            </dialog>
            <div className="video-strip">{videoElements}</div>
            <div className="carousel-slider-progress">
                <div className="status">
                    <a href="#prev" className="prev">
                        <i className="fa fa-chevron-left"></i>
                    </a>
                    <p>
                        Progress&nbsp;
                        <span className="start">01</span>&nbsp;/&nbsp;<span className="stop">04</span>
                    </p>
                    <a href="#next" className="next">
                        <i className="fa fa-chevron-right"></i>
                    </a>
                </div>
                <div className="bar">
                    <span className="progress"></span>
                </div>
            </div>
        </section>
    );
};
