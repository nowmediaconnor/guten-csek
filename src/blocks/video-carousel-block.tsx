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
import { CheckboxInput, RichTextContent, RichTextInput, TextInput } from "../components/input";
import { CsekMediaUpload } from "../components/media-upload";

export interface VideoCarouselAttributes {
    videos: Video[];
}

interface Video {
    title: string;
    url: string;
    caption: string;
    customThumbnail?: string;
    isOnVimeo?: boolean;
}

interface VideoSelectorProps {
    video: Video;
    index: number;
    onDelete: (index: number) => void;
    onChange: (video: Video, index: number) => void;
}

const VideoSelector = ({ video, index, onDelete, onChange }: VideoSelectorProps) => {
    const [useVimeo, setUseVimeo] = React.useState<boolean>(video.isOnVimeo || false);
    const [hasCustomThumbnail, setHasCustomThumbnail] = React.useState<boolean>(!!video.customThumbnail);

    const handleUseVimeo = (state: boolean) => {
        setUseVimeo(state);
        onChange({ ...video, isOnVimeo: state }, index);
    };

    React.useEffect(() => {
        if (!hasCustomThumbnail) {
            onChange({ ...video, customThumbnail: undefined }, index);
        }
    }, [hasCustomThumbnail]);

    return (
        <CsekCard key={index} className="flex flex-col gap-2">
            <header className="flex flex-row justify-between items-center">
                <Heading level="2">Video {index + 1}</Heading>
                <Button className="csek-video-remove" icon="trash" label="Remove Video" onClick={() => onDelete(index)}>
                    Delete
                </Button>
            </header>
            <main className="flex flex-row gap-2 w-full">
                <div className="flex flex-col gap-2 w-full">
                    <TextInput
                        label="Title"
                        placeholder="A great title"
                        initialValue={video.title}
                        onChange={(videoTitle) => onChange({ ...video, title: videoTitle }, index)}
                    />
                    <RichTextInput
                        label="Caption"
                        initialValue={video.caption}
                        onChange={(videoCaption) => onChange({ ...video, caption: videoCaption }, index)}
                    />
                    <Heading level="4" className="flex flex-row gap-4">
                        Choose Video
                        <CheckboxInput label="Use Vimeo" onChange={handleUseVimeo} initialValue={video.isOnVimeo} />
                        <CheckboxInput
                            label="Use Custom Thumbnail"
                            onChange={setHasCustomThumbnail}
                            initialValue={hasCustomThumbnail}
                        />
                    </Heading>
                    {useVimeo ? (
                        <TextInput
                            label="Vimeo URL"
                            placeholder="https://player.vimeo.com/video/123456789"
                            initialValue={video.url}
                            onChange={(videoUrl) => onChange({ ...video, url: videoUrl }, index)}
                        />
                    ) : (
                        <MediaUpload
                            onSelect={(media) =>
                                onChange({ title: video.title, url: media.url, caption: video.caption }, index)
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
                    )}
                </div>
                {hasCustomThumbnail ? (
                    <div className="basis-1/2">
                        <CsekMediaUpload
                            className="h-full"
                            label="Custom Thumbnail"
                            type="image"
                            size="large"
                            urlAttribute={video.customThumbnail}
                            onChange={(v: string, altText: string) => onChange({ ...video, customThumbnail: v }, index)}
                        />
                    </div>
                ) : null}
            </main>
        </CsekCard>
    );
};

export const VideoCarouselBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<VideoCarouselAttributes>) => {
    const blockProps = useBlockProps();

    const { videos } = attributes;

    const handleAddVideo = () => {
        const newVideos = [...videos];
        newVideos.push({ title: "", url: "", caption: "" });
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

    const videoThumnails: React.ReactNode[] = videos.map((video: Video, index: number) => {
        const usesVimeo = video.isOnVimeo || false;

        const customThumbnail = video.customThumbnail || undefined;

        if (!video.url) return null;

        if (customThumbnail) {
            return <img className="vimeo-thumbnail" src={customThumbnail} key={index} />;
        }

        if (usesVimeo) {
            return <img className="vimeo-thumbnail" data-vimeo-url={video.url} key={index} />;
        }
        return (
            <video controls={false} key={index}>
                <source src={video.url} type="video/mp4" />
            </video>
        );
    });

    const videoElements = videos.map((video: Video, index: number) => {
        const { title, caption, url, isOnVimeo } = video;

        if (!url) return null;

        const thumbnail = videoThumnails[index];

        return (
            <div className="video-block">
                <div className="video-preview">{thumbnail}</div>
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
                <div className="player">
                    <video controls={false} preload="none">
                        Videos aren&apos;t supported in your browser. Frankly we&apos;re impressed you got this far.
                    </video>
                </div>
            </dialog>
            <div className="video-strip">{videoElements}</div>
            <div className="video-carousel-slider-progress">
                <div className="bar">
                    <span className="progress"></span>
                </div>
                <div className="status">
                    <a href="#prev" className="prev">
                        <i className="fa fa-chevron-left"></i>
                    </a>
                    <p>
                        <span className="start">01</span>&nbsp;/&nbsp;<span className="stop">04</span>
                    </p>
                    <a href="#next" className="next">
                        <i className="fa fa-chevron-right"></i>
                    </a>
                </div>
            </div>
        </section>
    );
};
