/*
 * Created on Wed Aug 16 2023
 * Author: Connor Doman
 */

import React from "react";
import { MediaUploadCheck, MediaUpload, RichText, useBlockProps } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { Heading } from "../components/heading";
import { CsekBlockHeading } from "../components/heading";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../scripts/dom";
import Label, { Danger } from "../components/label";
import CsekCard from "../components/card";
import { RichTextContent, RichTextInput, TextInput } from "../components/input";

interface Video {
    videoTitle: string;
    videoUrl: string;
    videoCaption: string;
    isOnVimeo?: boolean;
}

interface VideoSelectorProps {
    video: Video;
    index: number;
    onDelete: (index: number) => void;
    onChange: (video: Video, index: number) => void;
}

const VideoSelector = ({ video, index, onDelete, onChange }: VideoSelectorProps) => {
    return (
        <CsekCard key={index} className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
                <Heading level="2">Video {index + 1}</Heading>
                <Button className="csek-video-remove" icon="trash" label="Remove Video" onClick={() => onDelete(index)}>
                    Delete
                </Button>
            </div>
            <TextInput
                label="Title"
                placeholder="A great title"
                initialValue={video.videoTitle}
                onChange={(videoTitle) => onChange({ ...video, videoTitle }, index)}
            />
            <RichTextInput
                label="Caption"
                initialValue={video.videoCaption}
                onChange={(videoCaption) => onChange({ ...video, videoCaption }, index)}
            />
            <Heading level="4">URL</Heading>
            <MediaUpload
                onSelect={(media) =>
                    onChange(
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
        </CsekCard>
    );
};

export interface VideoCarouselAttributes {
    videos: Video[];
}

export const VideoCarouselBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<VideoCarouselAttributes>) => {
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
        return <VideoSelector video={video} index={index} onDelete={handleRemoveVideo} onChange={handleVideoChange} />;
    });

    return (
        <div {...blockProps}>
            <CsekBlockHeading>Csek Video Carousel Block</CsekBlockHeading>
            <MediaUploadCheck fallback={<Danger>{"You're not permitted to upload media."}</Danger>}>
                <div className="flex flex-col justify-center items-center gap-2 my-2">{videoElements}</div>
            </MediaUploadCheck>
            <Button onClick={handleAddVideo} icon="plus" className="csek-button">
                Add Video
            </Button>
            <p>{videos.length} videos selected.</p>
        </div>
    );
};

export const VideoCarouselBlockSave = ({ attributes }: GutenCsekBlockSaveProps<VideoCarouselAttributes>) => {
    const blockProps = useBlockProps.save();
    const { videos } = attributes;

    const videoElements = videos.map((video: Video, index: number) => {
        const title = video.videoTitle;
        const caption = video.videoCaption;
        const url = video.videoUrl;

        if (!url) return null;

        return (
            <div className="video-block">
                <video controls={false} onPlay={(e) => e.preventDefault()} preload="none">
                    <source src={url} type="video/mp4" />
                </video>
                <div className="video-caption">
                    {title ? <h2>{title}</h2> : null}
                    {caption ? <RichTextContent className="caption" value={caption} /> : null}
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
                <video controls={false} preload="none">
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
