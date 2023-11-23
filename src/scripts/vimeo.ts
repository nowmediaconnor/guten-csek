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

        this.fetchVideoData();
    }

    createPlayer(parentId: string) {
        if (!this.apiResponseData) return null;

        const options = {
            id: this.apiResponseData.video_id,
            width: this.width,
            loop: false,
        };

        const player = new Player(parentId, options);
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

    async fetchVideoData() {
        try {
            const response = await fetch(`https://vimeo.com/api/oembed.json?url=${this.vimeoURL}`);
            const data = await response.json();
            this.apiResponseData = data;
        } catch (err: any) {
            console.error(err);
            this.apiResponseData = null;
        }
    }

    static async getThumbnailURL(vimeoURL: string, width: number = 640, height: number = 360): Promise<string | null> {
        const video = new VimeoVideo(vimeoURL, width, height);
        await video.fetchVideoData().then(() => {
            return video.apiResponseData;
        });
        if (!video.apiResponseData) return null;
        return video.apiResponseData.thumbnail_url;
    }
}
