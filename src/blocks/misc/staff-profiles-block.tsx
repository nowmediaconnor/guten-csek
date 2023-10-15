/*
 * Created on Sat Oct 14 2023
 * Author: Connor Doman
 */

import React from "react";
import { useBlockProps } from "@wordpress/block-editor";
import { GutenCsekBlockProps } from "../../scripts/dom";
import { CsekAddButton, CsekDeleteButton } from "../../components/button";
import { RichTextInput, TextInput, RichTextContent } from "../../components/input";
import { CsekMediaUpload } from "../../components/media-upload";

export interface StaffProfile {
    name: string;
    position: string;
    description: string;
    socialMedia: string[]; // e.g. LinkedIn|https://www.linkedin.com/
    imageURL: string;
}

export interface StaffProfilesBlockAttributes {
    heading: string;
    caption: string;
    profiles: StaffProfile[];
}

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
            socialMedia: [],
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
                <TextInput
                    label="Name"
                    initialValue={p.name}
                    onChange={(v) => handleChangeProfile({ ...p, name: v }, i)}
                />
                <TextInput
                    label="Position"
                    initialValue={p.position}
                    onChange={(v) => handleChangeProfile({ ...p, position: v }, i)}
                />
                <RichTextInput
                    label="Description"
                    initialValue={p.description}
                    onChange={(v) => handleChangeProfile({ ...p, description: v }, i)}
                />
                <CsekMediaUpload
                    type="image"
                    urlAttribute={p.imageURL}
                    onChange={(v) => handleChangeProfile({ ...p, imageURL: v }, i)}
                />
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

const StaffProfileComponent = ({ name, position, description, socialMedia, imageURL }: StaffProfile) => {
    const socials = socialMedia.map((sm) => {
        const [name, url] = sm.split("|");
        return (
            <a href={url}>
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
                                <h3>Socials</h3>
                                {socials}
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

export const StaffProfilesBlockSave = ({ attributes }: GutenCsekBlockProps<StaffProfilesBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { heading, caption, profiles } = attributes;

    const profileElements = profiles.map((p) => {
        return <StaffProfileComponent {...p} />;
    });

    return (
        <section {...blockProps} className="">
            {profileElements}
        </section>
    );
};
