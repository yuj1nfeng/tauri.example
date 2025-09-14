import ffmpeg from '../utils/ffmpeg.js';
import fs from 'node:fs/promises';
export default async (ctx) => {
    const body = await ctx.req.json();
    const { input } = body;
    const stat = await fs.stat(input);
    if (!stat.isFile()) return ctx.json('');
    const result = await ffmpeg.getMetadata(input);
    return ctx.json(result);
};
