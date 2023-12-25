/*
 * Created on Wed Nov 29 2023
 * Author: Connor Doman
 */

interface ImageSizeData {
    file: string;
    width: number;
    height: number;
    filesize: number;
    mime_type: "image/jpeg" | "image/png" | "image/gif";
    source_url: string;
}

export class CsekImage {
    private id: number;
    private alt: string;
    private sizes: { [key: string]: ImageSizeData };

    private type: "image" | "video";

    private _url: string;

    constructor(id: number, type: "image" | "video" = "image") {
        this.id = id;
        this.type = type;

        this.preload();
    }

    async preload() {
        try {
            const response = await fetch(`/wp-json/wp/v2/media/${this.id}?context=embed`);
            console.log(await response.clone().json());
            const data = await response.json();
            this.alt = data.alt_text;
            this.sizes = data.media_details.sizes;

            if (this.type === "video") {
                this._url = data.source_url;
            }
        } catch (err: any) {
            console.log(`[CsekImage] Error: ${err}`);
        }
    }

    async doubleCheckSizes() {
        if (!this.sizes) {
            await this.preload();
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
        return this.sizes.thumbnail.source_url;
    }

    get medium(): string {
        return this.sizes.medium.source_url;
    }

    get large(): string {
        return this.sizes.large.source_url;
    }

    get full(): string {
        return this.sizes.full.source_url;
    }

    get altText(): string {
        return this.alt;
    }
}
