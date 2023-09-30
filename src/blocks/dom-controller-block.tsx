/*
 * Created on Mon Sep 18 2023
 * Author: Connor Doman
 */

import React from "react";
import { ControllerScript, GutenbergBlockProps, controllerScriptRegistry } from "../scripts/dom";
import { Heading } from "../components/heading";

export const DOMControllerBlockEdit = ({ attributes, setAttributes }: GutenbergBlockProps) => {
    const { controllerScripts, enabledScripts } = attributes;

    const setScriptEnabled = (index: number, enabled: boolean) => {
        const newEnabledScripts = [...enabledScripts];
        newEnabledScripts[index] = enabled;
        setAttributes({ enabledScripts: newEnabledScripts });
    };

    const domControllerScripts = controllerScriptRegistry.map((controller: ControllerScript, index: number) => {
        return (
            <span className="row">
                <input
                    type="checkbox"
                    checked={enabledScripts[index]}
                    onChange={() => setScriptEnabled(index, !enabledScripts[index])}
                />
                <Heading level="4">{controller.name}</Heading>
            </span>
        );
    });

    return (
        <section>
            <Heading level="2">Script Manager Block</Heading>
            <div className="column csek-card">{domControllerScripts}</div>
        </section>
    );
};

export const DOMControllerBlockSave = ({ attributes }: GutenbergBlockProps) => {
    const { controllerScripts, enabledScripts } = attributes;

    const enabledScriptElements: string[] = [];
    const enabledScriptShortnames: string[] = [];

    enabledScripts.forEach((enabled: boolean, index: number) => {
        const scriptInfo = controllerScriptRegistry[index];
        if (enabled) {
            const parameters = scriptInfo.parameters.map((parameter: string) => {
                return `"${parameter}"`;
            });
            enabledScriptElements.push(
                `const ${scriptInfo.shortName} = new ${scriptInfo.name}(${parameters.join(", ")});`
            );
            enabledScriptShortnames.push(scriptInfo.shortName);
        }
    });

    return (
        <div>
            <script>{`
            window.addEventListener("load", () => {
                ${enabledScriptElements.join("\n")}
                window.domController = new DOMController(
                    ${enabledScriptShortnames.join(", ")}
                );
                setTimeout(() => {
                    if (!window.domController.isStarted) {
                        window.domController.hideLoadingPanel();
                    }
                }, 1000);
            });
            `}</script>
        </div>
    );
};
