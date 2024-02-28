/*
 * Created on Wed Feb 28 2024
 * Author: Connor Doman
 */

import { CsekBlockHeading } from "../../components/heading";
import { SocialMedia } from "../../components/social/link";
import { GutenCsekBlockEditProps } from "../../scripts/dom";

type SocialMediaSelections = {
    [K in SocialMedia]: boolean;
};

export interface SocialShareBlockAttributes {
    selected: SocialMediaSelections;
}

export const SocialShareBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<SocialShareBlockAttributes>) => {
    const { selected } = attributes;

    const handleSelection = (media: SocialMedia) => {
        setAttributes({
            selected: {
                ...selected,
                [media]: !selected[media],
            },
        });
    };

    return (
        <div>
            <CsekBlockHeading>Social Media Block</CsekBlockHeading>
            <div>
                {Object.keys(selected).map((media) => {
                    return (
                        <label key={media}>
                            <input
                                type="checkbox"
                                checked={selected[media as SocialMedia]}
                                onChange={() => handleSelection(media as SocialMedia)}
                            />
                            {media}
                        </label>
                    );
                })}
            </div>
        </div>
    );
};
