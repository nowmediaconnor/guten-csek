/*
 * Created on Wed Nov 29 2023
 * Author: Connor Doman
 */

import { error } from "./global";

type CsekImageSize = "thumbnail" | "medium" | "large" | "full";

interface ImageSizeData {
    file: string;
    width: number;
    height: number;
    filesize: number;
    mime_type: "image/jpeg" | "image/png" | "image/gif";
    source_url: string;
}

export class CsekImage {
    private static readonly SIZE_ORDER: CsekImageSize[] = ["large", "medium", "thumbnail", "full"];

    private id: number;
    private alt: string;
    private sizes: { [key: string]: ImageSizeData };

    private type: "image" | "video";

    private _url: string;

    constructor(id: number, type: "image" | "video" = "image", alt?: string) {
        this.id = id;
        this.type = type;

        if (alt) {
            this.alt = alt;
        }

        this.preload();
    }

    async preload() {
        try {
            const response = await fetch(`/wp-json/wp/v2/media/${this.id}?context=embed`);

            const data = await response.json();
            if (!this.alt) this.alt = data.alt_text;
            this.sizes = data.media_details.sizes;

            if (this.type === "video") {
                this._url = data.source_url;
            }
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

        // If the fallback size exists, return it
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
        if (!this.sizes) return "";
        return this.sizes.thumbnail.source_url;
    }

    get medium(): string {
        if (!this.sizes) return "";
        return this.sizes.medium.source_url;
    }

    get large(): string {
        if (!this.sizes) return "";
        return this.sizes.large.source_url;
    }

    get full(): string {
        if (!this.sizes) return "";
        return this.sizes.full.source_url;
    }

    get altText(): string {
        return this.alt;
    }
}
