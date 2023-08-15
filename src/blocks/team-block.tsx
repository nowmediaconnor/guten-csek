/*
 * Created on Tue Aug 15 2023
 * Author: Connor Doman
 */

import { MediaUploadCheck, MediaUpload, InspectorControls } from "@wordpress/block-editor";
import { Button, PanelBody } from "@wordpress/components";
import React from "react";

interface TeamBlockProps {
    attributes: any;
    setAttributes?: any;
}

export const TeamBlockEdit = ({ attributes, setAttributes }: TeamBlockProps) => {
    const { images, title, tagline, copyText, cta, ctaLink } = attributes;

    const onSelectImages = (media: any) => {
        setAttributes({ images: media.map((image: { url: string }) => image.url) });
    };

    const onSetBlockTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ title: e.target.value });
    };
    const onSetTagline = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ tagline: e.target.value });
    };
    const onSetCopyText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAttributes({ copyText: e.target.value });
    };
    const onSetCTA = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ cta: e.target.value });
    };
    const onSetCTALink = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttributes({ ctaLink: e.target.value });
    };

    return (
        <div>
            <InspectorControls>
                <div className="flex flex-col">
                    <PanelBody title="Expanding Video Block Media">
                        <MediaUploadCheck>
                            <h3>Headshot Images</h3>
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
            <h2>Team Block</h2>
            <div className="w-full flex flex-col gap-4">
                <p>{images.length} images selected.</p>
                <input type="text" value={title} onChange={onSetBlockTitle} placeholder="Block Title" />
                <input type="text" value={tagline} onChange={onSetTagline} placeholder="Tagline" />
                <textarea value={copyText} onChange={onSetCopyText} placeholder="Copy Text" />
                <input type="text" value={cta} onChange={onSetCTA} placeholder="Call To Action" />
                <input type="text" value={ctaLink} onChange={onSetCTALink} placeholder="Call To Action Link" />
            </div>
        </div>
    );
};

export const TeamBlockSave = ({ attributes }: TeamBlockProps) => {
    const { images, title, tagline, copyText, cta, ctaLink } = attributes;

    return (
        <section>
            <div className="block-content">
                <h2 className="block-title">{title}</h2>
                <p className="tagline">{tagline}</p>
                <div className="copy-text">
                    <p>{copyText}</p>
                    <div className="learn-more">
                        <a href={ctaLink}>
                            <div className="bar"></div>
                            {cta}
                        </a>
                    </div>
                </div>
            </div>
            <div className="headshots">
                {images.map((image: string, index: number) => (
                    <div className="headshot" key={index}>
                        <img src={image} alt="" />
                    </div>
                ))}
            </div>
        </section>
    );
};
