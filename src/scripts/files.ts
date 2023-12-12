/*
 * Created on Fri Aug 25 2023
 * Author: Connor Doman
 */

// https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript
export const imageToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const okMimes = ["image/jpeg", "image/png", "image/gif"];
    if (!blob || !okMimes.includes(blob.type)) {
        throw new Error("Blob is null");
    }

    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const getImageColor = async (url: string): Promise<string> => {
    try {
        const base64Data = await imageToBase64(url);

        const fileName = url.split("/").pop();

        const res = await fetch("/wp-json/csek/v2/img-color", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ base64Data, fileName }),
        });
        const body = JSON.parse(await res.json());

        const { rgb } = body;

        console.log("rgb:", rgb);

        if (!rgb) {
            throw new Error(`Color is null. URL: ${url}`);
        }
        return rgb;
    } catch (err: any) {
        console.log("Error:", err);
    }

    return "rgb(19,19,19)";
};
