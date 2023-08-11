/*
 * Created on Thu Aug 10 2023
 * Author: Connor Doman
 */
import React from "react";

interface VideoBlockProps {
    attributes: any;
    setAttributes: any;
}

export const VideoBlockEdit = ({ attributes, setAttributes }: VideoBlockProps) => {
    const { videoURL, title, description } = attributes;

    const videoURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ videoURL: e.target.value });
    };
    const titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ title: e.target.value });
    };
    const descriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ description: e.target.value });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <input type="text" value={videoURL} onChange={(e) => videoURLChange(e)} />
            <input type="text" value={title} onChange={(e) => titleChange(e)} />
            <input type="text" value={description} onChange={(e) => descriptionChange(e)} />
        </div>
    );
};

export const VideoBlockSave = ({ attributes, setAttributes }: VideoBlockProps) => {
    const { videoURL, title, description } = attributes;

    return (
        <div className="video-block border border-red">
            <div className="video-block__video">
                <iframe
                    src={videoURL}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen={true}></iframe>
            </div>
            <div className="video-block__content">
                <h3 className="video-block__title">{title}</h3>
                <p className="video-block__description">{description}</p>
            </div>
        </div>
    );
};
