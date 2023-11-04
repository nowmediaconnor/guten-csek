/*
 * Created on Sat Nov 04 2023
 * Author: Connor Doman
 */

import { useInnerBlocksProps } from "@wordpress/block-editor";
import React from "react";
import CsekCard from "./card";

interface InnerBlockEditProps {
    blockProps: Omit<Record<string, unknown>, "ref">;
}

export const InnerBlockEdit = ({ blockProps }: InnerBlockEditProps) => {
    const { children, ...innerBlockProps } = useInnerBlocksProps(blockProps);
    return <CsekCard>{children as React.ReactNode}</CsekCard>;
};

export const InnerBlockSave = ({ blockProps }: InnerBlockEditProps) => {
    const { children, ...innerBlockProps } = useInnerBlocksProps.save(blockProps);
    return <>{children as React.ReactNode}</>;
};
