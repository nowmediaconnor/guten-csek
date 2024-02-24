/*
 * Created on Fri Feb 23 2024
 * Author: Connor Doman
 */

import { useBlockProps } from "@wordpress/block-editor";
import CsekCard from "../../components/card";
import { CsekBlockHeading, Heading, HeadingLevel } from "../../components/heading";
import { CsekSelectDropdown, SelectOption, TextInput } from "../../components/input";
import { PaddingLabel } from "../../components/label";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";

export interface HeadingBlockAttributes {
    content: string;
    level: number;
}

export const HeadingBlockEdit = ({ attributes, setAttributes }: GutenCsekBlockEditProps<HeadingBlockAttributes>) => {
    const blockProps = useBlockProps();

    const { level, content } = attributes;

    const headingLevels: SelectOption[] = Array.from({ length: 6 }, (_, i) => {
        const level = i + 1;
        const element = `h${level}`;
        return {
            value: `${level}`,
            label: element,
        };
    });

    const handleLevelChange = (level: string) => {
        const newLevel = parseInt(level);

        if (isNaN(newLevel)) {
            return;
        }

        setAttributes({ level: newLevel });
    };

    const handleContentChange = (newContent: string) => {
        setAttributes({ content: newContent });
    };

    return (
        <section>
            <CsekBlockHeading>Csek Heading</CsekBlockHeading>
            <CsekCard className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                    <TextInput label="Heading" onChange={handleContentChange} />
                    <CsekSelectDropdown
                        label="Level"
                        options={headingLevels}
                        defaultOption={1}
                        onChange={handleLevelChange}
                        initialValue={level.toString()}
                        className="w-max"
                    />
                </div>
                <PaddingLabel />
            </CsekCard>
        </section>
    );
};

export const HeadingBlockSave = ({ attributes }: GutenCsekBlockSaveProps<HeadingBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { content, level } = attributes;

    return (
        <section {...blockProps}>
            <div className="block-content">
                <Heading level={level.toString() as HeadingLevel}>{content}</Heading>
            </div>
        </section>
    );
};
