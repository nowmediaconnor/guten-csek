/*
 * Created on Fri Jan 19 2024
 * Author: Connor Doman
 */

import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import React from "react";
import { GutenCsekBlockSaveProps } from "../../../scripts/dom";
import { ExpandingMediaBlockAttributes } from ".";
import { RichTextContent } from "../../../components/input";

export const ExpandingMediaBlockSave = ({ attributes }: GutenCsekBlockSaveProps<ExpandingMediaBlockAttributes>) => {
    const blockProps = useBlockProps.save();
    const { children, ...innerBlockProps } = useInnerBlocksProps.save(blockProps);

    const { mediaURL, floatingImages, messageHeading, message, expandingMediaType } = attributes;

    const maxImages = floatingImages.length < 6 ? floatingImages.length : 6;
    const randomImages = floatingImages.slice(0, maxImages);

    const firstImageElements: JSX.Element[] = [];
    const secondImageElements: JSX.Element[] = [];

    for (let i = 0; i < randomImages.length; i++) {
        if (i < maxImages / 2) {
            firstImageElements.push(<img src={randomImages[i]} className="floating-image" />);
        } else {
            secondImageElements.push(<img src={randomImages[i]} className="floating-image" />);
        }
    }

    const leftImageColumns: JSX.Element[] = [];
    const rightImageColumns: JSX.Element[] = [];

    const rowHeight = 2;

    for (let i = 0; i < maxImages / (2 * rowHeight); i++) {
        const rightColumnTemp: JSX.Element[] = [];
        const leftColumnTemp: JSX.Element[] = [];
        for (let j = 0; j < rowHeight; j++) {
            leftColumnTemp.push(firstImageElements[i * rowHeight + j]);
            rightColumnTemp.push(secondImageElements[i * rowHeight + j]);
        }

        leftImageColumns.push(<div className="image-column">{leftColumnTemp}</div>);
        rightImageColumns.push(<div className="image-column">{rightColumnTemp}</div>);
    }

    const expandingElement =
        expandingMediaType === "video" ? (
            <video controls={false} autoPlay={true} loop={true} muted={true}>
                <source src={mediaURL} />
            </video>
        ) : (
            <img src={mediaURL} />
        );

    const messageElement = message ? (
        <div className="message curtain">
            <h2>{messageHeading}</h2>
            <RichTextContent value={message} />
        </div>
    ) : null;

    return (
        <>
            <section {...blockProps} className={blockProps.className + ""}>
                <div className="curtain-reel">
                    <div className="content-block curtain">
                        <div className="row">
                            <div className="image-container left">{leftImageColumns}</div>
                            <div className="expanding-video-container">{expandingElement}</div>
                            <div className="image-container right">{rightImageColumns}</div>
                        </div>
                    </div>
                    {messageElement}
                </div>
            </section>
        </>
    );
};
