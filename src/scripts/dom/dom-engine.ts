/*
 * Created on Sat Mar 09 2024
 * Author: Connor Doman
 */

import {
    CyclingStackController,
    ExpandingMediaController,
    FeaturedVideoController,
    MasonryController,
    NewsletterController,
    NextProjectController,
    PostCollageController,
    ProcessController,
    ScrollingProjectsController,
    StaffProfilesController,
    TeamController,
    VideoCarouselController,
} from "./block-controllers";
import { ControllerConfig } from "./block-controllers/block-controller";
import { DOMEngine } from "./engine";

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
    {
        blockClassName: ".wp-block-guten-csek-projects-masonry-block",
        controller: MasonryController,
    },
    {
        blockClassName: ".wp-block-guten-csek-staff-profiles-block",
        controller: StaffProfilesController,
    },
    {
        blockClassName: ".wp-block-guten-csek-team-block",
        controller: TeamController,
    },
    {
        blockClassName: ".wp-block-guten-csek-video-carousel-block",
        controller: VideoCarouselController,
    },
];

export default new DOMEngine(...BLOCK_CONFIGS);
