import ffmpeg from '#ffmpeg';
import fs from 'node:fs/promises';
import socket from '../socket';
export default async (ctx) => {
    const body = await ctx.req.json();
    const { input } = body;
    const result = await ffmpeg.getMetadata(input);
    return ctx.json(result);
};
