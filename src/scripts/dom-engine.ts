/*
 * Created on Sat Mar 09 2024
 * Author: Connor Doman
 */

import {
    CyclingStackController,
    ExpandingMediaController,
    FeaturedVideoController,
    NextProjectController,
    ScrollingProjectsController,
} from "./dom/block-controllers";
import { ControllerConfig } from "./dom/block-controllers/block-controller";
import PostCollageController from "./dom/block-controllers/blog/post-collage";
import NewsletterController from "./dom/block-controllers/cta/newsletter";
import ProcessController from "./dom/block-controllers/misc/process";
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
    {
        blockClassName: ".wp-block-guten-csek-scrolling-projects-block",
        controller: ScrollingProjectsController,
    },
    {
        blockClassName: ".wp-block-guten-csek-newsletter-cta-block",
        controller: NewsletterController,
    },
    {
        blockClassName: ".wp-block-guten-csek-post-collage-block",
        controller: PostCollageController,
    },
    {
        blockClassName: ".wp-block-guten-csek-process-block",
        controller: ProcessController,
    },
];

export const domEngineSingleton = new DOMEngine(...BLOCK_CONFIGS);

export default domEngineSingleton;
