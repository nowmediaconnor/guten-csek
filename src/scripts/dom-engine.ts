/*
 * Created on Sat Mar 09 2024
 * Author: Connor Doman
 */

import {
    CyclingStackController,
    ExpandingMediaController,
    FeaturedVideoController,
    NextProjectController,
} from "./block-controllers";
import { ControllerConfig } from "./dom/block-controller";
import { DOMEngine } from "./dom/engine";

export const BLOCK_CONFIGS: ControllerConfig = [
    {
        blockClassName: ".wp-block-guten-csek-expanding-video-block",
        controller: ExpandingMediaController,
    },
    {
        blockClassName: ".cycling-stack",
        controller: CyclingStackController,
    },
    {
        blockClassName: ".wp-block-guten-csek-featured-video-block",
        controller: FeaturedVideoController,
    },
    {
        blockClassName: ".wp-block-guten-csek-next-project-block",
        controller: NextProjectController,
    },
];

export const domEngineSingleton = new DOMEngine(...BLOCK_CONFIGS);

export default domEngineSingleton;
