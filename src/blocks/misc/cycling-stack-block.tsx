/*
 * Created on Sat Nov 04 2023
 * Author: Connor Doman
 */

import React from "react";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../../scripts/dom";
import { CsekBlockHeading, Heading } from "../../components/heading";
import { TextInput } from "../../components/input";
import CsekCard from "../../components/card";
import { CsekAddButton, CsekDeleteButton } from "../../components/button";
import { CyclingStack } from "../../components/stack";

export interface CyclingStackBlockAttributes {
    cyclingWords: string[];
    keyword: string;
}

export const CyclingStackBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<CyclingStackBlockAttributes>) => {
    const { cyclingWords, keyword } = attributes;

    const handleChangeKeyword = (v: string) => {
        setAttributes({ keyword: v });
    };

    const changeCyclingWord = (value: string, index: number) => {
        const newCyclingWords = [...cyclingWords];
        newCyclingWords[index] = value;
        setAttributes({ cyclingWords: newCyclingWords });
    };

    const deleteCyclingWord = (index: number) => {
        const newCyclingWords = [...cyclingWords];
        newCyclingWords.splice(index, 1);
        setAttributes({ cyclingWords: newCyclingWords });
    };

    const addCyclingWord = () => {
        const newCyclingWords = [...cyclingWords];
        newCyclingWords.push("");
        setAttributes({ cyclingWords: newCyclingWords });
    };

    const cyclingWordsList = cyclingWords.map((word, index) => {
        return (
            <div className="flex flex-row gap-2 items-end justify-between" key={index}>
                <TextInput
                    label={index + 1 + "."}
                    placeholder="Enter a cycling word."
                    onChange={(v) => changeCyclingWord(v, index)}
                    initialValue={word}
                    className="basis-[3fr] min-w-fit"
                />
                <CsekDeleteButton
                    onDelete={() => deleteCyclingWord(index)}
                    className="basis-[1fr] min-w-max w-max"
                    label=""
                />
            </div>
        );
    });

    return (
        <div className="csek-block">
            <CsekBlockHeading>Cycling Stack Block</CsekBlockHeading>
            <CsekCard className="flex flex-col gap-2">
                <Heading level="3">Cycling Words</Heading>
                <CsekAddButton onAdd={addCyclingWord} className="absolute right-2 top-2" />
                {cyclingWordsList}
            </CsekCard>
            <TextInput
                label="Keyword"
                placeholder="Enter a keyword."
                onChange={handleChangeKeyword}
                initialValue={keyword}
            />
        </div>
    );
};

export const CyclingStackBlockSave = ({ attributes }: GutenCsekBlockSaveProps<CyclingStackBlockAttributes>) => {
    const { cyclingWords, keyword } = attributes;

    return <CyclingStack cyclingWords={cyclingWords} keyword={keyword} />;
};
