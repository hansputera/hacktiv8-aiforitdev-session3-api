import { fileTypeFromBuffer } from "file-type";
import z from "zod";

export const generateFromImageValidator = z.object({
    image: z.file().refine(async arg => {
        const mime = await fileTypeFromBuffer(await arg.arrayBuffer());
        if (!mime || !mime?.mime.startsWith('image/')) {
            return false;
        }
    
        return true;
    }),
    prompt: z.string().min(5, {
        message: 'Prompt must not be empty',
    }),
});