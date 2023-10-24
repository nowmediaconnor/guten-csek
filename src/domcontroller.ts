/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

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

export const prepareBlockControllers = () => {
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
    const teamController = new TeamController(".wp-block-guten-csek-team-block");

    // Next Project Controller
    const nextProjectController = new NextProjectController(".wp-block-guten-csek-next-project-block");

    // Featured Video Controller
    const featuredVideoController = new FeaturedVideoController(".wp-block-guten-csek-featured-video-block");

    // Staff Profiles Block
    const staffProfilesController = new StaffProfilesController(".wp-block-guten-csek-staff-profiles-block");

    // Vertical Scrolling Images Controller
    // const verticalImagesController = new VerticalScrollingImagesController(
    //     ".vertical-scroll-container",
    //     ".vertical-scroll-grid"
    // );

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
        staffProfilesController
        // verticalImagesController
        // teamController
    );
};
