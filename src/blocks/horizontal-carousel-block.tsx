/*
 * Created on Fri Aug 18 2023
 * Author: Connor Doman
 */

import React from "react";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
    Button,
    PanelBody,
    IconButton,
    TextControl,
    TextareaControl,
    Panel,
    Card,
    CardHeader,
    CardBody,
    __experimentalText as Text,
    __experimentalVStack as VStack,
    CardFooter,
} from "@wordpress/components";
import { Heading } from "../components/heading";
import { CsekBlockHeading } from "../components/heading";
import { GutenCsekBlockEditProps, GutenCsekBlockSaveProps } from "../scripts/dom";

export interface HorizontalCarouselBlockAttributes {
    titles: string[];
    statements: string[];
    numItems: number;
}

export const HorizontalCarouselBlockEdit = ({
    attributes,
    setAttributes,
}: GutenCsekBlockEditProps<HorizontalCarouselBlockAttributes>) => {
    const { titles, statements, numItems = 1 } = attributes;

    const titleChange = (value: string, index: number) => {
        const newTitles = [...titles];
        newTitles[index] = value;
        setAttributes({ titles: newTitles });
    };

    const statementChange = (value: string, index: number) => {
        const newStatements = [...statements];
        newStatements[index] = value;
        setAttributes({ statements: newStatements });
    };

    const cards: JSX.Element[] = [];
    for (let i = 0; i < numItems; i++) {
        cards.push(
            <Card key={i}>
                <CardHeader>
                    <Heading level="2">Card {i + 1}</Heading>
                </CardHeader>
                <CardBody>
                    <TextControl
                        label="Title"
                        value={titles[i]}
                        onChange={(s) => titleChange(s, i)}
                        placeholder="Title"
                    />
                    <TextareaControl
                        label="Statement"
                        value={statements[i]}
                        onChange={(s) => statementChange(s, i)}
                        placeholder="Statement"
                    />
                </CardBody>
            </Card>
        );
    }

    return (
        <div>
            <InspectorControls>
                <PanelBody title="Horizontal Carousel Block Editor">
                    {cards}
                    <Button onClick={() => setAttributes({ numItems: numItems + 1 })} icon="plus">
                        Add Card
                    </Button>
                </PanelBody>
            </InspectorControls>
            <div>
                <CsekBlockHeading>Csek Horizontal Carousel Block</CsekBlockHeading>
                <em className="em-label">Check the inspector panel to add elements</em>
                <p>
                    {numItems} item{numItems != 1 ? "s" : ""} in list.
                </p>
            </div>
        </div>
    );
};

export const HorizontalCarouselBlockSave = ({
    attributes,
}: GutenCsekBlockSaveProps<HorizontalCarouselBlockAttributes>) => {
    const blockProps = useBlockProps.save();

    const { titles, statements, numItems = 1 } = attributes;

    const items: JSX.Element[] = [];
    for (let i = 0; i < numItems; i++) {
        items.push(
            <li key={i} className="carousel-item">
                <h1>{i + 1}</h1>
                <div className="carousel-item-body">
                    <h2>{titles[i]}</h2>
                    <p>{statements[i]}</p>
                </div>
            </li>
        );
    }

    return (
        <>
            <div {...blockProps}>
                <div className="carousel-wrapper">
                    <div className="carousel-slider">
                        <ul className="carousel">{items}</ul>
                    </div>

                    <div className="carousel-slider-progress">
                        <div className="status">
                            <p>
                                Progress&nbsp;
                                <span className="start">01</span>&nbsp;/&nbsp;<span className="stop">04</span>
                            </p>
                            <p>
                                <a className="skip" href="#skip-carousel">
                                    Skip
                                </a>
                            </p>
                        </div>
                        <div className="bar">
                            <span className="progress"></span>
                        </div>
                    </div>
                </div>
            </div>
            <span id="skip-carousel"></span>
        </>
    );
};
