/*
 * Created on Mon Oct 02 2023
 * Author: Connor Doman
 */

import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import {
    SelfDescriptionBlockAttributes,
    SelfDescriptionBlockEdit,
    SelfDescriptionBlockSave,
} from "../blocks/misc/self-description-block";
import {
    StaffProfile,
    StaffProfilesBlockAttributes,
    StaffProfilesBlockEdit,
    StaffProfilesBlockSave,
} from "../blocks/misc/staff-profiles-block";
import { LetsTalkBlockAttributes, LetsTalkBlockEdit, LetsTalkBlockSave } from "../blocks/misc/lets-talk-block";
import {
    ProjectSummaryBlockAttributes,
    ProjectSummaryBlockEdit,
    ProjectSummaryBlockSave,
} from "../blocks/misc/project-summary-block";
import {
    FeaturedImageBlockAttributes,
    FeaturedImageBlockEdit,
    FeaturedImageBlockSave,
} from "../blocks/misc/featured-image-block";
import { LeftRightBlockAttributes, LeftRightBlockEdit, LeftRightBlockSave } from "../blocks/misc/left-right-block";
import {
    FullscreenImageBlockAttributes,
    FullscreenImageBlockEdit,
    FullscreenImageBlockSave,
} from "../blocks/misc/fullscreen-image-block";
import {
    NextProjectBlockAttributes,
    NextProjectBlockEdit,
    NextProjectBlockSave,
} from "../blocks/misc/next-project-block";
import {
    ExpandingVideoBlockEdit,
    ExpandingVideoBlockSave,
    ExpandingVideoBlockAttributes,
} from "../blocks/expanding-video-block";
import { BlockquoteBlockEdit, BlockquoteBlockSave, BlockquoteBlockAttributes } from "../blocks/blockquote-block";
import { TaglineHeaderAttributes, TaglineHeaderEdit, TaglineHeaderSave } from "../blocks/tagline-header-block";
import { ParagraphBlockAttributes, ParagraphBlockEdit, ParagraphBlockSave } from "../blocks/misc/paragraph-block";
import { MultiImageBlockAttributes, MultiImageBlockEdit, MultiImageBlockSave } from "../blocks/misc/multi-image-block";
import {
    EmphasizedTextBlockAttributes,
    EmphasizedTextBlockEdit,
    EmphasizedTextBlockSave,
} from "../blocks/misc/emphasized-text-block";
import {
    CyclingStackBlockAttributes,
    CyclingStackBlockEdit,
    CyclingStackBlockSave,
} from "../blocks/misc/cycling-stack-block";
import { PageHeaderBlockAttributes, PageHeaderBlockEdit, PageHeaderBlockSave } from "../blocks/misc/page-header-block";
import {
    VideoCarouselAttributes,
    VideoCarouselBlockEdit,
    VideoCarouselBlockSave,
} from "../blocks/video-carousel-block";
import { HorizontalCarouselBlockEdit, HorizontalCarouselBlockSave } from "../blocks/horizontal-carousel-block";
import {
    ChicagoFiresBlockAttributes,
    ChicagoFiresBlockEdit,
    ChicagoFiresBlockSave,
} from "../blocks/misc/chicago-fires-block";
import {
    FeaturedVideoBlockAttributes,
    FeaturedVideoBlockEdit,
    FeaturedVideoBlockSave,
} from "../blocks/misc/featured-video-block";
import { ImageCollageBlockEdit, ImageCollageBlockSave } from "../blocks/misc/image-collage-block";
import { ScreenshotCollageBlockEdit, ScreenshotCollageBlockSave } from "../blocks/misc/screenshot-collage-block";
import { ScrollingProjectsBlockEdit, ScrollingProjectsBlockSave } from "../blocks/scrolling-projects-block";
import { TeamBlockEdit, TeamBlockSave } from "../blocks/team-block";
import ProcessBlockController, { ProcessBlockAttributes } from "../blocks/process-block";
import ProjectsMasonryBlock, { ProjectsMasonryBlockAttributes } from "../blocks/projects/masonry-block";
import {
    PostCollageBlockAttributes,
    PostCollageBlockEdit,
    PostCollageBlockSave,
} from "../blocks/blog/post-collage-block";
import { log } from "./global";
import { NewsletterBlockAttributes, NewsletterBlockEdit, NewsletterBlockSave } from "../blocks/cta/newsletter-block";

const commonProperties = {
    category: "csek",
    supports: {
        spacing: {
            margin: true,
            padding: true,
        },
    },
};

export const registerAllBlocks = () => {
    log("Registering blocks...");

    // Self description block
    registerBlockType<SelfDescriptionBlockAttributes>("guten-csek/self-description-block", {
        ...commonProperties,
        title: "Csek Self Description",
        icon: "text-page",
        attributes: {
            heading: {
                type: "string",
                default: "",
            },
            caption: {
                type: "string",
                default: "",
            },
            primaryImageURL: {
                type: "string",
                default: "",
            },
            secondaryImageURL: {
                type: "string",
                default: "",
            },
            factHeaders: {
                type: "array",
                default: [],
            },
            factDescriptions: {
                type: "array",
                default: [],
            },
        },
        edit: SelfDescriptionBlockEdit,
        save: SelfDescriptionBlockSave,
    });

    // Staff profiles block
    registerBlockType<StaffProfilesBlockAttributes>("guten-csek/staff-profiles-block", {
        ...commonProperties,
        title: "Csek Staff Showcase",
        icon: "groups",
        attributes: {
            heading: {
                type: "string",
                default: "",
            },
            caption: {
                type: "string",
                default: "",
            },
            profiles: {
                type: "array",
                default: [] as StaffProfile[],
            },
            alternateLayout: {
                type: "boolean",
                default: false,
            },
        },
        edit: StaffProfilesBlockEdit,
        save: StaffProfilesBlockSave,
    });

    // Let's Talk / CTA block
    registerBlockType<LetsTalkBlockAttributes>("guten-csek/lets-talk-block", {
        ...commonProperties,
        title: "Csek Let's Talk (CTA)",
        icon: "megaphone",
        attributes: {
            heading: {
                type: "string",
                default: "Want to discuss our capabilities? Get in touch.",
            },
            buttonText: {
                type: "string",
                default: "Let's Talk",
            },
            imageURL: {
                type: "string",
                default: "",
            },
        },
        edit: LetsTalkBlockEdit,
        save: LetsTalkBlockSave,
    });

    // Project summary block
    registerBlockType<ProjectSummaryBlockAttributes>("guten-csek/project-summary-block", {
        ...commonProperties,
        title: "Csek Project Summary",
        icon: "text-page",
        attributes: {
            backgroundColor: {
                type: "string",
                default: "000000",
            },
            projectTagline: {
                type: "string",
                default: "",
            },
            projectSummary: {
                type: "string",
                default: "",
            },
            taggedServices: {
                type: "array",
                default: [],
            },
            websiteLink: {
                type: "string",
                default: "",
            },
            displayLink: {
                type: "string",
                default: "",
            },
            usesCustomBackgroundColor: {
                type: "boolean",
                default: false,
            },
            companySector: {
                type: "string",
                default: "",
            },
        },
        edit: ProjectSummaryBlockEdit,
        save: ProjectSummaryBlockSave,
    });

    // Featured Image Block
    registerBlockType<FeaturedImageBlockAttributes>("guten-csek/featured-image-block", {
        ...commonProperties,
        title: "Csek Featured Image",
        icon: "format-image",
        attributes: {
            imageURL: {
                type: "string",
                default: "",
            },
            imageAlt: {
                type: "string",
                default: "",
            },
        },
        edit: FeaturedImageBlockEdit,
        save: FeaturedImageBlockSave,
    });

    // Fullscreen Image Block
    registerBlockType<FullscreenImageBlockAttributes>("guten-csek/fullscreen-image-block", {
        ...commonProperties,
        title: "Csek Fullscreen Image",
        icon: "format-image",
        attributes: {
            imageURL: {
                type: "string",
                default: "",
            },
            imageAlt: {
                type: "string",
                default: "",
            },
        },
        edit: FullscreenImageBlockEdit,
        save: FullscreenImageBlockSave,
    });

    // Left-Right Block
    registerBlockType<LeftRightBlockAttributes>("guten-csek/left-right-block", {
        ...commonProperties,
        title: "Csek Left-Right",
        icon: "columns",
        attributes: {
            text: {
                type: "string",
                default: "",
            },
            imageURL: {
                type: "string",
                default: "",
            },
            altText: {
                type: "string",
                default: "",
            },
            leftToRight: {
                type: "boolean",
                default: true,
            },
        },
        edit: LeftRightBlockEdit,
        save: LeftRightBlockSave,
    });

    // Next Project Block
    registerBlockType<NextProjectBlockAttributes>("guten-csek/next-project-block", {
        ...commonProperties,
        title: "Csek Next Project",
        icon: "text",
        attributes: {
            projectTitle: {
                type: "string",
                default: "",
            },
            projectLink: {
                type: "string",
                default: "",
            },
            projectImageURL: {
                type: "string",
                default: "",
            },
        },
        edit: NextProjectBlockEdit,
        save: NextProjectBlockSave,
    });

    // Expanding Video Block
    registerBlockType<ExpandingVideoBlockAttributes>("guten-csek/expanding-video-block", {
        ...commonProperties,
        title: "Csek Curtain Video",
        icon: "format-video",
        attributes: {
            expandingMediaURL: {
                type: "string",
                default: "",
            },
            images: {
                type: "array",
                default: [],
            },
            messageHeading: {
                type: "string",
                default: "",
            },
            message: {
                type: "string",
                default: "",
            },
            expandingElementType: {
                type: "string",
                default: "video",
            },
        },
        edit: ExpandingVideoBlockEdit,
        save: ExpandingVideoBlockSave,
    });

    // Block Quote Block
    registerBlockType<BlockquoteBlockAttributes>("guten-csek/block-quote-block", {
        ...commonProperties,
        title: "Csek Blockquote",
        icon: "format-quote",
        attributes: {
            heading: {
                type: "string",
                default: "",
            },
            quote: {
                type: "string",
                default: "",
            },
            author: {
                type: "string",
                default: "",
            },
            authorRole: {
                type: "string",
                default: "",
            },
        },
        edit: BlockquoteBlockEdit,
        save: BlockquoteBlockSave,
    });

    // Tagline Header Block
    registerBlockType<TaglineHeaderAttributes>("guten-csek/tagline-header-block", {
        ...commonProperties,
        title: "Csek Tagline Header",
        icon: "text",
        attributes: {
            preTagline: {
                type: "string",
                default: "Welcome to",
            },
            tagline: {
                type: "string",
                default: "The House of More.",
            },
            subTagline: {
                type: "string",
                default: "We are a full-service marketing agency that delivers results.",
            },
            imageURL: {
                type: "string",
                default: "",
            },
        },
        edit: TaglineHeaderEdit,
        save: TaglineHeaderSave,
    });

    // Paragraph Block
    registerBlockType<ParagraphBlockAttributes>("guten-csek/paragraph-block", {
        ...commonProperties,
        title: "Csek Paragraph",
        icon: "text",
        attributes: {
            text: {
                type: "string",
                default: "",
            },
        },
        edit: ParagraphBlockEdit,
        save: ParagraphBlockSave,
    });

    // Multi Image Block
    registerBlockType<MultiImageBlockAttributes>("guten-csek/multi-image-block", {
        ...commonProperties,
        title: "Csek Multi Image",
        icon: "format-image",
        attributes: {
            images: {
                type: "array",
                default: [],
            },
            title: {
                type: "string",
                default: "",
            },
            altTexts: {
                type: "array",
                default: [],
            },
        },
        edit: MultiImageBlockEdit,
        save: MultiImageBlockSave,
    });

    // Emhpasized Text Block
    registerBlockType<EmphasizedTextBlockAttributes>("guten-csek/emphasized-text-block", {
        ...commonProperties,
        title: "Csek Emphasized Text",
        icon: "text",
        supports: {
            ...commonProperties.supports,
            color: {
                background: true,
                text: true,
            },
            typography: {
                fontSize: true,
                lineHeight: true,
            },
        },
        attributes: {
            text: {
                type: "string",
                default: "",
            },
        },
        edit: EmphasizedTextBlockEdit,
        save: EmphasizedTextBlockSave,
    });

    // Page Header Block
    registerBlockType<PageHeaderBlockAttributes>("guten-csek/page-header-block", {
        ...commonProperties,
        title: "Csek Page Header Block",
        icon: "text",
        attributes: {
            heading: {
                type: "string",
                default: "",
            },
            subheading: {
                type: "string",
                default: "",
            },
            featuredText: {
                type: "string",
                default: "",
            },
            usesInnerBlock: {
                type: "boolean",
                default: false,
            },
        },
        edit: PageHeaderBlockEdit,
        save: PageHeaderBlockSave,
    });

    // Cycling Stack Block
    registerBlockType<CyclingStackBlockAttributes>("guten-csek/cycling-stack-block", {
        ...commonProperties,
        title: "Csek Cycling Stack",
        icon: "text",
        attributes: {
            cyclingWords: {
                type: "array",
                default: [],
            },
            keyword: {
                type: "string",
                default: "",
            },
        },
        edit: CyclingStackBlockEdit,
        save: CyclingStackBlockSave,
    });

    // Video Carousel Block
    registerBlockType<VideoCarouselAttributes>("guten-csek/video-carousel-block", {
        ...commonProperties,
        title: "Csek Video Carousel Block",
        icon: "format-video",
        attributes: {
            videos: {
                type: "array",
                default: [],
            },
        },
        edit: VideoCarouselBlockEdit,
        save: VideoCarouselBlockSave,
    });

    // Scrolling Projects Block
    registerBlockType("guten-csek/scrolling-projects-block", {
        ...commonProperties,
        title: "Csek Scrolling Projects Block",
        icon: "format-video",
        attributes: {
            projects: {
                type: "array",
                default: [],
            },
        },
        edit: ScrollingProjectsBlockEdit,
        save: ScrollingProjectsBlockSave,
    });

    // Team Block
    registerBlockType("guten-csek/team-block", {
        ...commonProperties,
        title: "Csek Team Block",
        icon: "admin-users",
        attributes: {
            images: {
                type: "array",
                default: [],
            },
            title: {
                type: "string",
                default: "",
            },
            tagline: {
                type: "string",
                default: "",
            },
            copyText: {
                type: "string",
                default: "",
            },
            cta: {
                type: "string",
                default: "",
            },
            ctaLink: {
                type: "string",
                default: "",
            },
        },
        edit: TeamBlockEdit,
        save: TeamBlockSave,
    });

    // Horizontal Carousel Block
    registerBlockType("guten-csek/horizontal-carousel-block", {
        ...commonProperties,
        title: "Csek Horizontal Carousel Block",
        icon: "columns",
        attributes: {
            titles: {
                type: "array",
                default: [],
            },
            statements: {
                type: "array",
                default: [],
            },
            numItems: {
                type: "number",
                default: 1,
            },
        },
        edit: HorizontalCarouselBlockEdit,
        save: HorizontalCarouselBlockSave,
    });

    /* Misc Blocks */

    // DOM Controller Block
    // registerBlockType("guten-csek/dom-controller-block", {
    //     title: "Csek Script Manager Block",
    //     icon: "admin-settings",
    //     category: "csek",
    //     attributes: {
    //         controllerScripts: {
    //             type: "array",
    //             default: [],
    //         },
    //         enabledScripts: {
    //             type: "array",
    //             default: [],
    //         },
    //     },
    //     edit: DOMControllerBlockEdit,
    //     save: () => null,
    // });

    // Image Collage Block
    registerBlockType("guten-csek/image-collage-block", {
        ...commonProperties,
        title: "Csek Image Collage Block",
        icon: "format-image",
        attributes: {
            images: {
                type: "array",
                default: [],
            },
            imageAlts: {
                type: "array",
                default: [],
            },
            backgroundColor: {
                type: "string",
                default: "#000000",
            },
        },
        edit: ImageCollageBlockEdit,
        save: ImageCollageBlockSave,
    });

    // Screenshot Collage Block
    registerBlockType("guten-csek/screenshot-collage-block", {
        ...commonProperties,
        title: "Csek Screenshot Collage Block",
        icon: "desktop",
        attributes: {
            screenshots: {
                type: "array",
                default: [],
            },
            screenshotAlts: {
                type: "array",
                default: [],
            },
            backgroundColor: {
                type: "string",
                default: "#000000",
            },
            angleDegrees: {
                type: "number",
                default: 0,
            },
        },
        edit: ScreenshotCollageBlockEdit,
        save: ScreenshotCollageBlockSave,
    });

    // Featured Video Block
    registerBlockType<FeaturedVideoBlockAttributes>("guten-csek/featured-video-block", {
        ...commonProperties,
        title: "Csek Featured Video Block",
        icon: "format-video",
        attributes: {
            videoURL: {
                type: "string",
                default: "",
            },
        },
        edit: FeaturedVideoBlockEdit,
        save: FeaturedVideoBlockSave,
    });

    // Chicago Fires Block
    registerBlockType<ChicagoFiresBlockAttributes>("guten-csek/chicago-fires-block", {
        ...commonProperties,
        title: "Csek Chicago Fires Block",
        icon: "text",
        attributes: {
            primaryHeading: {
                type: "string",
                default: "",
            },
            secondaryHeadings: {
                type: "array",
                default: [],
            },
            primaryMessage: {
                type: "string",
                default: "",
            },
            secondaryMessages: {
                type: "array",
                default: [],
            },
        },
        edit: ChicagoFiresBlockEdit,
        save: ChicagoFiresBlockSave,
    });

    // New Process Block
    registerBlockType<ProcessBlockAttributes>("guten-csek/process-block", {
        ...commonProperties,
        title: "Csek Process Block",
        icon: "text",
        attributes: {
            steps: {
                type: "array",
                default: [],
            },
        },
        edit: ProcessBlockController.editComponent,
        save: ProcessBlockController.saveComponent,
    });

    // Projects Masonry Block
    registerBlockType<ProjectsMasonryBlockAttributes>("guten-csek/projects-masonry-block", {
        ...commonProperties,
        title: "Csek Posts Masonry Block",
        icon: "text",
        attributes: {
            categoryId: {
                type: "number",
                default: -1,
            },
            category: {
                type: "string",
                default: "projects",
            },
            amount: {
                type: "number",
                default: 3,
            },
            gridColumns: {
                type: "number",
                default: 3,
            },
            gridRows: {
                type: "number",
                default: -1,
            },
        },
        edit: ProjectsMasonryBlock.editComponent,
        save: ProjectsMasonryBlock.saveComponent,
    });

    // Post Collage Block
    registerBlockType<PostCollageBlockAttributes>("guten-csek/post-collage-block", {
        ...commonProperties,
        title: "Csek Post Collage Block",
        icon: "text",
        supports: {
            spacing: {
                margin: true,
                padding: true,
            },
        },
        attributes: {
            chosenCategory: {
                type: "number",
                default: -1,
            },
            postCount: {
                type: "number",
                default: 6,
            },
            foundTags: {
                type: "array",
                default: [],
            },
        },
        edit: PostCollageBlockEdit,
        save: PostCollageBlockSave,
    });

    // Newsletter CTA block
    registerBlockType<NewsletterBlockAttributes>("guten-csek/newsletter-cta-block", {
        ...commonProperties,
        title: "Csek Newsletter CTA Block",
        icon: "text",
        attributes: {
            heading: {
                type: "string",
                default: "Say Yes",
            },
            subheading: {
                type: "string",
                default: "To Marketing Tips",
            },
            message: {
                type: "string",
                default: "And more info on the latest industry trends & data, plus exclusive event invites.",
            },
            buttonText: {
                type: "string",
                default: "Subscribe Now",
            },
            buttonLink: {
                type: "string",
                default: "#newsletter-link",
            },
            gravityFormId: {
                type: "number",
                default: -1,
            },
        },
        edit: NewsletterBlockEdit,
        save: NewsletterBlockSave,
    });
};
