/*
 * Created on Sat Nov 04 2023
 * Author: Connor Doman
 */

import React from "react";

interface CyclingStackProps {
    cyclingWords: string[];
    keyword: string;
}

export const CyclingStack = ({ cyclingWords, keyword }: CyclingStackProps) => {
    const wordsList = cyclingWords.map((word, index) => {
        return (
            <span key={index} className="cycling-word">
                {word}
            </span>
        );
    });

    return (
        <div className="cycling-stack">
            <div className="words-list">{wordsList}</div>
            <span className="keyword">{keyword}</span>
        </div>
    );
};
