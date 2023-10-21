/*
 * Created on Sat Sep 23 2023
 * Author: Connor Doman
 */

import React from "react";
import { GutenbergBlockProps } from "../../scripts/dom";
import { MediaUpload, useBlockProps } from "@wordpress/block-editor";
import { Button, ColorPicker, RangeControl } from "@wordpress/components";
import { Heading } from "../../components/heading";
import { CsekBlockHeading } from "../../components/heading";

export const ScreenshotCollageBlockEdit = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps();

    const { screenshots, screenshotAlts, backgroundColor, angleDegrees } = attributes;

    const setBackgroundColor = (colors: any) => {
        setAttributes({ backgroundColor: colors["hex"] });
    };

    const setAngleDegrees = (angle: number) => {
        setAttributes({ angleDegrees: angle });
    };

    const setScreenshotAt = (index: number, image: string) => {
        const newScreenshots = [...screenshots];
        if (index > newScreenshots.length) newScreenshots.push(image);
        else newScreenshots[index] = image;
        setAttributes({ screenshots: newScreenshots });
    };

    const setScreenshotAltAt = (index: number, alt: string) => {
        const newImageAlts = [...screenshotAlts];
        if (index >= newImageAlts.length) newImageAlts.push(alt);
        else newImageAlts[index] = alt;
        setAttributes({ screenshotAlts: newImageAlts });
    };

    const newImage = () => {
        const len = screenshots.length;
        setScreenshotAt(len, "");
        setScreenshotAltAt(len, "");
    };

    const deleteImageAt = (index: number) => {
        const newScreenshots = [...screenshots];
        newScreenshots.splice(index, 1);
        setAttributes({ screenshots: newScreenshots });
    };

    const imagePreviewElements = screenshots.map((screenshot: any, index: number) => {
        return (
            <div className="csek-card">
                <Heading level="4">Image Preview</Heading>
                <div className="flex flex-col gap-2">
                    <img className="preview-image" src={screenshot} alt={screenshotAlts[index]} />
                    <MediaUpload
                        onSelect={(v) => setScreenshotAt(index, v.url)}
                        allowedTypes={["image"]}
                        multiple={false}
                        value={screenshot}
                        render={({ open }) => (
                            <Button className="csek-button" onClick={open} icon="format-image">
                                Choose image
                            </Button>
                        )}
                    />
                </div>
                <Heading level="4">Image Alt Text</Heading>
                <input
                    className="csek-input"
                    type="text"
                    onChange={(e) => setScreenshotAltAt(index, e.target.value as string)}
                    placeholder=""
                    value={screenshotAlts[index]}
                />
                <br />
                <Button onClick={() => deleteImageAt(index)} icon="trash">
                    Delete
                </Button>
            </div>
        );
    });

    return (
        <section {...blockProps} className="p-4">
            <CsekBlockHeading>Csek Screenshot Collage Block</CsekBlockHeading>
            <div className="flex flex-row justify-between gap-4">
                <div className="flex flex-col">
                    {imagePreviewElements}
                    <Button className="csek-button" onClick={() => newImage()} icon="plus">
                        Add Card
                    </Button>
                </div>
                <div className="flex flex-col h-max">
                    <div className="csek-card">
                        <Heading level="4">Background Color</Heading>
                        <ColorPicker color={backgroundColor} onChangeComplete={setBackgroundColor} copyFormat="hex" />
                    </div>
                    <div className="csek-card">
                        <Heading level="4">Row Tilt</Heading>
                        <RangeControl
                            value={angleDegrees}
                            onChange={(v) => setAngleDegrees(v ?? 0)}
                            min={0}
                            max={360}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export const ScreenshotCollageBlockSave = ({ attributes }: GutenbergBlockProps) => {
    const blockProps = useBlockProps.save();

    const { screenshots, screenshotAlts, backgroundColor, angleDegrees } = attributes;

    const imageBricks = screenshots.map((screenshot: string, index: number) => {
        return (
            <div className="brick">
                <img src={screenshot} alt={screenshotAlts[index]} />
            </div>
        );
    });

    return (
        <section {...blockProps} style={{ backgroundColor, transform: `rotate(-${angleDegrees}deg)` }}>
            <div className="masonry">{imageBricks}</div>
        </section>
    );
};
