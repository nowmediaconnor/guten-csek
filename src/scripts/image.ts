/*
 * Created on Wed Nov 29 2023
 * Author: Connor Doman
 */

import apiFetch from "@wordpress/api-fetch";

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

    constructor(id: number) {
        this.id = id;

        this.preload();
    }

    async preload() {
        try {
            const response = await fetch(`/wp-json/wp/v2/media/${this.id}?context=embed`);
            console.log(await response.clone().json());
            const data = await response.json();
            this.alt = data.alt_text;
            this.sizes = data.media_details.sizes;
        } catch (err: any) {
            console.log(`[CsekImage] Error: ${err}`);
        }
    }

    async doubleCheckSizes() {
        if (!this.sizes) {
            await this.preload();
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
