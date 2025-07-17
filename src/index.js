import { serve as nodeServe } from '@hono/node-server';
import { Hono } from 'hono/quick';
import consola from 'consola';
import { zValidator } from '@hono/zod-validator';

import { configEnv } from './config/config.js';
import { geminiGenerativeModel } from './lib/gemini.js';

import { generateTextValidator } from './validators/generateTextValidator.js';
import { generateFromImageValidator } from './validators/generateFromImageValidator.js';
import { imageToGenerativePart } from './utils/imageToGenerativePart.js';
import { generateFromDocumentValidator } from './validators/generateFromDocumentValidator.js';
import { generateFromAudioValidator } from './validators/generateFromAudioValidator.js';

// Initialize hono app
const app = new Hono();

// Generate text endpoint
app.post('/generate-text', zValidator('json', generateTextValidator), async ctx => {
    const { prompt } = ctx.req.valid('json');
    
    const aiResult = await geminiGenerativeModel.generateContent(prompt);
    const aiText = aiResult.response.text();

    return ctx.json({
        output: aiText,
    });
});

// Generate from image endpoint
app.post('/generate-from-image', zValidator('form', generateFromImageValidator), async ctx => {
    const { image, prompt } = ctx.req.valid('form');
    const imageGenerativeParts = await imageToGenerativePart(image);

    const result = await geminiGenerativeModel.generateContent([prompt, imageGenerativeParts]);
    const aiText = result.response.text();
    return ctx.json({
        output: aiText,
    });
});

// Generate from document endpoint
app.post('/generate-from-document', zValidator('form', generateFromDocumentValidator), async ctx => {
    const { document } = ctx.req.valid('form');
    const documentGenerativeParts = await imageToGenerativePart(document);
    
    const aiResult = await geminiGenerativeModel.generateContent(['Analyze the document and provide insights:', documentGenerativeParts]);
    const aiText = aiResult.response.text();

    return ctx.json({
        output: aiText,
    });
});

// Generate from audio endpoint
app.post('/generate-from-audio', zValidator('form', generateFromAudioValidator), async ctx => {
    const { audio } = ctx.req.valid('form');
    const audioGenerativeParts = await imageToGenerativePart(audio);

    const aiResult = await geminiGenerativeModel.generateContent([
        'Transcribe or analyze the following audio:',
        audioGenerativeParts,
    ]);

    const aiText = aiResult.response.text();
    return ctx.json({
        output: aiText,
    });
});

// Handles exception
app.onError((err, ctx) => {
    return ctx.json({
        error: err.message,
    }, 500);
});

nodeServe({
    port: configEnv.PORT,
    fetch: app.fetch,
    hostname: configEnv.HOSTNAME,
}, (addr) => {
    consola.info(`Server is running at http://${addr.address}:${addr.port}`);
    consola.info(`Press Ctrl+C to stop the server`);
});
