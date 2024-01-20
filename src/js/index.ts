/*
 * Created on Thu Aug 10 2023
 * Author: Connor Doman
 */

// import { createDOMController } from "./dom-controller";
import { runAccumulators } from "./scripts/accumulators";
import { log } from "./scripts/global";

// registerAllBlocks();

import DOMController from "./scripts/dom";
import ScrollDownController from "./scripts/controllers/scroll-down-controller";
import CarouselController from "./scripts/controllers/carousel-controller";
import VideoCarouselController from "./scripts/controllers/video-carousel-controller";
import ExpandingVideoController from "./scripts/controllers/expanding-video-controller";
import ScrollingProjectsController from "./scripts/controllers/scrolling-projects-controller";
import CurtainifyController from "./scripts/controllers/curtainify-controller";
import TeamController from "./scripts/controllers/team-controller";
import NextProjectController from "./scripts/controllers/next-project-controller";
import FeaturedVideoController from "./scripts/controllers/featured-video-controller";
import StaffProfilesController from "./scripts/controllers/staff-profiles-controller";
import CyclingStackController from "./scripts/controllers/cycling-stack-controller";
import ProjectsMarqueeController from "./scripts/controllers/projects-marquee-controller";
// import ProcessBlockController from "../blocks/process-block";
// import { ProjectsMasonryController } from "../blocks/projects/masonry-block";
import PostCollageController from "./scripts/controllers/blog/post-collage-controller";
import { error } from "./guten-csek";

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

    // Process Block
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

window.addEventListener("load", (e) => {
    log("[Csek Creative] Window loaded.");

    /* Prepare Accumulator Elements */
    runAccumulators();

    /* Prepare DOM Controller */
    const domController = createDOMController();

    window.requestAnimationFrame(() => {
        try {
            domController.setup();
        } catch (e) {
            error(e);
            domController.isStarted = false;
        }
        domController.debugMode = true;
    });

    setTimeout(() => {
        // hide loading panel if DOM controller is not in use...
        if (!domController.isStarted || !domController) {
            domController.hideLoadingPanel();
        }
    }, 1000);
});
