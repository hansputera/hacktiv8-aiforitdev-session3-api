import { fileTypeFromBuffer } from "file-type";
import z from "zod";

export const generateTextValidator = z.object({
    prompt: z.string().min(5, "Prompt is required"),
});
