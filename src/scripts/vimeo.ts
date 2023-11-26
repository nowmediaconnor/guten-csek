/*
 * Created on Wed Nov 22 2023
 * Author: Connor Doman
 */

import Player from "@vimeo/player";

export interface VimeoResponse {
    type: string;
    version: string;
    provider_name: string;
    provider_url: string;
    title: string;
    author_name: string;
    author_url: string;
    is_plus: string;
    account_type: string;
    html: string;
    width: number;
    height: number;
    duration: number;
    description: string;
    thumbnail_url: string;
    thumbnail_width: number;
    thumbnail_height: number;
    thumbnail_url_with_play_button: string;
    upload_date: string;
    video_id: number;
    uri: string;
}

export default class VimeoVideo {
    vimeoURL: string;
    autoplay: boolean;
    width: number;
    height: number;

    apiResponseData: VimeoResponse | null;

    constructor(vimeoURL: string, width: number = 640, height: number = 360, autoplay: boolean = false) {
        this.vimeoURL = vimeoURL;
        this.width = width;
        this.height = height;
        this.autoplay = autoplay;

        this.apiResponseData = null;

        // VimeoVideo.fetchVideoData(vimeoURL).then((data) => {
        //     this.apiResponseData = data;
        // });
    }

    createPlayer(parent: string | HTMLElement) {
        if (!this.apiResponseData) return null;

        const options: any = {
            id: this.apiResponseData.video_id,
            width: this.width,
            loop: false,
            colors: [undefined, undefined, undefined, "#131313"],
        };

        const player = new Player(parent, options);
        return player;
    }

    get thumbnail() {
        const thumbnail = document.createElement("img");
        thumbnail.src = this.apiResponseData?.thumbnail_url || "";
        thumbnail.width = this.width;
        thumbnail.height = this.height;
        thumbnail.alt = this.apiResponseData?.title || "";
        return thumbnail;
    }

    async updateVideoData(): Promise<VimeoResponse | null> {
        // console.log("-VideoCarouselController- Updating video data");
        if (this.apiResponseData) {
            // console.log("-VideoCarouselController- Video data already fetched");
            return this.apiResponseData;
        }

        this.apiResponseData = await VimeoVideo.fetchVideoData(this.vimeoURL, this.width, this.height);

        // console.log("-VideoCarouselController- Video data fetched: ", this.apiResponseData);

        return this.apiResponseData;
    }

    static async fetchVideoData(url: string, width: number = 640, height: number = 360): Promise<VimeoResponse | null> {
        try {
            const response = await fetch(
                `https://vimeo.com/api/oembed.json?url=${encodeURI(
                    url
                )}&width=${width}&height=${height}&responive=true&playsinline=false`
            );
            const data = await response.json();
            return data as VimeoResponse;
        } catch (err: any) {
            console.error(err);
            return null;
        }
    }

    static async getThumbnailURL(vimeoURL: string, width: number = 640, height: number = 360): Promise<string | null> {
        const videoData = await VimeoVideo.fetchVideoData(vimeoURL);
        if (!videoData) return null;
        return videoData.thumbnail_url;
    }
}
