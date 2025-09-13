import ffmpeg from '../utils/ffmpeg.js';
import fs from 'node:fs/promises';
export default async (ctx) => {
    const body = await ctx.req.json();
    const { input } = body;
    const stat = await fs.stat(input);
    if (!stat.isFile()) return ctx.json({});
    const meta = await ffmpeg.getMetadata(input);
    const stdio = ['ignore', 'ignore', 'ignore'];
    // ffplay '-noborder'
    // Bun.spawn(['ffplay', input, '-y', '-noborder', meta.video.height / 2], { stdio: stdio });
    // vlc
    Bun.spawn(['vlc', '--zoom', '0.5', input], { stdio: stdio });
    return ctx.json({});
};
