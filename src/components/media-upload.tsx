/*
 * Created on Wed Sep 27 2023
 * Author: Connor Doman
 */

import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { GutenbergBlockProps } from "../scripts/dom";
import { Button } from "@wordpress/components";
import React, { useState } from "@wordpress/element";
import { Heading } from "./heading";

interface CsekMediaUploadProps {
    onChange: (v: any) => void;
    urlAttribute?: string;
}

export const CsekMediaUpload = ({ onChange, urlAttribute = "" }: CsekMediaUploadProps) => {
    const [imageURL, setImageURL] = useState(urlAttribute);
    const [imageId, setImageId] = useState(0);

    const handleChangeURL = (v: any) => {
        if (onChange) {
            onChange(v);
            setImageURL(v.url);
            setImageId(v.id);
        }
    };

    return (
        <div className="flex flex-col gap-4 py-4 csek-card">
            <MediaUploadCheck>
                <MediaUpload
                    onSelect={handleChangeURL}
                    allowedTypes={["image"]}
                    multiple={false}
                    value={imageId}
                    render={({ open }) => (
                        <Button onClick={open} className="csek-button">
                            Choose image
                        </Button>
                    )}
                />
            </MediaUploadCheck>
            <Heading level="4">Image preview</Heading>
            <img className="preview-image" src={imageURL} />
        </div>
    );
};
