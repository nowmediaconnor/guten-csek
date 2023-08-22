/*
 * Created on Fri Aug 18 2023
 * Author: Connor Doman
 */

import React from "react";
import { InspectorControls } from "@wordpress/block-editor";
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
    __experimentalHeading as Heading,
    __experimentalText as Text,
    __experimentalVStack as VStack,
    CardFooter,
} from "@wordpress/components";

export interface HorizontalCarouselBlockProps {
    attributes: {
        titles: string[];
        statements: string[];
        numItems: number;
    };
    setAttributes?: any;
}

export const HorizontalCarouselBlockEdit = ({ attributes, setAttributes }: HorizontalCarouselBlockProps) => {
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
                    <Heading level={2}>Card {i + 1}</Heading>
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
                <h2>Horizontal Carousel Block</h2>
                <p>{numItems} items in list.</p>
            </div>
        </div>
    );
};

export const HorizontalCarouselBlockSave = ({ attributes }: HorizontalCarouselBlockProps) => {
    const { titles, statements, numItems = 1 } = attributes;

    const items: JSX.Element[] = [];
    for (let i = 0; i < numItems; i++) {
        items.push(
            <div key={i} className="carousel-item">
                <h1>{i + 1}</h1>
                <div className="carousel-item-body">
                    <h2>{titles[i]}</h2>
                    <p>{statements[i]}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="carousel">{items}</div>

            <div className="carousel-slider-progress">
                <div className="status">
                    <a href="#prev" className="prev">
                        <i className="fa fa-chevron-left"></i>
                    </a>
                    <p>
                        Progress&nbsp;
                        <span className="start">01</span>&nbsp;/&nbsp;<span className="stop">04</span>
                    </p>
                    <a href="#next" className="next">
                        <i className="fa fa-chevron-right"></i>
                    </a>
                </div>
                <div className="bar">
                    <span className="progress"></span>
                </div>
            </div>
        </div>
    );
};
