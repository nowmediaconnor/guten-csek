/*
 * Created on Wed Sep 27 2023
 * Author: Connor Doman
 */

import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import React, { useState } from "@wordpress/element";
import { Heading } from "./heading";
import { capitalize } from "../../js/scripts/strings";
import { CsekAddButton } from "./button";
import Label from "./label";
import { CsekImage, CsekImageSize } from "../../js/scripts/image";
import { twMerge } from "tailwind-merge";
import CsekCard from "./card";
import { log } from "../../js/guten-csek";

interface CsekMediaUploadProps {
    onChange: (v: string, altText?: string) => void;
    urlAttribute?: string;
    type?: "image" | "video" | "audio";
    label?: string;
    size?: CsekImageSize;
    fallbackSize?: CsekImageSize;
    altText?: string;
    className?: string;
}

export const CsekMediaUpload = ({
    onChange,
    urlAttribute = "",
    type = "image",
    label,
    size = "full",
    fallbackSize = "full",
    altText = "",
    className = "",
}: CsekMediaUploadProps) => {
    const [resourceURL, setResourceURL] = useState(urlAttribute);
    const [resourceId, setResourceId] = useState(0);

    const handleChangeURL = async (v: any) => {
        if (type === "audio") return;
        else if (type === "video") {
            log("video url: ", v.url);
            onChange(v.url);
            setResourceURL(v.url);
            setResourceId(v.id);
            return;
        }

        const resource = new CsekImage(v.id, "image", altText || undefined);
        await resource.doubleCheckSizes();
        // alert("Resource info: " + JSON.stringify({ ...resource }, null, 4));
        onChange(resource.getSize(size, fallbackSize), resource.altText);
        setResourceURL(v.url);
        setResourceId(v.id);
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
        <CsekCard className={twMerge("flex flex-col gap-4 py-4 flex-grow", className)}>
            {label ? <Heading level="3">{label}</Heading> : null}
            <MediaUploadCheck fallback={<Label>You are not permitted to upload media.</Label>}>
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
        </CsekCard>
    );
};