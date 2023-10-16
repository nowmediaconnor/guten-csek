/*
 * Created on Sat Oct 14 2023
 * Author: Connor Doman
 */

import React, { useState } from "react";
import { useBlockProps } from "@wordpress/block-editor";
import { GutenCsekBlockProps } from "../../scripts/dom";
import { CsekAddButton, CsekDeleteButton } from "../../components/button";
import { RichTextInput, TextInput, RichTextContent } from "../../components/input";
import { CsekMediaUpload } from "../../components/media-upload";
import { Heading } from "../../components/heading";

export type SocialMedia = "LinkedIn" | "Facebook" | "Twitter" | "Instagram" | "YouTube" | "TikTok" | "Snapchat";

export type SocialMediaGroup = { [key in SocialMedia]?: string };

export interface StaffProfile {
    name: string;
    position: string;
    description: string;
    socialMedia: SocialMediaGroup;
    imageURL: string;
}

export interface StaffProfilesBlockAttributes {
    heading: string;
    caption: string;
    profiles: StaffProfile[];
}

const SOCIAL_MEDIA: SocialMedia[] = ["LinkedIn", "Facebook", "Twitter", "Instagram", "YouTube", "TikTok", "Snapchat"];

interface SocialCheckboxProps {
    name: SocialMedia;
    value: string;
    onChange: (site: string, url: string) => void;
}

const SocialCheckbox = ({ name, value, onChange }: SocialCheckboxProps) => {
    const [checked, setChecked] = useState(value !== "");
    const [url, setURL] = useState(value);

    return (
        <div className="flex flex-row justify-start items-center">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                    setChecked(e.target.checked);
                    if (!e.target.checked) {
                        setURL("");
                        onChange(name, "");
                    }
                }}
            />
            <Heading level="4">{name}</Heading>
            <TextInput
                placeholder="Link to profile"
                initialValue={url}
                onChange={(v) => {
                    setURL(v);
                    onChange(name, v);
                }}
                disabled={!checked}
            />
        </div>
    );
};

interface SocialsSelectProps {
    initialValue: SocialMediaGroup;
    onChange: (v: SocialMediaGroup) => void;
}

const SocialsSelect = ({ initialValue, onChange }: SocialsSelectProps) => {
    const [socials, setSocials] = useState<SocialMediaGroup>(initialValue);

    const handleChange = (site: string, url: string) => {
        const newSocials = { ...socials };
        newSocials[site] = url;
        setSocials(newSocials);
        onChange(newSocials);
    };

    const checkboxes = SOCIAL_MEDIA.map((sm) => {
        return <SocialCheckbox name={sm} value={socials[sm] || ""} onChange={handleChange} />;
    });

    return (
        <div className="csek-card">
            <Heading level="3">Social Media</Heading>
            {checkboxes}
        </div>
    );
};

interface StaffProfileComponentEditProps {
    profile: StaffProfile;
    onChange: (v: StaffProfile) => void;
}

const StaffProfileComponentEdit = ({ profile, onChange }: StaffProfileComponentEditProps) => {
    const [staffProfile, setStaffProfile] = useState<StaffProfile>(profile);

    const handleChangeProfile = (v: StaffProfile) => {
        setStaffProfile(v);
        onChange(v);
    };

    return (
        <div className="csek-card">
            <TextInput
                label="Name"
                initialValue={staffProfile.name}
                onChange={(v) => handleChangeProfile({ ...staffProfile, name: v })}
            />
            <TextInput
                label="Position"
                initialValue={staffProfile.position}
                onChange={(v) => handleChangeProfile({ ...staffProfile, position: v })}
            />
            <RichTextInput
                label="Description"
                initialValue={staffProfile.description}
                onChange={(v) => handleChangeProfile({ ...staffProfile, description: v })}
            />
            <div className="flex flex-row">
                <SocialsSelect
                    initialValue={staffProfile.socialMedia}
                    onChange={(v) => handleChangeProfile({ ...staffProfile, socialMedia: v })}
                />
                <CsekMediaUpload
                    type="image"
                    urlAttribute={staffProfile.imageURL}
                    onChange={(v) => handleChangeProfile({ ...staffProfile, imageURL: v })}
                />
            </div>
        </div>
    );
};

export const StaffProfilesBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockProps<StaffProfilesBlockAttributes>) => {
    const blockProps = useBlockProps();

    const { heading, caption, profiles } = attributes;

    const handleChangeHeading = (v: string) => {
        setAttributes({ heading: v });
    };

    const handleChangeCaption = (v: string) => {
        setAttributes({ caption: v });
    };

    const handleChangeProfile = (v: StaffProfile, i: number) => {
        const newProfiles = [...profiles];
        newProfiles[i] = v;
        setAttributes({ profiles: newProfiles });
    };

    const newStaffProfile = () => {
        const newProfiles = [...profiles];
        newProfiles.push({
            name: "",
            position: "",
            description: "",
            socialMedia: {},
            imageURL: "",
        });
        setAttributes({ profiles: newProfiles });
    };

    const deleteStaffProfile = (i: number) => {
        const newProfiles = [...profiles];
        newProfiles.splice(i, 1);
        setAttributes({ profiles: newProfiles });
    };

    const staffProfiles = profiles.map((p, i) => {
        return (
            <div className="border border-solid border-black p-4">
                <StaffProfileComponentEdit profile={p} onChange={(v) => handleChangeProfile(v, i)} />
                <CsekDeleteButton onDelete={() => deleteStaffProfile(i)} />
            </div>
        );
    });

    return (
        <div {...blockProps} className="p-4 flex flex-col">
            <h2>Staff Profiles Block</h2>
            <TextInput label="Heading" initialValue={heading} onChange={handleChangeHeading} />
            <TextInput label="Caption" initialValue={caption} onChange={handleChangeCaption} />
            {staffProfiles}
            <CsekAddButton onAdd={newStaffProfile} />
        </div>
    );
};

const CloseButton = () => {
    return (
        <button className="close-button">
            <div className="cross"></div>
        </button>
    );
};

type StaffProfileComponent = React.ComponentType<StaffProfile>;

const StaffProfileComponent = ({ name, position, description, socialMedia, imageURL }: StaffProfile) => {
    const socials = Object.entries(socialMedia).map(([name, url]) => {
        return (
            <a href={url} className="social-link">
                <i className={`fa fa-${name.toLowerCase()}`}></i>
            </a>
        );
    });

    return (
        <div className="staff-profile">
            <div className="profile-content">
                <div className="bio">
                    <CloseButton />
                    <header>
                        <h1>{name}</h1>
                        <h2>{position}</h2>
                    </header>
                    <main>
                        <RichTextContent value={description} />
                    </main>
                    <footer>
                        {socials ? (
                            <>
                                <h3>Social</h3>
                                <div className="social-links">{socials}</div>
                            </>
                        ) : null}
                    </footer>
                </div>
                <div className="image">
                    <img src={imageURL} alt={name + "'s profile photo"} />
                </div>
            </div>
        </div>
    );
};

interface StaffProfileSummaryProps extends StaffProfile {
    fullProfile: React.ReactNode;
}

const StaffProfileSummary = ({ name, position, imageURL, fullProfile }: StaffProfileSummaryProps) => {
    return (
        <div className="staff-summary">
            <div className="image">
                <img src={imageURL} alt={name + "'s profile photo"} />
            </div>
            <div className="info">
                <h1>{name}</h1>
                <span className="separator">•</span>
                <h2>{position}</h2>
            </div>
            {fullProfile}
        </div>
    );
};

export const StaffProfilesBlockSave = ({ attributes }: GutenCsekBlockProps<StaffProfilesBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { heading, caption, profiles } = attributes;

    const profileElements = profiles.map((p) => {
        return <StaffProfileSummary {...p} fullProfile={<StaffProfileComponent {...p} />} />;
    });

    return (
        <section {...blockProps} className="">
            <div className="block-content">
                <div className="block-header">
                    <h2>{heading}</h2>
                    <p>{caption}</p>
                </div>
                <div className="profiles-area">{profileElements}</div>
            </div>
        </section>
    );
};
