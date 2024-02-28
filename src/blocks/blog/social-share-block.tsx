/*
 * Created on Wed Feb 28 2024
 * Author: Connor Doman
 */

import { useBlockProps } from "@wordpress/block-editor";
import { VerticalBar } from "../../components/bar";
import CsekCard from "../../components/card";
import { CsekBlockHeading } from "../../components/heading";
import { CheckboxInput, TextInput } from "../../components/input";
import { SocialIcon, SocialLink, SocialMedia } from "../../components/social/link";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";

type SocialMediaSelections = {
    [K in SocialMedia]: boolean;
};

export interface SocialShareBlockAttributes {
    selected: SocialMediaSelections;
    permalink: string;
    title: string;
}

export const SocialShareBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<SocialShareBlockAttributes>) => {
    const { selected, permalink, title } = attributes;

    const handleSelection = (media: SocialMedia) => {
        setAttributes({
            selected: {
                ...selected,
                [media]: !selected[media],
            },
        });
    };

    const handleChangePermalink = (newPermalink: string) => {
        setAttributes({
            permalink: newPermalink,
        });
    };

    const handleChangeTitle = (newTitle: string) => {
        setAttributes({
            title: newTitle,
        });
    };

    return (
        <div>
            <CsekBlockHeading>Social Media Block</CsekBlockHeading>
            <CsekCard className="flex flex-row gap-4">
                <div className="flex flex-col gap-4 justify-center">
                    {Object.keys(selected).map((media: SocialMedia, i) => {
                        return (
                            <span key={`${i}_${media}_social`} className="flex flex-row gap-2 items-center">
                                <span className="w-4 flex items-center justify-center">
                                    <SocialIcon media={media} />
                                </span>
                                <CheckboxInput
                                    label={media
                                        .split("-")
                                        .map((s) =>
                                            s === "linkedin" ? "LinkedIn" : s.charAt(0).toUpperCase() + s.slice(1)
                                        )
                                        .join("-")}
                                    initialValue={selected[media]}
                                    onChange={() => handleSelection(media)}
                                />
                            </span>
                        );
                    })}
                </div>
                <VerticalBar />
                <div className="flex flex-col flex-grow gap-2">
                    <TextInput
                        label="Share title"
                        hint="Some platforms allow a title or post body to be added. You can set that here."
                        initialValue={title}
                        onChange={handleChangeTitle}
                    />
                    <TextInput
                        label="Permalink"
                        hint={`Grab the "URL" or "Permalink" from the Inspector Panel and put it here.`}
                        initialValue={permalink}
                        onChange={handleChangePermalink}
                    />
                </div>
            </CsekCard>
        </div>
    );
};

export const SocialShareBlockSave = ({ attributes }: GutenCsekBlockSaveProps<SocialShareBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { selected, permalink, title } = attributes;

    const links = Object.keys(selected).map((media: SocialMedia) => {
        if (selected[media]) {
            return (
                <li key={media}>
                    <SocialLink media={media} link={permalink} title={title} />
                </li>
            );
        }
    });

    return (
        <section {...blockProps}>
            <div className="block-content">
                <div className="social-share">
                    <strong className="share-heading">Share</strong>
                    <ul className="social-list">{links}</ul>
                </div>
            </div>
        </section>
    );
};
