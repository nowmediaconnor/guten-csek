/*
 * Created on Wed Sep 27 2023
 * Author: Connor Doman
 */

import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import React, { useState } from "@wordpress/element";
import { Heading } from "./heading";
import { capitalize } from "../scripts/strings";
import { CsekAddButton } from "./button";

interface CsekMediaUploadProps {
    onChange: (v: string) => void;
    urlAttribute?: string;
    type?: "image" | "video" | "audio";
    label?: string;
}

export const CsekMediaUpload = ({ onChange, urlAttribute = "", type = "image", label }: CsekMediaUploadProps) => {
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
        <div className="flex flex-col gap-4 py-4 csek-card w-fit">
            {label ? <Heading level="3">{label}</Heading> : null}
            <MediaUploadCheck>
                <MediaUpload
                    onSelect={handleChangeURL}
                    allowedTypes={[type]}
                    multiple={false}
                    value={resourceId}
                    render={({ open }) => (
                        <CsekAddButton onAdd={open} className="csek-button" label={`Choose ${type}`} />
                    )}
                />
            </MediaUploadCheck>
            <Heading level="4">{capitalize(type)} preview</Heading>
            {mediaPreview()}
        </div>
    );
};
