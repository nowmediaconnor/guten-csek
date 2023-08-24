/*
 * Created on Wed Aug 23 2023
 * Author: Connor Doman
 */

onmessage = (e) => {
    const imageData = e.data;

    const { width, height, data } = imageData;

    setTimeout(() => {
        const colors = new Map();

        const pollingRate = 10;

        for (let i = 0; i < data.length; i += 4 * pollingRate) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (a === 0) continue;

            const color = `rgb(${r}, ${g}, ${b})`;
            if (colors.has(color)) {
                colors.set(color, colors.get(color) + 1);
            } else {
                colors.set(color, 1);
            }
        }

        const sortedColors = new Map([...colors.entries()].sort((a, b) => b[1] - a[1]));

        const color = sortedColors.keys().next().value;
        if (!color) return "rgb(0,0,0)";

        postMessage(color);
    }, 0);
};
