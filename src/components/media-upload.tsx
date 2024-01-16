/*
 * Created on Wed Sep 27 2023
 * Author: Connor Doman
 */

import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import React, { useState } from "@wordpress/element";
import { Heading } from "./heading";
import { capitalize } from "../scripts/strings";
import { CsekAddButton } from "./button";
import Label from "./label";
import { CsekImage } from "../scripts/image";
import { twMerge } from "tailwind-merge";
import { log } from "../scripts/global";
import { getMediaById } from "../scripts/wp";
import CsekCard from "./card";

interface CsekMediaUploadProps {
    onChange: (v: string, altText?: string) => void;
    urlAttribute?: string;
    type?: "image" | "video" | "audio";
    label?: string;
    size?: "thumbnail" | "medium" | "large" | "full";
    altText?: string;
    className?: string;
}

export const CsekMediaUpload = ({
    onChange,
    urlAttribute = "",
    type = "image",
    label,
    size = "full",
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

        const resUrl = (resource: CsekImage) => {
            switch (size) {
                case "thumbnail":
                    return resource.thumbnail;
                case "medium":
                    return resource.medium;
                case "large":
                    return resource.large;
                case "full":
                    return resource.full;
                default:
                    return resource.full;
            }
        };

        await getMediaById(v.id);
        const resource = new CsekImage(v.id, "image", altText || undefined);
        await resource.doubleCheckSizes();
        // alert("Resource info: " + JSON.stringify({ ...resource }, null, 4));
        onChange(resUrl(resource), resource.altText);
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
