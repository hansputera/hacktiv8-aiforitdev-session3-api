import { fileTypeFromBuffer } from "file-type";

export const imageToGenerativePart = async (image) => {
    if (!image || !(image instanceof File)) {
        throw new Error('Invalid image input');
    }

    // Convert the image to an ArrayBuffer
    const arrayBuffer = await image.arrayBuffer();

    // Determine the MIME type of the image
    const mime = await fileTypeFromBuffer(arrayBuffer);
    if (!mime) {
        throw new Error('Could not determine file MIME type');
    }

    // Return the ArrayBuffer as a part for the generative model
    return {
        inlineData: {
            data: Buffer.from(arrayBuffer).toString('base64'),
            mimeType: mime.mime,
        },
    };
}