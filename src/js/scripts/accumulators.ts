/*
 * Created on Sun Oct 08 2023
 * Author: Connor Doman
 */

import { log } from "../guten-csek";

const wrapNumbersInSpans = (inputString: string, className: string = "js-accumulator-number") => {
    const regex = /\d+/g;
    return inputString.replace(regex, (match) => `<span class="${className}">${match}</span>`);
};

export const runAccumulators = () => {
    log("Accumulators...");
    const allAccumulators: NodeListOf<HTMLElement> = document.querySelectorAll(".js-accumulator");

    allAccumulators.forEach((accumulator) => {
        const stringValue: string = accumulator.innerText;
        const wrappedNumbers: string = wrapNumbersInSpans(stringValue);

        accumulator.innerHTML = wrappedNumbers;
    });

    const accumulatorNumbers: NodeListOf<HTMLSpanElement> = document.querySelectorAll(".js-accumulator-number");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                log("Number is visible...");
                setTimeout(() => {
                    const number: HTMLSpanElement = entry.target as HTMLSpanElement;
                    const numberValue: number = parseInt(number.innerText, 10);

                    const increment: number = Math.ceil(numberValue / 33.333);

                    let counter: number = 0;
                    const interval = setInterval(() => {
                        counter += increment;
                        number.innerText = counter.toString();

                        if (counter >= numberValue) {
                            clearInterval(interval);
                            number.innerText = numberValue.toString();
                        }
                    }, 32);

                    observer.unobserve(number);
                }, 100);
            }
        });
    });

    accumulatorNumbers.forEach((number) => {
        observer.observe(number);
    });
};
