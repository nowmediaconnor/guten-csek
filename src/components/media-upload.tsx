/*
 * Created on Wed Sep 27 2023
 * Author: Connor Doman
 */

import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { GutenbergBlockProps } from "../scripts/dom";
import { Button } from "@wordpress/components";
import React, { useState } from "@wordpress/element";
import { Heading } from "./heading";
import { capitalize } from "../scripts/strings";

interface CsekMediaUploadProps {
    onChange: (v: string) => void;
    urlAttribute?: string;
    type?: "image" | "video" | "audio";
}

export const CsekMediaUpload = ({ onChange, urlAttribute = "", type = "image" }: CsekMediaUploadProps) => {
    const [resourceURL, setResourceURL] = useState(urlAttribute);
    const [resourceId, setResourceId] = useState(0);

    const handleChangeURL = (v: any) => {
        if (onChange) {
            onChange(v.url);
            setResourceURL(v.url);
            setResourceId(v.id);
        }
    };

    const mediaPreview = (): JSX.Element => {
        switch (type) {
            case "image":
                return <img className="preview-image" src={resourceURL} />;
            case "video":
                return (
                    <video className="preview-image" controls={true} autoPlay={false} loop={false} muted={false}>
                        <source src={resourceURL} />
                    </video>
                );
            case "audio":
                return (
                    <audio controls={true}>
                        <source src={resourceURL} />
                    </audio>
                );
            default:
                return <></>;
        }
    };

    return (
        <div className="flex flex-col gap-4 py-4 csek-card">
            <MediaUploadCheck>
                <MediaUpload
                    onSelect={handleChangeURL}
                    allowedTypes={[type]}
                    multiple={false}
                    value={resourceId}
                    render={({ open }) => (
                        <Button onClick={open} className="csek-button">
                            Choose {type}
                        </Button>
                    )}
                />
            </MediaUploadCheck>
            <Heading level="4">{capitalize(type)} preview</Heading>
            {mediaPreview()}
        </div>
    );
};
