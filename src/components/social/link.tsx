/*
 * Created on Wed Feb 28 2024
 * Author: Connor Doman
 */

export type SocialMedia = "facebook" | "x-twitter" | "linkedin" | "reddit" | "email";

function generateSocialLink(media: SocialMedia, link: string, title?: string): URL {
    let url: URL;
    let params = new URLSearchParams();

    switch (media) {
        case "facebook":
            url = new URL(`https://www.facebook.com/sharer/sharer.php`);
            params.append("u", link);
            break;
        case "x-twitter":
            url = new URL(`https://twitter.com/share`);
            params.append("url", link);
            if (title) {
                params.append("text", title);
            }
            break;
        case "linkedin":
            url = new URL(`https://www.linkedin.com/sharing/share-offsite/`);
            params.append("url", link);
            break;
        case "reddit":
            url = new URL(`https://www.reddit.com/submit`);
            params.append("url", link);
            if (title) {
                params.append("title", title);
            }
            break;
        case "email":
            url = new URL(`mailto:`);
            params.append("subject", title);
            params.append("body", link);
            break;
    }

    url.search = params.toString();
    return url;
}

interface SocialIconProps {
    media: SocialMedia;
}

export const SocialIcon = ({ media }: SocialIconProps) => {
    let className = "";
    switch (media) {
        case "facebook":
            className = "fab fa-facebook-f";
            break;
        case "x-twitter":
            className = "fab fa-x-twitter";
            break;
        case "linkedin":
            className = "fab fa-linkedin";
            break;
        case "reddit":
            className = "fab fa-reddit-alien";
            break;
        case "email":
            className = "fas fa-envelope-square";
            break;
    }
    return <i className={className}></i>;
};

type SocialLinkPropsBase = {
    link: string;
};

type SocialLinkPropsWithTitle = SocialLinkPropsBase & {
    media: "x-twitter" | "reddit" | "email";
    title: string;
};

type SocialLinkPropsWithoutTitle = SocialLinkPropsBase & {
    media: "facebook" | "linkedin";
    title?: never;
};

type SocialLinkProps = SocialLinkPropsWithTitle | SocialLinkPropsWithoutTitle;

export const SocialLink = ({ media, link, title }: SocialLinkProps) => {
    return (
        <a
            href={generateSocialLink(media, link, title).toString()}
            className="inline-flex text-xl w-10 h-10 items-center justify-center rounded-full bg-csek-dark text-white"
            target="_blank"
            rel="noopener noreferrer">
            <SocialIcon media={media} />
        </a>
    );
};
