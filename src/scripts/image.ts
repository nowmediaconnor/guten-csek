/*
 * Created on Wed Nov 29 2023
 * Author: Connor Doman
 */

enum ImageSizes {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
    XLARGE = "xlarge",
    XXLARGE = "xxlarge",
}

interface ImageDimensions {
    w: number;
    h: number;
}

const sizeMapping = {
    [ImageSizes.SMALL]: { min: 0, max: 300 },
    [ImageSizes.MEDIUM]: { min: 301, max: 768 },
    [ImageSizes.LARGE]: { min: 769, max: 1024 },
    [ImageSizes.XLARGE]: { min: 1025, max: 1536 },
    [ImageSizes.XXLARGE]: { min: 1537, max: Infinity },
};

function getSizeFromUrl(url: string): ImageDimensions {
    const regex = /(\d+)x(\d+)/;
    const match = url.match(regex);
    if (match) {
        return { w: parseInt(match[1]), h: parseInt(match[2]) };
    } else {
        return { w: 0, h: 0 };
    }
}

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
        const response = await fetch(`/wp-json/wp/v2/media/${this.id}`);
        const data = await response.json();
        this.sizes = data.media_details.sizes;
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
}
