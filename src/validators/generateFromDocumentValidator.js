import { fileTypeFromBuffer } from "file-type";
import z from "zod";

export const generateFromDocumentValidator = z.object({
    document: z.file().refine(async arg => {
            const mime = await fileTypeFromBuffer(await arg.arrayBuffer());
            if (!mime || !mime?.mime.startsWith('application/')) {
                return false;
            }
    
            return true;
        }),
});
