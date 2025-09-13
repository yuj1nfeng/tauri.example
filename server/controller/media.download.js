import ffmpeg from '../utils/ffmpeg.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { emitEvent } from '../middleware/sse.js';
import dayjs from 'dayjs';
import consts from '#consts';
export default async (ctx) => {
    const body = await ctx.req.json();
    const { url } = body;
    const output_dir = '/Users/yujf/Downloads/%(title)s.%(ext)s';
    await Bun.$`yt-dlp -o ${output_dir} --cookies-from-browser chrome ${url}`;
   
    return ctx.json({  });
};
