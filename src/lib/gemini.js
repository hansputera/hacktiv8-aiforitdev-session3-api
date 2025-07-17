import { GoogleGenerativeAI } from "@google/generative-ai";
import { configEnv } from "../config/config.js";

export const geminiGenerativeAi = new GoogleGenerativeAI(configEnv.GEMINI_API_KEY);
export const geminiGenerativeModel = geminiGenerativeAi.getGenerativeModel({
    model: 'gemini-2.5-flash',
});
