/*
 * Created on Sat Oct 21 2023
 * Author: Connor Doman
 */

import React, { useState } from "react";
import { ColorPicker } from "@wordpress/components";
import { Heading } from "./heading";
import CsekCard from "./card";

interface ColorPickerProps {
    label?: string;
    initialValue?: string;
    className?: string;
    onChange?: (v: string) => void;
}

export const CsekColorPicker = ({ label, initialValue = "", className, onChange }: ColorPickerProps) => {
    const [color, setColor] = useState<string>(initialValue);

    const handleChange = (colors: any) => {
        const newValue = colors["hex"];
        setColor(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <CsekCard>
            {label ? <Heading level="4">{label}</Heading> : null}
            <ColorPicker
                color={color}
                onChangeComplete={handleChange}
                copyFormat="hex"
                disableAlpha={true}
                className="csek-color-picker"
            />
        </CsekCard>
    );
};

export default CsekColorPicker;
