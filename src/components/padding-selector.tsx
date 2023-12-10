/*
 * Created on Sat Dec 09 2023
 * Author: Connor Doman
 */

import React from "react";
import {
    Card,
    CardBody,
    CardHeader,
    CheckboxControl,
    __experimentalHeading as Heading,
    HorizontalRule,
    __experimentalHStack as HStack,
    __experimentalVStack as VStack,
    __experimentalNumberControl as NumberControl,
    SelectControl,
    Flex,
    FlexItem,
} from "@wordpress/components";

type PaddingUnits = "px" | "rem" | "em" | "%";

export interface Padding {
    unit: PaddingUnits;
    top: number;
    left: number;
    bottom: number;
    right: number;
}

export const defaultPadding: Padding = {
    unit: "px",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
};

export function styleFromPadding(padding: Padding): Partial<React.CSSProperties> {
    return {
        paddingTop: `${padding.top}${padding.unit}`,
        paddingLeft: `${padding.left}${padding.unit}`,
        paddingBottom: `${padding.bottom}${padding.unit}`,
        paddingRight: `${padding.right}${padding.unit}`,
    };
}

interface CsekPaddingSelectorProps {
    onChange: (padding: Padding) => void;
    padding: Padding;
}

export const CsekPaddingSelector = ({ onChange, padding }: CsekPaddingSelectorProps) => {
    const [unit, setUnit] = React.useState<PaddingUnits>(padding.unit ?? "px");
    const [top, setTop] = React.useState<number>(padding.top ?? 0);
    const [left, setLeft] = React.useState<number>(padding.left ?? 0);
    const [bottom, setBottom] = React.useState<number>(padding.bottom ?? 0);
    const [right, setRight] = React.useState<number>(padding.right ?? 0);
    const [matchHorizontal, setMatchHorizontal] = React.useState<boolean>(left === right);
    const [matchVertical, setMatchVertical] = React.useState<boolean>(top === bottom);

    const convertNumber = (v: string | undefined) => {
        if (v) {
            return parseInt(v);
        }
        return 0;
    };

    const handleMatchVertical = (v: boolean) => {
        setMatchVertical(v);
        if (v) {
            setBottom(top);
        }
    };

    const handleMatchHorizontal = (v: boolean) => {
        setMatchHorizontal(v);
        if (v) {
            setRight(left);
        }
    };

    const handleSetTop = (v: string | undefined) => {
        const num = convertNumber(v);
        setTop(num);
        if (matchVertical) {
            setBottom(num);
        }
    };

    const handleSetLeft = (v: string | undefined) => {
        const num = convertNumber(v);
        setLeft(num);
        if (matchHorizontal) {
            setRight(num);
        }
    };

    React.useEffect(() => {
        onChange({
            unit,
            top,
            left,
            bottom,
            right,
        });
    }, [unit, top, left, bottom, right]);

    const unitOptions: { label: PaddingUnits; value: PaddingUnits }[] = [
        { label: "px", value: "px" },
        { label: "rem", value: "rem" },
        { label: "em", value: "em" },
        { label: "%", value: "%" },
    ];

    return (
        <Card>
            <CardBody>
                <Heading level="3">Block Padding</Heading>
                <Flex align="flex-start">
                    <FlexItem>
                        <CheckboxControl
                            label="Match Horizontal"
                            onChange={(v) => handleMatchHorizontal(v)}
                            checked={matchHorizontal}
                        />
                        <CheckboxControl
                            label="Match Vertical"
                            onChange={(v) => handleMatchVertical(v)}
                            checked={matchVertical}
                        />
                    </FlexItem>
                    <FlexItem>
                        <SelectControl
                            multiple={false}
                            label="Units"
                            options={unitOptions}
                            value={unit}
                            onChange={(v: string) => setUnit(v as PaddingUnits)}
                            className="w-max"
                        />
                    </FlexItem>
                </Flex>
                <HorizontalRule />
                <NumberControl label="Top" onChange={handleSetTop} value={top} />
                <NumberControl label="Left" onChange={handleSetLeft} value={left} />
                <NumberControl
                    label="Bottom"
                    onChange={(v: string | undefined) => setBottom(convertNumber(v))}
                    value={bottom}
                    disabled={matchVertical}
                />
                <NumberControl
                    label="Right"
                    onChange={(v: string | undefined) => setRight(convertNumber(v))}
                    value={right}
                    disabled={matchHorizontal}
                />
            </CardBody>
        </Card>
    );
};

export default CsekPaddingSelector;
