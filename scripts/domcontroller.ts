/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import DOMController from "./dom";
import ScrollDownController from "./controllers/scroll-down-controller";
import CarouselController from "./controllers/carousel-controller";
import VideoCarouselController from "./controllers/video-carousel-controller";
import ExpandingVideoController from "./controllers/expanding-video-controller";
import ScrollingProjectsController from "./controllers/scrolling-projects-controller";
import CurtainifyController from "./controllers/curtainify-controller";
import TeamController from "./controllers/team-controller";
import NextProjectController from "./controllers/next-project-controller";
import FeaturedVideoController from "./controllers/featured-video-controller";
import StaffProfilesController from "./controllers/staff-profiles-controller";
import CyclingStackController from "./controllers/cycling-stack-controller";
import ProjectsMarqueeController from "./controllers/projects-marquee-controller";
// import ProcessBlockController from "./blocks/process-block";
// import { ProjectsMasonryController } from "./blocks/projects/masonry-block";
import PostCollageController from "./controllers/blog/post-collage-controller";

export const createDOMController = () => {
    /* Prepare DOM Controller */

    // First, prepare curtain elements
    const curtainifyController = new CurtainifyController();
    // prepareCurtainElements();

    // "Scroll Down" controller
    const scrollController = new ScrollDownController("scroll-down", ".header-scroll-down-target");
    // Scrolling carousel
    const carouselController = new CarouselController(".wp-block-guten-csek-horizontal-carousel-block");
    // Video carousel
    const videoCarouselController = new VideoCarouselController(".wp-block-guten-csek-video-carousel-block");
    // Scrolling projects block
    const scrollingProjectsController = new ScrollingProjectsController(
        ".wp-block-guten-csek-scrolling-projects-block"
    );
    // Expanding video controller
    const expandingVideoController = new ExpandingVideoController(".wp-block-guten-csek-expanding-video-block");

    // Team Block Controller
    const teamController = new TeamController();

    // Next Project Controller
    const nextProjectController = new NextProjectController(".wp-block-guten-csek-next-project-block");

    // Featured Video Controller
    const featuredVideoController = new FeaturedVideoController(".wp-block-guten-csek-featured-video-block");

    // Staff Profiles Block
    const staffProfilesController = new StaffProfilesController(".wp-block-guten-csek-staff-profiles-block");

    // Cycling Stack Component
    const cyclingStackController = new CyclingStackController();

    // // Process Block
    // const processBlockController = new ProcessBlockController();

    // // Projects Masonry Block
    // const projectsMasonryBlock = new ProjectsMasonryController();

    // Post Collage Block
    const postCollageController = new PostCollageController();

    // DOM controller
    return new DOMController(
        curtainifyController,
        scrollController,
        videoCarouselController,
        scrollingProjectsController,
        expandingVideoController,
        carouselController,
        nextProjectController,
        featuredVideoController,
        staffProfilesController,
        cyclingStackController,
        teamController,
        // processBlockController,
        // projectsMasonryBlock,
        postCollageController
    );
};
