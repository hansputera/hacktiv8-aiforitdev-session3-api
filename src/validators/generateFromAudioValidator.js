import { fileTypeFromBuffer } from "file-type";
import z from "zod";

export const generateFromAudioValidator = z.object({
    audio: z.file().refine(async arg => {
        const mime = await fileTypeFromBuffer(await arg.arrayBuffer());
        if (!mime || !mime?.mime.startsWith('audio/')) {
            return false;
        }

        return true;
    }),
});
