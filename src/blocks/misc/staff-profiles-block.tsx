/*
 * Created on Sat Oct 14 2023
 * Author: Connor Doman
 */

import React, { useState } from "react";
import { useBlockProps } from "@wordpress/block-editor";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";
import { CloseButton, CsekAddButton, CsekDeleteButton } from "../../components/button";
import { RichTextInput, TextInput, RichTextContent, CheckboxInput } from "../../components/input";
import { CsekMediaUpload } from "../../components/media-upload";
import { CsekBlockHeading, Heading } from "../../components/heading";
import { OutboundLink } from "../../components/links";
import CsekCard from "../../components/card";

export type SocialMedia = "LinkedIn" | "Facebook" | "Twitter" | "Instagram" | "YouTube" | "TikTok" | "Snapchat";
export type SocialMediaGroup = { [key in SocialMedia]?: string };

export const SocialMediaIcons: SocialMediaGroup = {
    LinkedIn: "fa fa-linkedin",
    Facebook: "fa fa-facebook",
    Twitter: "fa-brands fa-x-twitter",
    Instagram: "fa fa-instagram",
    YouTube: "fa fa-youtube",
    TikTok: "fa-brands fa-tiktok",
    Snapchat: "fa fa-snapchat",
};

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
    alternateLayout: boolean;
}

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

    // typescript is dumb (but not as dumb as javascript)
    const checkboxes = (Object.keys(SocialMediaIcons) as SocialMedia[]).map((sm: SocialMedia) => {
        return <SocialCheckbox name={sm} value={socials[sm] || ""} onChange={handleChange} />;
    });

    return (
        <CsekCard className="gap-2 flex flex-col">
            <Heading level="3">Social Media</Heading>
            {checkboxes}
        </CsekCard>
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
        <CsekCard className="flex flex-col gap-2">
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
            <div className="flex flex-row gap-2">
                <SocialsSelect
                    initialValue={staffProfile.socialMedia}
                    onChange={(v) => handleChangeProfile({ ...staffProfile, socialMedia: v })}
                />
                <CsekMediaUpload
                    type="image"
                    urlAttribute={staffProfile.imageURL}
                    onChange={(v) => handleChangeProfile({ ...staffProfile, imageURL: v })}
                    label="Profile Photo"
                />
            </div>
        </CsekCard>
    );
};

export const StaffProfilesBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<StaffProfilesBlockAttributes>) => {
    const blockProps = useBlockProps();

    const { heading, caption, profiles, alternateLayout } = attributes;

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

    const handleUseAlternateLayout = (v: boolean) => {
        setAttributes({ alternateLayout: v });
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
            <div className="flex flex-col gap-2">
                <StaffProfileComponentEdit profile={p} onChange={(v) => handleChangeProfile(v, i)} />
                <CsekDeleteButton onDelete={() => deleteStaffProfile(i)} label={`Delete "${p.name}"`} />
            </div>
        );
    });

    return (
        <div {...blockProps} className="csek-block">
            <CsekBlockHeading>Csek Staff Showcase Block</CsekBlockHeading>
            <CsekCard className="flex flex-col gap-2">
                <TextInput label="Heading" initialValue={heading} onChange={handleChangeHeading} />
                <TextInput label="Caption" initialValue={caption} onChange={handleChangeCaption} />
                <CheckboxInput
                    label="Alternate Layout"
                    initialValue={alternateLayout}
                    onChange={handleUseAlternateLayout}
                />
            </CsekCard>
            <div className="flex flex-col gap-2">{staffProfiles}</div>
            <CsekAddButton onAdd={newStaffProfile} className="my-4" label="Add Staff Profile" />
        </div>
    );
};

type StaffProfileComponent = React.ComponentType<StaffProfile>;

const StaffProfileComponent = ({ name, position, description, socialMedia, imageURL }: StaffProfile) => {
    const socials = Object.entries(socialMedia).map(([name, url]) => {
        if (url === "") return null;

        return (
            <OutboundLink href={url} className="social-link">
                <i className={SocialMediaIcons[name]}></i>
            </OutboundLink>
        );
    });

    return (
        <div className="staff-profile">
            <div className="profile-content">
                <div className="bio">
                    <header>
                        <div className="name">
                            <h1>{name}</h1>
                            <CloseButton />
                        </div>
                        <h2>{position}</h2>
                    </header>
                    <main>
                        <RichTextContent value={description} />
                    </main>
                    <footer>
                        {socials.length > 0 && !socials.every((link) => link === null) ? (
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

export const StaffProfilesBlockSave = ({ attributes }: GutenCsekBlockSaveProps<StaffProfilesBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { heading, caption, profiles, alternateLayout } = attributes;

    const profileElements = profiles.map((p) => {
        return <StaffProfileSummary {...p} fullProfile={<StaffProfileComponent {...p} />} />;
    });

    return (
        <section {...blockProps} className="" style={{ marginBottom: alternateLayout ? "0" : "-10rem" }}>
            <div className="block-content">
                <div className="block-header">
                    <h2>{heading}</h2>
                    {caption ? <p>{caption}</p> : null}
                </div>
                <div className={`profiles-area ${alternateLayout ? "alternate" : ""}`}>{profileElements}</div>
            </div>
        </section>
    );
};
