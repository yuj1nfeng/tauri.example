import ffmpeg from '#ffmpeg';
import fs from 'node:fs/promises';
import socket from '../socket';
export const api_path = 'video.play';
export const method = 'post';
export const app = async (ctx) => {
    const body = await ctx.req.json();
    const { input } = body;
    const meta = await ffmpeg.getMetadata(input);
    // '-noborder'
    Bun.spawn(['ffplay', input, '-y', meta.video.height / 2], { stdout: 'ignore', stderr: 'ignore' });
    return ctx.json();
};