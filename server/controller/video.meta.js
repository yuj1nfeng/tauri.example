import ffmpeg from '#ffmpeg';
import fs from 'node:fs/promises';
import socket from '../socket';
export const api_path = 'video.meta';
export const method = 'post';
export const app = async (ctx) => {
    const body = await ctx.req.json();
    const { input } = body;
    const result = await ffmpeg.getMetadata(input);
    return ctx.json(result);
};
