import ffmpeg from '#ffmpeg';
import fs from 'node:fs/promises';

export const api_path = 'remove.audio';
export const method = 'post';

export const app = async (ctx) => {
    const body = await ctx.req.json();

    const { } = body;

    const result = await ffmpeg.autoCutVideo(body);
    return ctx.json({ output: result });
};
