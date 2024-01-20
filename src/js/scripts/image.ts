/*
 * Created on Wed Nov 29 2023
 * Author: Connor Doman
 */

import { error, log } from "../guten-csek";
import { getMediaById } from "./wp";

export type CsekImageSize = "thumbnail" | "medium" | "large" | "full";

type WPMimeType = "image/jpeg" | "image/png" | "image/gif";

interface WPMediaDetails {
    file: string;
    filesize: number;
    height: number;
    image_meta: any;
    sizes: { [key: string]: WPImageSizeData };
    width: number;
}

interface WPImageSizeData {
    file: string;
    width: number;
    height: number;
    filesize: number;
    mime_type: WPMimeType;
    source_url: string;
}

export class CsekImage {
    private static readonly SIZE_ORDER: CsekImageSize[] = ["large", "medium", "thumbnail", "full"];

    private id: number;
    private alt: string;
    private sizes: { [key: string]: WPImageSizeData };

    private type: "image" | "video";

    private _url: string;

    constructor(id: number, type: "image" | "video" = "image", alt?: string) {
        this.id = id;
        this.type = type;

        if (alt) {
            this.alt = alt;
        } else {
            this.alt = "No alt text provided";
        }

        this.sizes = {};
        this._url = "";

        this.preload();
    }

    async preload() {
        try {
            // const response = await fetch(`/wp-json/wp/v2/media/${this.id}?context=embed`);
            // const data = await response.json();

            const data = await getMediaById(this.id);

            if (!this.alt) this.alt = data.alt_text;

            // videos
            if (this.type === "video") {
                this._url = data.source_url;
                return;
            }

            // images
            const details = data.media_details as unknown as WPMediaDetails;

            const foundSizes = details.sizes as { [key: string]: WPImageSizeData };

            // if sizes is empty, it's probably a too-small image
            // default becomes thumbnail
            if (Object.keys(foundSizes).length === 0) {
                this.sizes = {
                    thumbnail: {
                        file: details.file,
                        source_url: data.source_url,
                        width: details.width,
                        height: details.height,
                        filesize: details.filesize,
                        mime_type: data.mime_type as WPMimeType,
                    },
                };
                return;
            }

            this.sizes = foundSizes;
        } catch (err: any) {
            error(`[CsekImage] Error: ${err}`);
        }
    }

    async doubleCheckSizes() {
        if (!this.sizes) {
            await this.preload();
        }
    }

    getSize(size: CsekImageSize, fallbackSize?: CsekImageSize): string {
        // If the size exists, return it
        if (this.sizes && this.sizes[size]) {
            return this.sizes[size].source_url;
        }

        // If the fallback size is provided and available, return it instead
        if (fallbackSize && this.sizes && this.sizes[fallbackSize]) {
            return this.sizes[fallbackSize].source_url;
        }

        // If the size doesn't exist, return the next largest size
        const index = CsekImage.SIZE_ORDER.indexOf(size);
        if (index < 0 || index === CsekImage.SIZE_ORDER.length - 1) {
            return this.sizes ? this.sizes.full.source_url : "";
        } else {
            return this.getSize(CsekImage.SIZE_ORDER[index + 1]);
        }
    }

    get url(): string {
        switch (this.type) {
            case "image":
                return this.full;
            case "video":
                return this._url;
        }
    }

    get thumbnail(): string {
        // if (!this.sizes) return "";
        // return this.sizes.thumbnail.source_url;
        return this.getSize("thumbnail");
    }

    get medium(): string {
        // if (!this.sizes) return "";
        // return this.sizes.medium.source_url;
        return this.getSize("medium");
    }

    get large(): string {
        // if (!this.sizes) return "";
        // return this.sizes.large.source_url;
        return this.getSize("large");
    }

    get full(): string {
        // if (!this.sizes) return "";
        // return this.sizes.full.source_url;
        return this.getSize("full");
    }

    get altText(): string {
        return this.alt;
    }
}
